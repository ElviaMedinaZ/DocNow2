/*
 * Descripción: Componente para gestión de citas agendadas por el administrador.
 * Fecha: 22 Junio de 2025
 * Programador: Elvia Medina
 */

import { useEffect, useState } from 'react';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import '../../styles/admin/admin-base.css';
import GenericTable from './tabla-generica';

export default function CitasAdmin() {
  const [citas, setCitas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(null);

  // Obtener citas desde Firebase
  useEffect(() => {
    const obtenerCitas = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'citas'));
        const citasData = await Promise.all(snapshot.docs.map(async (docSnap) => {
          const cita = docSnap.data();

          // Obtener nombre del paciente
          let pacienteNombre = 'Desconocido';
          try {
            const pacienteDoc = await getDoc(doc(db, 'usuarios', cita.pacienteId));
            if (pacienteDoc.exists()) {
              const data = pacienteDoc.data();
              pacienteNombre = `${data.nombres} ${data.apellidoP || ''} ${data.apellidoM || ''}`;
            }
          } catch {}

          // Obtener nombre del doctor
          let doctorNombre = 'Desconocido';
          try {
            const doctorDoc = await getDoc(doc(db, 'usuarios', cita.doctorId));
            if (doctorDoc.exists()) {
              const data = doctorDoc.data();
              doctorNombre = `${data.nombres} ${data.apellidoP || ''} ${data.apellidoM || ''}`;
            }
          } catch {}

          return {
            id: docSnap.id,
            ...cita,
            paciente: pacienteNombre,
            doctor: doctorNombre,
          };
        }));

        setCitas(citasData);
      } catch (err) {
        console.error('Error al obtener citas:', err);
      }
    };

    obtenerCitas();
  }, []);

  const toggleMenu = (id) => {
    setMenuAbierto((prev) => (prev === id ? null : id));
  };

  const cambiarEstado = async (id, nuevoEstado) => {
  try {
    // Actualizar localmente en el estado
    setCitas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, estatus: nuevoEstado } : c))
    );

    // Actualizar en Firebase
    await updateDoc(doc(db, 'citas', id), {
      estatus: nuevoEstado,
    });

    Swal.fire('Estado actualizado', `La cita ahora está "${nuevoEstado}"`, 'success');
  } catch (error) {
    console.error('Error al actualizar estado en Firebase:', error);
    Swal.fire('Error', 'No se pudo actualizar el estado en Firebase.', 'error');
  }
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
    `${c.paciente} ${c.doctor} ${c.fecha} ${c.estatus}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const columns = [
    { header: 'Paciente', accessor: 'paciente' },
    { header: 'Doctor', accessor: 'doctor' },
    { header: 'Fecha', accessor: 'fecha' },
    { header: 'Hora', accessor: 'hora' },
    {
      header: 'Estado',
      accessor: (c) => (
        <span className={`estado-tag ${c.estatus?.toLowerCase()}`}>
          {c.estatus}
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
                {['Confirmada', 'Pendiente'].map((estado) => (
                  <button
                    key={estado}
                    className={`estado-option ${row.estatus === estado ? 'activo' : ''}`}
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