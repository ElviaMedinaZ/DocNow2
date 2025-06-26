/*
 * Descripción: Componente para la gestión de especialidades médicas. 
 * Fecha: 24 Junio de 2025
 * Programador: Elvia Medina
 */

import { useEffect, useRef, useState } from 'react';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../../styles/admin/admin-base.css';
import GenericTable from './tabla-generica';

import { obtenerEspecialidades, guardarEspecialidadEnFirebase, eliminarEspecialidadDeFirebase } from '../../utils/firebaseEspecialidades';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';


export default function EspecialidadesAdmin() {
  const [esp, setEsp] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenu] = useState(null);
  const [nueva, setNueva] = useState(null);
  const [enEdicion, setEnEdicion] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const cargarEspecialidades = async () => {
      const snap = await obtenerEspecialidades(); // Te devuelve [{ label, value }]
      const convertidas = snap.map(e => ({
        id: e.value,
        nombre: e.label || e.Especialidad || '', // <- Aseguras que se use el nombre correcto
        descripcion: e.descripcion || 'Sin descripción',
        estado: e.Estado || 'Activo',
        fotoUrl: e.FotoUrl || '', // <- aquí sí se usa el campo correcto
      }));
      setEsp(convertidas);
    };

    cargarEspecialidades();
  }, []);

  const toggleMenu = (id) => setMenu((p) => (p === id ? null : id));
  const cancelarNueva = () => setNueva(null);
  const cancelarEdicion = () => setEnEdicion(null);

  const guardarNueva = async () => {
  if (!nueva.nombre.trim()) {
    return Swal.fire({ title: 'El nombre es obligatorio', icon: 'warning' });
  }

  const duplicado = esp.some((e) => e.nombre.toLowerCase() === nueva.nombre.trim().toLowerCase());
  if (duplicado) {
    return Swal.fire({ title: 'Esa especialidad ya existe', icon: 'error' });
  }

  const especialidadFinal = {
    nombre: nueva.nombre,
    descripcion: nueva.descripcion || 'Sin descripción',
    estado: nueva.estado || 'Activo',
    fotoUrl: nueva.fotoUrl?.trim() || ''
  };


  try {
    await guardarEspecialidadEnFirebase(especialidadFinal);
    setEsp(prev => [...prev, { ...especialidadFinal, id: especialidadFinal.nombre }]);
    setNueva(null);
    Swal.fire('Guardado', 'Especialidad creada correctamente.', 'success');
  } catch (e) {
    Swal.fire('Error', 'No se pudo guardar en Firebase.', 'error');
    console.error(e);
  }
};


  const guardarEdicion = async () => {
  if (!enEdicion.nombre.trim()) {
    return Swal.fire({ title: 'El nombre es obligatorio', icon: 'warning' });
  }

  const especialidadRef = doc(db, 'Especialidades', enEdicion.id);
  try {
    await updateDoc(especialidadRef, {
      Especialidad: enEdicion.nombre,
      descripcion: enEdicion.descripcion || 'Sin descripción',
      Estado: enEdicion.estado || 'Activo',
      FotoUrl: especialidad.fotoUrl?.trim() || ''
    });

    setEsp(prev =>
      prev.map(e => e.id === enEdicion.id ? { ...enEdicion } : e)
    );
    setEnEdicion(null);
    Swal.fire('Actualizado', 'Especialidad modificada correctamente.', 'success');
  } catch (e) {
    Swal.fire('Error', 'No se pudo actualizar en Firebase.', 'error');
    console.error(e);
  }
};

  const eliminar = async (id) => {
  const reg = esp.find((e) => e.id === id);
  if (!reg) return;

  const confirm = await Swal.fire({
    title: '¿Eliminar especialidad?',
    text: `Se eliminará "${reg?.nombre}".`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#b52020',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  });

  if (confirm.isConfirmed) {
    try {
      await eliminarEspecialidadDeFirebase(id);
      setEsp((prev) => prev.filter((e) => e.id !== id));
      Swal.fire('Eliminado', 'Especialidad eliminada correctamente.', 'success');
    } catch (e) {
      Swal.fire('Error', 'No se pudo eliminar en Firebase.', 'error');
      console.error(e);
    }
  }
};
    const toggleEstado = async (id) => {
      const registro = esp.find((e) => e.id === id);
      if (!registro) return;

      const nuevoEstado = registro.estado === 'Activo' ? 'Inactivo' : 'Activo';

      try {
        const ref = doc(db, 'Especialidades', id);
        await updateDoc(ref, { estado: nuevoEstado });

        setEsp((prev) =>
          prev.map((e) => (e.id === id ? { ...e, estado: nuevoEstado } : e))
        );
      } catch (error) {
        console.error('Error al cambiar estado:', error);
        Swal.fire('Error', 'No se pudo cambiar el estado en Firebase.', 'error');
      }
    };


  const abrirNuevaFila = () => {
    setNueva({ Especialidades: '', descripcion: '', Estado: 'Activo', fotoUrl: '' });
    setMenu(null);
  };

  const editarFila = (row) => {
    setEnEdicion({ ...row });
    setMenu(null);
  };

  const filtrados = [
    ...(nueva ? [{ ...nueva, id: 'tmp' }] : []),
    ...esp.filter((e) =>
      `${e.nombre} ${e.descripcion} ${e.estado}`.toLowerCase().includes(busqueda.toLowerCase())
    ),
  ];

  const columns = [
    {
      header: 'Especialidad',
      accessor: (row) =>
        row.id === 'tmp' ? (
          <input
            className="tabla-input"
            autoFocus
            value={nueva.nombre}
            onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })}
          />
        ) : enEdicion?.id === row.id ? (
          <input
            className="tabla-input"
            value={enEdicion.nombre}
            onChange={(e) => setEnEdicion({ ...enEdicion, nombre: e.target.value })}
          />
        ) : (
          row.nombre
        ),
    },
    {
      header: 'Descripción',
      accessor: (row) =>
        row.id === 'tmp' ? (
          <input
            className="tabla-input"
            value={nueva.descripcion}
            onChange={(e) => setNueva({ ...nueva, descripcion: e.target.value })}
          />
        ) : enEdicion?.id === row.id ? (
          <input
            className="tabla-input"
            value={enEdicion.descripcion}
            onChange={(e) => setEnEdicion({ ...enEdicion, descripcion: e.target.value })}
          />
        ) : (
          row.descripcion
        ),
    },
    {
      header: 'Estado',
      accessor: (row) =>
        row.id === 'tmp' ? (
          <select
            className="tabla-select"
            value={nueva.estado}
            onChange={(e) => setNueva({ ...nueva, estado: e.target.value })}
          >
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        ) : enEdicion?.id === row.id ? (
          <select
            className="tabla-select"
            value={enEdicion.estado}
            onChange={(e) => setEnEdicion({ ...enEdicion, estado: e.target.value })}
          >
            <option>Activo</option>
            <option>Inactivo</option>
          </select>
        ) : (
          <span className={`estado-tag ${row.estado === 'Activo' ? 'activo' : 'inactivo'}`}>
            {row.estado}
          </span>
        ),
    },
    {
        header: 'Imagen',
        accessor: (row) =>
          row.id === 'tmp' ? (
            <input
              className="tabla-input"
              type="text"
              placeholder="URL de la imagen"
              value={nueva.fotoUrl}
              onChange={(e) => setNueva({ ...nueva, fotoUrl: e.target.value })}
            />
          ) : enEdicion?.id === row.id ? (
            <input
              className="tabla-input"
              type="text"
              placeholder="URL de la imagen"
              value={enEdicion.fotoUrl}
              onChange={(e) => setEnEdicion({ ...enEdicion, fotoUrl: e.target.value })}
            />
          ) : row.fotoUrl ? (
            <img
              src={row.fotoUrl}
              alt={row.nombre}
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'cover',
                borderRadius: '50%',
                border: '1px solid #ccc',
              }}
            />
          ) : (
            <span>Sin imagen</span>
          ),
      },
    {
      header: 'Acciones',
      accessor: (row) =>
        row.id === 'tmp' ? (
          <div className="fila-botones">
            <button className="btn-guardar" onClick={guardarNueva}>Guardar</button>
            <button className="btn-cancelar" onClick={cancelarNueva}>Cancelar</button>
          </div>
        ) : enEdicion?.id === row.id ? (
          <div className="fila-botones">
            <button className="btn-guardar" onClick={guardarEdicion}>Guardar</button>
            <button className="btn-cancelar" onClick={cancelarEdicion}>Cancelar</button>
          </div>
        ) : (
          <div className="acciones-wrapper">
            <button className="btn-acciones" onClick={() => toggleMenu(row.id)}>
              <FaEllipsisV />
            </button>
            {menuAbierto === row.id && (
              <div className="menu-acciones" ref={menuRef}>
                <button onClick={() => editarFila(row)}>Editar</button>
                <button onClick={() => toggleEstado(row.id)}>
                  {row.estado === 'Activo' ? 'Inactivar' : 'Activar'}
                </button>
                <button className="eliminar" onClick={() => eliminar(row.id)}>
                  Eliminar
                </button>
              </div>
            )}
          </div>
        ),
    },
  ];

  return (
    <div className="admin-especialidades-container">
      <div className="admin-especialidades-header">
        <h2>Gestión de Especialidades</h2>
        {!nueva && !enEdicion && (
          <button className="btn-agregar" onClick={abrirNuevaFila}>
            <FaPlus /> Agregar Especialidad
          </button>
        )}
      </div>

      <div className="buscador-especialidades">
        <FaSearch />
        <input
          type="text"
          placeholder="Buscar por nombre o estado..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <GenericTable
        columns={columns}
        data={filtrados}
        emptyMsg="Sin resultados"
        footer={`Mostrando ${filtrados.length - (nueva ? 1 : 0)} de ${esp.length} especialidades`}
      />
    </div>
  );
}
