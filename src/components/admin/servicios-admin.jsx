/*
 * Descripción: Módulo para gestionar los servicios médicos ofrecidos.
 * Fecha: 23 Junio de 2025
 * Programador: Elvia Medina
 */

import { useEffect, useRef, useState } from 'react';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../../styles/admin/admin-base.css';
import GenericTable from './tabla-generica';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';



export default function ServiciosAdmin() {
  const [servicios, setServicios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenu] = useState(null);
  const [nuevo, setNuevo] = useState(null);
  const [enEdicion, setEnEdicion] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
  const obtenerServicios = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'Servicios'));
      const serviciosData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          nombre: data.Servicio || '',
          categoria: doc.id.replace(/_/g, ' '), // Si el ID del doc representa categoría
          precio: data.Precio || 0,
          estado: 'Activo',
          fotoUrl: data.FotoUrl || '',
        };
      });
      setServicios(serviciosData);
    } catch (error) {
      console.error('Error al obtener servicios desde Firebase:', error);
    }
  };

  obtenerServicios();
}, []);


  const toggleMenu = (id) => setMenu((prev) => (prev === id ? null : id));
  const cancelarNuevo = () => setNuevo(null);
  const cancelarEdicion = () => setEnEdicion(null);
const guardarNuevo = async () => {
  if (!nuevo.nombre.trim() || !nuevo.categoria.trim() || !nuevo.precio) {
    return Swal.fire({ title: 'Todos los campos son obligatorios', icon: 'warning' });
  }

  const docId = nuevo.categoria.replace(/ /g, '_');
  const nuevoDoc = {
    Servicio: nuevo.nombre,
    Precio: parseFloat(nuevo.precio),
    FotoUrl: nuevo.fotoUrl || '',
    estado: nuevo.Estado || 'Activo', // ← en tu map() dentro de obtenerServicios
  };

  try {
    await setDoc(doc(db, 'Servicios', docId), nuevoDoc);
    setServicios((prev) => [...prev, { id: docId, ...nuevoDoc, categoria: nuevo.categoria, estado: 'Activo' }]);
    setNuevo(null);
  } catch (err) {
    console.error('Error al guardar servicio:', err);
  }
};

  const guardarEdicion = async () => {
  if (!enEdicion.nombre.trim() || !enEdicion.categoria.trim() || !enEdicion.precio) {
    return Swal.fire({ title: 'Todos los campos son obligatorios', icon: 'warning' });
  }

  try {
    await updateDoc(doc(db, 'Servicios', enEdicion.id), {
      Servicio: enEdicion.nombre,
      Precio: parseFloat(enEdicion.precio),
      FotoUrl: enEdicion.fotoUrl || '',
    });

    setServicios((prev) =>
      prev.map((s) => (s.id === enEdicion.id ? { ...enEdicion } : s))
    );
    setEnEdicion(null);
  } catch (err) {
    console.error('Error al actualizar servicio:', err);
  }
};


 const eliminar = (id) => {
  const reg = servicios.find((s) => s.id === id);
  Swal.fire({
    title: '¿Eliminar servicio?',
    text: `Se eliminará "${reg?.nombre}".`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#b52020',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then(async (r) => {
    if (r.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'Servicios', id));
        setServicios((prev) => prev.filter((s) => s.id !== id));
      } catch (err) {
        console.error('Error al eliminar servicio:', err);
      }
    }
  });
};


  const toggleEstado = async (id) => {
  const servicio = servicios.find((s) => s.id === id);
  if (!servicio) return;

  const nuevoEstado = servicio.estado === 'Activo' ? 'Inactivo' : 'Activo';

  try {
    await updateDoc(doc(db, 'Servicios', id), {
      Estado: nuevoEstado, // <- Agrega este campo a tu documento en Firestore
    });

    setServicios((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, estado: nuevoEstado } : s
      )
    );
  } catch (err) {
    console.error('Error al actualizar el estado:', err);
    Swal.fire({ title: 'Error al cambiar estado en Firebase', icon: 'error' });
  }
};


  const abrirNuevaFila = () => {
    setNuevo({ nombre: '', categoria: '', precio: '', fotoUrl: '', estado: 'Activo' });
    setMenu(null);
  };

  const editarFila = (row) => {
    setEnEdicion({ ...row });
    setMenu(null);
  };

  const filtrados = [
    ...(nuevo ? [{ ...nuevo, id: 'tmp' }] : []),
    ...servicios.filter((s) =>
      `${s.nombre} ${s.categoria} ${s.estado}`.toLowerCase().includes(busqueda.toLowerCase())
    ),
  ];

  const columns = [
    {
      header: 'Servicio',
      accessor: (row) =>
        row.id === 'tmp' ? (
          <input className="tabla-input" autoFocus value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
        ) : enEdicion?.id === row.id ? (
          <input className="tabla-input" value={enEdicion.nombre} onChange={(e) => setEnEdicion({ ...enEdicion, nombre: e.target.value })} />
        ) : (
          row.nombre
        ),
    },
    {
      header: 'Categoría',
      accessor: (row) =>
        row.id === 'tmp' ? (
          <input className="tabla-input" value={nuevo.categoria} onChange={(e) => setNuevo({ ...nuevo, categoria: e.target.value })} />
        ) : enEdicion?.id === row.id ? (
          <input className="tabla-input" value={enEdicion.categoria} onChange={(e) => setEnEdicion({ ...enEdicion, categoria: e.target.value })} />
        ) : (
          row.categoria
        ),
    },
    {
      header: 'Precio (MXN)',
      accessor: (row) =>
        row.id === 'tmp' ? (
          <input className="tabla-input" type="number" min="0" value={nuevo.precio} onChange={(e) => setNuevo({ ...nuevo, precio: e.target.value })} />
        ) : enEdicion?.id === row.id ? (
          <input className="tabla-input" type="number" min="0" value={enEdicion.precio} onChange={(e) => setEnEdicion({ ...enEdicion, precio: e.target.value })} />
        ) : (
          `$${row.precio}`
        ),
    },
    {
      header: 'Estado',
      accessor: (row) =>
        row.id === 'tmp' ? (
          <select className="tabla-select" value={nuevo.estado} onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value })}>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        ) : enEdicion?.id === row.id ? (
          <select className="tabla-select" value={enEdicion.estado} onChange={(e) => setEnEdicion({ ...enEdicion, estado: e.target.value })}>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        ) : (
          <span className={`estado-tag ${row.estado === 'Activo' ? 'activo' : 'inactivo'}`}>{row.estado}</span>
        ),
    },
     {header: 'Imagen',
        accessor: (row) =>
          row.id === 'tmp' ? (
            <input
              className="tabla-input"
              type="text"
              placeholder="URL de la imagen"
              value={nuevo.fotoUrl}
              onChange={(e) => setNuevo({ ...nuevo, fotoUrl: e.target.value })}
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
            <button className="btn-guardar" onClick={guardarNuevo}>Guardar</button>
            <button className="btn-cancelar" onClick={cancelarNuevo}>Cancelar</button>
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
                <button className="eliminar" onClick={() => eliminar(row.id)}>Eliminar</button>
              </div>
            )}
          </div>
        ),
    },
  ];

  return (
    <div className="admin-servicios-container">
      <div className="admin-servicios-header">
        <h2>Gestión de Servicios</h2>
        {!nuevo && !enEdicion && (
          <button className="btn-agregar" onClick={abrirNuevaFila}>
            <FaPlus /> Agregar Servicio
          </button>
        )}
      </div>

      <div className="buscador-servicios">
        <FaSearch />
        <input
          type="text"
          placeholder="Buscar por nombre, categoría o estado..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <GenericTable
        columns={columns}
        data={filtrados}
        emptyMsg="Sin resultados"
        footer={`Mostrando ${filtrados.length - (nuevo ? 1 : 0)} de ${servicios.length} servicios`}
      />
    </div>
  );
}
