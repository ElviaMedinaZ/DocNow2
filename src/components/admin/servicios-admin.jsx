import { useState } from 'react';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../../styles/admin/admin-base.css';
import GenericTable from './tabla-generica';

const datosIniciales = [
  { id: 1, nombre: 'Toma de presión arterial', categoria: 'Evaluación básica', precio: 100, estado: 'Activo' },
  { id: 2, nombre: 'Medición de glucosa capilar', categoria: 'Evaluación básica', precio: 120, estado: 'Activo' },
  { id: 3, nombre: 'Aplicación de inyecciones', categoria: 'Procedimientos menores', precio: 200, estado: 'Activo' },
  { id: 4, nombre: 'Curaciones', categoria: 'Urgencias menores', precio: 350, estado: 'Activo' },
  { id: 5, nombre: 'Rayos X', categoria: 'Crónicos', precio: 300, estado: 'Activo' },
  { id: 6, nombre: 'Ultrasonidos', categoria: 'Crónicos', precio: 300, estado: 'Activo' },
  { id: 7, nombre: 'Examen físico general', categoria: 'Evaluación', precio: 550, estado: 'Activo' },
  { id: 8, nombre: 'Expedición de certificado médico', categoria: 'Trámites', precio: 250, estado: 'Activo' },
  { id: 9, nombre: 'Revisión de laboratorio clínico', categoria: 'Diagnóstico', precio: 200, estado: 'Activo' },
  { id: 10, nombre: 'Electrocardiograma (ECG)', categoria: 'Diagnóstico', precio: 450, estado: 'Activo' },
];

export default function ServiciosAdmin() {
  const [servicios, setServicios] = useState(datosIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenu] = useState(null);
  const [nuevo, setNuevo] = useState(null);
  const [enEdicion, setEnEdicion] = useState(null);

  const toggleMenu = (id) => setMenu((prev) => (prev === id ? null : id));
  const cancelarNuevo = () => setNuevo(null);
  const cancelarEdicion = () => setEnEdicion(null);

  const guardarNuevo = () => {
    if (!nuevo.nombre.trim() || !nuevo.categoria.trim() || !nuevo.precio) {
      return Swal.fire({ title: 'Todos los campos son obligatorios', icon: 'warning' });
    }

    const duplicado = servicios.some(
      (s) => s.nombre.toLowerCase() === nuevo.nombre.trim().toLowerCase()
    );
    if (duplicado) {
      return Swal.fire({ title: 'Ese servicio ya existe', icon: 'error' });
    }

    setServicios((prev) => [
      ...prev,
      { ...nuevo, id: Date.now(), precio: parseFloat(nuevo.precio) },
    ]);
    setNuevo(null);
  };

  const guardarEdicion = () => {
    if (!enEdicion.nombre.trim() || !enEdicion.categoria.trim() || !enEdicion.precio) {
      return Swal.fire({ title: 'Todos los campos son obligatorios', icon: 'warning' });
    }

    const duplicado = servicios.some(
      (s) =>
        s.nombre.toLowerCase() === enEdicion.nombre.trim().toLowerCase() &&
        s.id !== enEdicion.id
    );
    if (duplicado) {
      return Swal.fire({ title: 'Ese servicio ya existe', icon: 'error' });
    }

    setServicios((prev) =>
      prev.map((s) => (s.id === enEdicion.id ? { ...enEdicion, precio: parseFloat(enEdicion.precio) } : s))
    );
    setEnEdicion(null);
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
    }).then((r) => {
      if (r.isConfirmed) {
        setServicios((prev) => prev.filter((s) => s.id !== id));
      }
    });
  };

  const toggleEstado = (id) => {
    setServicios((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, estado: s.estado === 'Activo' ? 'Inactivo' : 'Activo' } : s
      )
    );
  };

  const abrirNuevaFila = () => {
    setNuevo({ nombre: '', categoria: '', precio: '', estado: 'Activo' });
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
            <button className="btn-acciones" onClick={() => toggleMenu(row.id)}><FaEllipsisV /></button>
            {menuAbierto === row.id && (
              <div className="menu-acciones">
                <button onClick={() => editarFila(row)}>Editar</button>
                <button onClick={() => toggleEstado(row.id)}>{row.estado === 'Activo' ? 'Inactivar' : 'Activar'}</button>
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
