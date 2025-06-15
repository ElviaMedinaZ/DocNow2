/**
 * Descripción: Implementación de la vista de Perfil para el médico
 * Fecha: 14 Junio de 2025
 * Programador: Elvia Medina
 */

import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';

import { useState } from 'react';
import '../../styles/medico/PerfilMedico.css';

// Datos de prueba
const doctorDemo = {
  nombre: 'Dr. Mario Orantes',
  foto: 'https://i.pravatar.cc/150?img=64',
  telefono: '3453535345',
  email: 'mario@gmail.com',
  consultorio: 'Consultorio 2',
  servicios: [
    { nombre: 'Inyecciones', precio: 100 },
    { nombre: 'Rayos X', precio: 700 },
    { nombre: 'Ultrasonidos', precio: 650 },
    { nombre: 'Consulta', precio: 400 },
  ],
  horario: {
    dias: 'Lunes a viernes',
    turno: 'Matutino',
  },
  valoraciones: [
    {
      id: 1,
      usuario: 'Ana López',
      avatar: 'https://i.pravatar.cc/150?img=47',
      estrellas: 4,
      comentario: 'El mejor médico, me encanta su amabilidad.',
      fecha: '15 de mayo de 2024',
    },
    {
      id: 2,
      usuario: 'Pedro Núñez',
      avatar: 'https://i.pravatar.cc/150?img=12',
      estrellas: 2,
      comentario: 'Pésimo servicio.',
      fecha: '25 de abril de 2022',
    },
    {
      id: 3,
      usuario: 'Laura Reyes',
      avatar: 'https://i.pravatar.cc/150?img=23',
      estrellas: 5,
      comentario: 'Buen servicio 👍',
      fecha: '27 de marzo de 2022',
    },
  ],
};

// Componente principal
export default function PerfilMedicoWeb({ doctor = doctorDemo }) {
  //Estado para mostrar más/menos valoraciones
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const valoracionesVisibles = mostrarTodas ? doctor.valoraciones : doctor.valoraciones.slice(0, 3);

  return (
    <div className="PerfilMedicoContainer">
      {/* Encabezado doctor */}
      <header className="DoctorHeader">
        <img className="DoctorImg" src={doctor.foto} alt={`Foto de ${doctor.nombre}`} />
        <div className="DoctorInfo">
          <h1 className="DoctorNombre">{doctor.nombre}</h1>
          <Tag value={doctor.horario.turno} className="DoctorEspecialidad" />
        </div>
      </header>

      <main className="PerfilContent">
        {/* CONTACTO ---------------------------------------------------- */}
        <section className="BloqueContacto">
          <h2 className="BloqueTitulo">Datos de contacto</h2>
          <ul className="ListaContacto">
            <li><i className="pi pi-phone" /> {doctor.telefono}</li>
            <li><i className="pi pi-envelope" /> {doctor.email}</li>
            <li><i className="pi pi-building" /> {doctor.consultorio}</li>
          </ul>
        </section>

        <Divider />

        {/* SERVICIOS ---------------------------------------------------- */}
        <section className="BloqueServicios">
          <h2 className="BloqueTitulo">Servicios ofertados</h2>
          <table className="TablaServicios">
            <tbody>
              {doctor.servicios.map((s) => (
                <tr key={s.nombre}>
                  <td>{s.nombre}</td>
                  <td className="ServicioPrecio">${s.precio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <Divider />

        {/* DISPONIBILIDAD ---------------------------------------------- */}
        <section className="BloqueDisponibilidad">
          <h2 className="BloqueTitulo">Disponibilidad</h2>
          <p>{doctor.horario.dias}</p>
          <p>{doctor.horario.turno}</p>
        </section>

        <Divider />

        {/* VALORACIONES ------------------------------------------------- */}
        <section className="BloqueValoraciones">
          <div className="ValoracionesHeader">
            <h2 className="BloqueTitulo">Valoraciones</h2>
            {doctor.valoraciones.length > 3 && (
              <Button
                label={mostrarTodas ? 'Ocultar' : 'Ver todas →'}
                link
                className="BtnVerMas"
                onClick={() => setMostrarTodas(!mostrarTodas)}
              />
            )}
          </div>
          <ul className="ListaValoraciones">
            {valoracionesVisibles.map((v) => (
              <li key={v.id} className="ItemValoracion">
                <Avatar image={v.avatar} shape="circle" size="large" className="ValoracionAvatar" />
                <div className="ValoracionTexto">
                  <Rating value={v.estrellas} readOnly cancel={false} className="ValoracionEstrellas" />
                  <p className="ValoracionComentario">{v.comentario}</p>
                  <span className="ValoracionFecha">{v.fecha}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* BOTÓN CITA --------------------------------------------------- */}
        <div className="AccionCita">
          <Button label="Solicitar cita" className="BtnCita p-button-lg" />
        </div>
      </main>
    </div>
  );
}