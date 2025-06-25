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

const datosIniciales = [
  { id: 1, nombre: 'Cardiología', descripcion: 'Corazón y grandes vasos', estado: 'Activo' },
  { id: 2, nombre: 'Dermatología', descripcion: 'Piel, pelo y uñas', estado: 'Activo' },
  { id: 3, nombre: 'Pediatría', descripcion: 'Salud infantil', estado: 'Activo' },
  { id: 4, nombre: 'Neurología', descripcion: 'Sistema nervioso', estado: 'Inactivo' },
];

export default function EspecialidadesAdmin() {
  const [esp, setEsp] = useState(datosIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenu] = useState(null);
  const [nueva, setNueva] = useState(null);
  const [enEdicion, setEnEdicion] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (id) => setMenu((p) => (p === id ? null : id));
  const cancelarNueva = () => setNueva(null);
  const cancelarEdicion = () => setEnEdicion(null);

  const guardarNueva = () => {
    if (!nueva.nombre.trim() || !nueva.descripcion.trim()) {
      return Swal.fire({ title: 'Todos los campos son obligatorios', icon: 'warning' });
    }
    const duplicado = esp.some((e) => e.nombre.toLowerCase() === nueva.nombre.trim().toLowerCase());
    if (duplicado) {
      return Swal.fire({ title: 'Esa especialidad ya existe', icon: 'error' });
    }
    setEsp((prev) => [...prev, { ...nueva, id: Date.now() }]);
    setNueva(null);
  };

  const guardarEdicion = () => {
    if (!enEdicion.nombre.trim() || !enEdicion.descripcion.trim()) {
      return Swal.fire({ title: 'Todos los campos son obligatorios', icon: 'warning' });
    }
    const duplicado = esp.some(
      (e) =>
        e.nombre.toLowerCase() === enEdicion.nombre.trim().toLowerCase() &&
        e.id !== enEdicion.id
    );
    if (duplicado) {
      return Swal.fire({ title: 'Esa especialidad ya existe', icon: 'error' });
    }
    setEsp((prev) =>
      prev.map((e) => (e.id === enEdicion.id ? { ...enEdicion } : e))
    );
    setEnEdicion(null);
  };

  const eliminar = (id) => {
    const reg = esp.find((e) => e.id === id);
    Swal.fire({
      title: '¿Eliminar especialidad?',
      text: `Se eliminará "${reg?.nombre}".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b52020',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((r) => r.isConfirmed && setEsp((prev) => prev.filter((e) => e.id !== id)));
  };

  const toggleEstado = (id) =>
    setEsp((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, estado: e.estado === 'Activo' ? 'Inactivo' : 'Activo' } : e
      )
    );

  const abrirNuevaFila = () => {
    setNueva({ nombre: '', descripcion: '', estado: 'Activo' });
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
