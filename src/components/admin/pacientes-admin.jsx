/*
 * Descripción: Componente de administración para gestionar pacientes.
 * Fecha: 23 Junio de 2025
 * Programador: Elvia Medina
 */

import { useEffect, useRef, useState } from 'react';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../../styles/admin/admin-base.css';
import RegistroPaciente from '../paciente/registro-paciente';
import GenericTable from './tabla-generica';

const datosIniciales = [
  { id: 1, nombre: 'José Ramírez', edad: 34, sexo: 'M', telefono: '+1234567890', ultimaVisita: '2024-01-15', estado: 'Activo' },
  { id: 2, nombre: 'Laura Torres', edad: 28, sexo: 'F', telefono: '+1234567891', ultimaVisita: '2024-01-14', estado: 'Activo' },
  { id: 3, nombre: 'Carlos Aguilar', edad: 45, sexo: 'M', telefono: '+1234567892', ultimaVisita: '2024-01-13', estado: 'Inactivo' },
  { id: 4, nombre: 'Marta Reyes', edad: 52, sexo: 'F', telefono: '+1234567893', ultimaVisita: '2024-01-12', estado: 'Activo' },
];

export default function PacientesAdmin() {
  const [pacs, setPacs] = useState(datosIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenu] = useState(null);
  const [modalAbierto, setModal] = useState(false);
  const [pacEdit, setEdit] = useState(null);
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

  const toggleMenu = (id) => setMenu((prev) => (prev === id ? null : id));
  const cerrarModal = () => { setModal(false); setEdit(null); setMenu(null); };

  const eliminar = (id) => {
    const reg = pacs.find((p) => p.id === id);
    if (!reg) return;

    Swal.fire({
      title: '¿Eliminar paciente?',
      text: `Se eliminará a ${reg.nombre}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b52020',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((r) => {
      if (r.isConfirmed) {
        setPacs((prev) => prev.filter((p) => p.id !== id));
        Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1500, showConfirmButton: false });
      }
    });
  };

  const toggleEstado = (id) => {
    const paciente = pacs.find((p) => p.id === id);
    if (!paciente) {
      return Swal.fire({ title: 'Paciente no encontrado', icon: 'error' });
    }

    const nuevo = paciente.estado === 'Activo' ? 'Inactivo' : 'Activo';

    Swal.fire({
      title: `¿Cambiar estado a ${nuevo}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    }).then((r) => {
      if (r.isConfirmed) {
        setPacs((prev) => prev.map((p) => (p.id === id ? { ...p, estado: nuevo } : p)));
      }
    });
  };

  const abrirNuevo = () => { setEdit(null); setModal(true); };
  const abrirEditar = (row) => { setEdit(row); setModal(true); };

  const onSave = (payload, modo) => {
    setPacs((prev) =>
      modo === 'editar'
        ? prev.map((p) => (p.id === payload.id ? payload : p))
        : [...prev, { ...payload, id: Date.now() }]
    );
    cerrarModal();
  };

  const filtrados = pacs.filter((p) =>
    `${p.nombre} ${p.telefono} ${p.sexo} ${p.estado}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const columns = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Edad', accessor: (p) => `${p.edad} años` },
    { header: 'Sexo', accessor: 'sexo' },
    { header: 'Teléfono', accessor: 'telefono' },
    { header: 'Última Visita', accessor: 'ultimaVisita' },
    {
      header: 'Estado',
      accessor: (p) => (
        <span className={`estado-tag ${p.estado === 'Activo' ? 'activo' : 'inactivo'}`}>
          {p.estado}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: (row) => (
        <div className="acciones-wrapper">
          <button className="btn-acciones" onClick={() => toggleMenu(row.id)}>
            <FaEllipsisV />
          </button>
          {menuAbierto === row.id && (
            <div className="menu-acciones" ref={menuRef}>
              <button onClick={() => console.log(`Ver historial de ${row.nombre}`)}>Ver historial</button>
              <button onClick={() => abrirEditar(row)}>Editar</button>
              <button onClick={() => console.log(`Agendar cita para ${row.nombre}`)}>Agendar cita</button>
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
    <div className="admin-pacientes-container">
      <div className="admin-pacientes-header">
        <h2>Gestión de Pacientes</h2>
        <button className="btn-agregar" onClick={abrirNuevo}>
          <FaPlus /> Agregar Paciente
        </button>
      </div>

      <div className="buscador-pacientes">
        <FaSearch />
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono, sexo o estado..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <GenericTable
        columns={columns}
        data={filtrados}
        emptyMsg="Sin resultados"
        footer={`Mostrando ${filtrados.length} de ${pacs.length} pacientes`}
      />

      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar-modal" onClick={cerrarModal}>×</button>
            <RegistroPaciente
              modo={pacEdit ? 'editar' : 'crear'}
              datosIniciales={pacEdit}
              onSave={onSave}
              onClose={cerrarModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
