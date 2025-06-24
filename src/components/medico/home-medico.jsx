/**
 * Descripción: Home del Medico
 * Fecha: 20-Jun-2025
 * Programador: Irais Reyes
 */

import React, { useState } from "react";
// import { signOut } from 'firebase/auth';
// import { auth } from '../../lib/firebase';
import { FaRegUser } from "react-icons/fa6";
import { CgPhone } from "react-icons/cg";
import { IoLocationOutline } from "react-icons/io5";
import { Calendar } from 'primereact/calendar';
import { useNavigate } from 'react-router-dom';
import HeaderMedico from '../../components/medico/MenuMedico';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FaArrowRight } from "react-icons/fa";
import '../../styles/medico/HomeMedico.css';

export default function HomeMedico() {
  const [date, setDate] = useState(null);
  const navigate = useNavigate();

  // const cerrarSesion = async () => {
  //   try {
  //     await signOut(auth);
  //     navigate('/login');
  //   } catch (e) {
  //     console.error('Error al cerrar sesión', e);
  //   }
  // };

  // medicos de mentira
 const doctores = [
    {
      id: '1',
      nombres: 'María',
      apellidoP: 'Gonzalez',
      rol: 'Doctor',
      sexo: 'F',
      fotoURL: 'https://imgs.search.brave.com/pWVnf_ZtV9pOcO9Qb2IBtDEjp4W7hg6y7poljyHohQo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90by1ncmF0aXMv/ZG9jdG9yYS1qb3Zl/bi1jb21wbGFjaWRh/LXZpc3RpZW5kby1i/YXRhLW1lZGljYS1l/c3RldG9zY29waW8t/YWxyZWRlZG9yLWN1/ZWxsby1waWUtcG9z/dHVyYS1jZXJyYWRh/XzQwOTgyNy0yNTQu/anBnP3NlbXQ9YWlz/X2h5YnJpZCZ3PTc0/MA',
      email: 'maria.gonzalez@hospital.com',
      telefono: '+1 (555) 123-4567',
      consultorio: 'Consultorio 2',
      especialidad: 'Cardiología',
      pacientesHoy: '24',
      pacientesMes: '156',
    },
  ];

  // pacientes de mentira
   const pacientes = [
    {
      id: '1',
      nombres: 'Juan',
      apellidoP: 'Pérez',
      rol: 'Paciente',
      sexo: 'M',
      fotoURL: 'https://img.freepik.com/foto-gratis/retrato-chico-casual-posando-estudio_176420-28907.jpg?semt=ais_hybrid&w=740',
      servicio: 'Consulta general',
      hora: '09:00 AM',
      estado:'Pendiente' ,
    },
    {
      id: '2',
      nombres: 'Paty',
      apellidoP: 'Mendez',
      rol: 'Paciente',
      sexo: 'F',
      fotoURL: 'https://www.clarin.com/2023/12/28/k8gOUmfp5_720x0__1.jpg',
      servicio: 'Ultrasonido',
      hora: '10:00 AM',
      estado:'Cancelado' ,
    },
    {
      id: '3',
      nombres: 'Gabriela',
      apellidoP: 'Gutiérrez',
      rol: 'Paciente',
      sexo: 'F',
      fotoURL: 'https://static.cegos.es/content/uploads/2023/03/01165224/GettyImages-1300321639.jpg',
      servicio: 'Rayos X',
      hora: '01:00 PM',
      estado:'Atendido' ,
    },
    {
      id: '4',
      nombres: 'Rosa',
      apellidoP: 'Manriquez',
      rol: 'Paciente',
      sexo: 'F',
      fotoURL: 'https://img.freepik.com/foto-gratis/estilo-vida-emociones-gente-concepto-casual-confiado-agradable-sonriente-mujer-asiatica-brazos-cruzados-pecho-seguro-listo-ayudar-escuchando-companeros-trabajo-participando-conversacion_1258-59335.jpg?semt=ais_hybrid&w=740',
      servicio: 'Consulta general',
      hora: '02:00 PM',
      estado:'Pendiente' ,
    },
    {
      id: '5',
      nombres: 'Tyler',
      apellidoP: 'Joseph',
      rol: 'Paciente',
      sexo: 'M',
      fotoURL: 'https://imgs.search.brave.com/mT3ESSk-6UzA1DwaWKhQ-MHEGDFpfi9KJ7cW8lA6ou4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGhlZmFtb3VzcGVv/cGxlLmNvbS9wcm9m/aWxlcy90aHVtYnMv/dHlsZXItam9zZXBo/LTEuanBn',
      servicio: 'Rayos X',
      hora: '05:00 PM',
      estado:'Atendido' ,
    },
  ];

  const doctor = doctores[0];

  // citas de mentira
  const citasFechas = [
    new Date(2025, 5, 22),
    new Date(2025, 5, 25), 
    new Date(2025, 5, 27)  
  ];

  // Si hay cita, se marca en el calendario
  const customDateTemplate = (date) => {
    const isCita = citasFechas.some(
      (cita) =>
        cita.getDate() === date.day &&
        cita.getMonth() === date.month &&
        cita.getFullYear() === date.year
    );

      return (
        <div style={{ position: 'relative' }}>
          {date.day}
          {isCita && (
            <span
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#0A3B74',
                borderRadius: '50%',
                position: 'absolute',
                top: 24,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            />
          )}
        </div>
      );
    };

    const isMobile = useMediaQuery('(max-width:768px)');

    const [indiceCita, setIndiceCita] = useState(0);
    const citasPorPagina = 3;
    const totalGrupos = Math.ceil(pacientes.length / citasPorPagina);

    const citasVisibles = pacientes.slice(
      indiceCita * citasPorPagina,
      (indiceCita + 1) * citasPorPagina
    );

    const siguienteGrupo = () => {
      setIndiceCita((prev) => (prev + 1) % totalGrupos);
    };


 return (
    <div className="homeDoctorContainer">
      <HeaderMedico />

      <div className="layoutContenido">
        {/* Si es pantalla completa la barra se muestra normal */}
        {!isMobile && (
          <aside className="asideDoctor">
            <div className="infoHomeDoctor">
              <img src={doctor.fotoURL} alt={`Foto de ${doctor.nombres}`} className="imgPerfilDoctor" />
              <p className="nombreHomeDoctor">{doctor.nombres} {doctor.apellidoP}</p>
              <p className="profesionHomeDoctor">{doctor.especialidad}</p>
              <div className="infoRow"><FaRegUser className="iconoDoctor" /><span>{doctor.email}</span></div>
              <div className="infoRow"><CgPhone className="iconoDoctor" /><span>{doctor.telefono}</span></div>
              <div className="infoRow"><IoLocationOutline className="iconoDoctor" /><span>{doctor.consultorio}</span></div>
              <div className="resumenPacientes">
                <div className="bloqueResumen">
                  <span className="pacienteNumero">{doctor.pacientesHoy}</span>
                  <span className="pacienteTexto">Pacientes hoy</span>
                </div>
                <div className="bloqueResumen">
                  <span className="pacienteNumero">{doctor.pacientesMes}</span>
                  <span className="pacienteTexto">Este mes</span>
                </div>
              </div>
            </div>
          </aside>
        )}

        <main className="contenidoDoctor">
          {/* Si es movil, la barra lateral se vuelve tarjeta */}
          {isMobile && (
            <div className="asideDoctor" style={{ marginBottom: '1rem' }}>
              <div className="infoHomeDoctor">
                <img src={doctor.fotoURL} alt={`Foto de ${doctor.nombres}`} className="imgPerfilDoctor" />
                <p className="nombreHomeDoctor">{doctor.nombres} {doctor.apellidoP}</p>
                <p className="profesionHomeDoctor">{doctor.especialidad}</p>
                <div className="infoRow"><FaRegUser className="iconoDoctor" /><span>{doctor.email}</span></div>
                <div className="infoRow"><CgPhone className="iconoDoctor" /><span>{doctor.telefono}</span></div>
                <div className="infoRow"><IoLocationOutline className="iconoDoctor" /><span>{doctor.consultorio}</span></div>
                <div className="resumenPacientes">
                  <div className="bloqueResumen">
                    <span className="pacienteNumero">{doctor.pacientesHoy}</span>
                    <span className="pacienteTexto">Pacientes hoy</span>
                  </div>
                  <div className="bloqueResumen">
                    <span className="pacienteNumero">{doctor.pacientesMes}</span>
                    <span className="pacienteTexto">Este mes</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="calendarioAgendaContainer">
            <div className="calendarioCitasDoctor">
              <h2>Calendario</h2>
              <Calendar
                value={date}
                onChange={(e) => setDate(e.value)}
                inline
                showWeek
                dateTemplate={customDateTemplate}
              />
            </div>

            <div className="citasHomeDoctor">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Agenda del día</h2>
                {pacientes.length > citasPorPagina && (
                  <button className="botonVerMas" onClick={siguienteGrupo}>
                    <FaArrowRight />
                  </button>
                )}
              </div>

              {citasVisibles.map((paciente) => (
                <div className="tarjetaCitas" key={paciente.id}>
                  <img
                    src={paciente.fotoURL}
                    alt={`Foto de ${paciente.nombres}`}
                    className="imgPerfilPaciente"
                  />
                  <div className="infoPaciente">
                    <p className="nombrePaciente">{paciente.nombres} {paciente.apellidoP}</p>
                    <p className="servicioDelPaciente">{paciente.servicio}</p>
                  </div>
                  <p className="horaPaciente">{paciente.hora}</p>
                  <div className="accionesPaciente">
                    <div className={`contenedorEstado ${paciente.estado.toLowerCase()}`}>
                      <p className="estadoCita">{paciente.estado}</p>
                    </div>
                    <button
                      className="botonAtenderCita"
                      onClick={() => navigate('/consulta-medica')}
                      disabled={paciente.estado === "Cancelado" || paciente.estado === "Atendido"}
                    >
                      {paciente.estado === "Cancelado"
                        ? "Cancelado"
                        : paciente.estado === "Atendido"
                        ? "Completado"
                        : "Atender Paciente"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="estadisticasDoctor">
              <div className="tarjetaEstadistica">
                <p className="cantidad">7</p>
                <p className="descripcion">Citas Hoy</p>
              </div>
              <div className="tarjetaEstadistica">
                <p className="cantidad">12</p>
                <p className="descripcion">Pacientes Atendidos</p>
              </div>
              <div className="tarjetaEstadistica">
                <p className="cantidad">3</p>
                <p className="descripcion">Pendientes</p>
              </div>
              <div className="tarjetaEstadistica">
                <p className="cantidad">156</p>
                <p className="descripcion">Consultas Mes</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}