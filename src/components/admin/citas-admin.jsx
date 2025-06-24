import { useState } from 'react';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../../styles/admin/admin-base.css';
import GenericTable from './tabla-generica';

const citasIniciales = [
  { id: 1, paciente: 'Pedro Rodríguez', doctor: 'Dr. Juan Pérez', fecha: '2024-01-20', hora: '10:00', estado: 'Confirmada' },
  { id: 2, paciente: 'Laura Sánchez', doctor: 'Dra. María García', fecha: '2024-01-20', hora: '11:30', estado: 'Pendiente' },
  { id: 3, paciente: 'Miguel Torres', doctor: 'Dr. Carlos López', fecha: '2024-01-21', hora: '09:00', estado: 'Confirmada' },
  { id: 4, paciente: 'Carmen Ruiz', doctor: 'Dra. Ana Martínez', fecha: '2024-01-21', hora: '14:00', estado: 'Cancelada' },
];

export default function CitasAdmin() {
  const [citas, setCitas] = useState(citasIniciales);
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(null);

  const toggleMenu = (id) => {
    setMenuAbierto((prev) => (prev === id ? null : id));
  };

  const cambiarEstado = (id, nuevoEstado) => {
    setCitas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c))
    );
  };

  const cancelarCita = (id) => {
    Swal.fire({
      title: '¿Cancelar cita?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
    }).then((result) => {
      if (result.isConfirmed) {
        cambiarEstado(id, 'Cancelada');
        Swal.fire('Cancelada', '', 'success');
      }
    });
  };

  const citasFiltradas = citas.filter((c) =>
    `${c.paciente} ${c.doctor} ${c.fecha} ${c.estado}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const columns = [
    { header: 'Paciente', accessor: 'paciente' },
    { header: 'Doctor', accessor: 'doctor' },
    { header: 'Fecha', accessor: 'fecha' },
    { header: 'Hora', accessor: 'hora' },
    {
      header: 'Estado',
      accessor: (c) => (
        <span className={`estado-tag ${c.estado.toLowerCase()}`}>
          {c.estado}
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
              <button onClick={() => console.log('Detalles de', row.paciente)}>Ver detalles</button>
              <button onClick={() => console.log('Editar cita de', row.paciente)}>Editar</button>

              <div className="estado-switcher">
                {['Confirmada', 'Pendiente', 'Cancelada'].map((estado) => (
                  <button
                    key={estado}
                    className={`estado-option ${row.estado === estado ? 'activo' : ''}`}
                    onClick={() => cambiarEstado(row.id, estado)}
                  >
                    {estado}
                  </button>
                ))}
              </div>

              <button className="eliminar" onClick={() => cancelarCita(row.id)}>
                Cancelar
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="admin-citas-container">
      <div className="admin-citas-header">
        <h2>Citas Agendadas</h2>
        <button className="btn-agregar">
          <FaPlus /> Nueva Cita
        </button>
      </div>

      <div className="buscador-citas">
        <FaSearch />
        <input
          type="text"
          placeholder="Buscar por paciente, doctor, fecha o estado..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <GenericTable
        columns={columns}
        data={citasFiltradas}
        emptyMsg="Sin resultados"
        footer={`Mostrando ${citasFiltradas.length} de ${citas.length} citas`}
      />
    </div>
  );
}
