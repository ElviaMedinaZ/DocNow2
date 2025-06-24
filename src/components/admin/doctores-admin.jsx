import { useState } from 'react';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../../styles/admin/admin-base.css';
import '../../styles/admin/doctores-admin.css';
import RegistroWeb from '../medico/registro-medico';
import GenericTable from './tabla-generica';

/* Servicios disponibles*/
const catalogoServicios = [
  'Consulta',
  'Toma de presión',
  'Inyecciones',
  'Ultrasonido',
  'Electrocardiograma',
  'Curaciones',
  'Papanicolaou',
  'Colocación de sueros',
  'Revisión oftalmológica',
  'Audiometría',
  'Vacunación',
  'Chequeo general',
  'Extracción de puntos',
  'Pruebas COVID-19',
  'Rayos X',
];

/* datos demo */
const datosIniciales = [
  {
    id: 1,
    nombre: 'Dr. Juan Pérez',
    especialidad: 'Cardiología',
    pacientes: 45,
    estado: 'Activo',
    servicios: ['Consulta', 'Telemedicina'],
  },
  {
    id: 2,
    nombre: 'Dra. María García',
    especialidad: 'Dermatología',
    pacientes: 38,
    estado: 'Activo',
    servicios: ['Consulta'],
  },
  {
    id: 3,
    nombre: 'Dr. Carlos López',
    especialidad: 'Pediatría',
    pacientes: 52,
    estado: 'Activo',
    servicios: ['Consulta', 'Urgencias'],
  },
  {
    id: 4,
    nombre: 'Dra. Ana Martínez',
    especialidad: 'Neurología',
    pacientes: 29,
    estado: 'Inactivo',
    servicios: [],
  },
];

export default function DoctoresAdmin() {
  /* estados*/
  const [doctores, setDoctores] = useState(datosIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenu] = useState(null);
  const [modalAbierto, setModal] = useState(false);
  const [doctorEditando, setEditando] = useState(null);

  /* helpers */
  const toggleMenu = (id) => setMenu((p) => (p === id ? null : id));
  const cerrarModal = () => { setModal(false); setEditando(null); setMenu(null); };

  /* -eliminacion */
  const eliminar = (id) => {
    const doctor = doctores.find((d) => d.id === id);
    Swal.fire({
      title: '¿Eliminar doctor?',
      text: `Se eliminará a ${doctor?.nombre}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b52020',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((r) => {
      if (r.isConfirmed) {
        setDoctores((prev) => prev.filter((d) => d.id !== id));
        Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1500, showConfirmButton: false });
      }
    });
  };

  /* activar/inactivar*/
  const toggleEstado = (id) => {
    const d = doctores.find((dx) => dx.id === id);
    const nuevo = d.estado === 'Activo' ? 'Inactivo' : 'Activo';
    Swal.fire({
      title: `¿Cambiar estado a ${nuevo}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    }).then((r) => {
      if (r.isConfirmed) {
        setDoctores((prev) => prev.map((dx) => (dx.id === id ? { ...dx, estado: nuevo } : dx)));
      }
    });
  };

  /*servicios*/
  const gestionarServicios = (id) => {
    const doctor = doctores.find((d) => d.id === id);

    /* genera check-boxes HTML */
    const htmlChecks = catalogoServicios
      .map(
        (svc, i) =>
          `<div style="text-align:left;margin:4px 0">
             <input type="checkbox" id="svc_${i}" ${doctor.servicios.includes(svc) ? 'checked' : ''}>
             <label for="svc_${i}" style="margin-left:6px">${svc}</label>
           </div>`
      )
      .join('');

    Swal.fire({
      title: `Servicios de ${doctor.nombre}`,
      html: htmlChecks,
      focusConfirm: false,
      width: 400,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      preConfirm: () => {
        const seleccionados = catalogoServicios.filter(
          (_, i) => document.getElementById(`svc_${i}`).checked
        );
        return seleccionados;
      },
    }).then((r) => {
      if (r.isConfirmed) {
        setDoctores((prev) =>
          prev.map((d) => (d.id === id ? { ...d, servicios: r.value } : d))
        );
      }
    });
  };

  /*alta / edicion*/
  const abrirNuevo = () => { setEditando(null); setModal(true); };
  const abrirEditar = (row) => { setEditando(row); setModal(true); };

  /* guarda el registro*/
  const onSave = (payload, modo) => {
    setDoctores((prev) =>
      modo === 'editar'
        ? prev.map((d) => (d.id === payload.id ? payload : d))
        : [...prev, { ...payload, id: Date.now(), servicios: [] }]
    );
    cerrarModal();
  };

  /* buscadoor  filtro*/
  const filtrados = doctores.filter((d) =>
    `${d.nombre} ${d.especialidad} ${d.estado}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  /* tabla */
  const columns = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Especialidad', accessor: 'especialidad' },
    { header: 'Pacientes', accessor: 'pacientes' },
    {
      header: 'Servicios',
      accessor: (d) => <span>{d.servicios.length}</span>,
    },
    {
      header: 'Estado',
      accessor: (d) => (
        <span className={`estado-tag ${d.estado === 'Activo' ? 'activo' : 'inactivo'}`}>
          {d.estado}
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
            <div className="menu-acciones">
              <button onClick={() => abrirEditar(row)}>Editar</button>
              <button onClick={() => gestionarServicios(row.id)}>Servicios</button>
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

  /* render */
  return (
    <div className="admin-doctores-container">
      <div className="admin-doctores-header">
        <h2>Gestión de Doctores</h2>
        <button className="btn-agregar" onClick={abrirNuevo}>
          <FaPlus /> Agregar Doctor
        </button>
      </div>

      <div className="busqueda-doctores">
        <FaSearch />
        <input
          type="text"
          placeholder="Buscar por nombre, especialidad o estado..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <GenericTable
        columns={columns}
        data={filtrados}
        emptyMsg="Sin resultados"
        footer={`Mostrando ${filtrados.length} de ${doctores.length} doctores`}
      />

      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar-modal" onClick={cerrarModal}>×</button>
            <RegistroWeb
              modo={doctorEditando ? 'editar' : 'crear'}
              datosIniciales={doctorEditando}
              onSave={onSave}
              onClose={cerrarModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
