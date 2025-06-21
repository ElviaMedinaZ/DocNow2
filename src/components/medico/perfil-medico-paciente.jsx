/**
 * Descripción: Implementación de la vista de Perfil para el médico
 * Fecha: 14 Junio de 2025
 * Programador: Elvia Medina
 */

import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import '../../styles/paciente/perfil-medico-paciente.css';
import HeaderPaciente from '../paciente/menu-paciente';

/* ――― datos demo ――― */
const doctorDemo = {
  nombre: 'Dr. Mario Orantes',
  especialidad: 'Cardiólogo',
  foto: 'https://i.pravatar.cc/150?img=13',
  telefono: '3453535345',
  email: 'mario@gmail.com',
  consultorio: 'Consultorio 2',
  servicios: [
    { nombre: 'Inyecciones',  precio: 100 },
    { nombre: 'Rayos X',      precio: 700 },
    { nombre: 'Ultrasonidos', precio: 650 },
    { nombre: 'Consulta',     precio: 400 },
  ],
  horario: {
    dias:  'Lunes a viernes',
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
      avatar: 'https://i.pravatar.cc/100?img=23',
      estrellas: 5,
      comentario: 'Buen servicio 👍',
      fecha: '27 mar 2022',
    },
  ],
};

export default function PerfilMedicoDashboard({ doctor = doctorDemo }) {
  const currency = (n) => `$${n.toLocaleString('es-MX')}`;

  /* plantilla para cada valoración */
  const valoracionTemplate = (v) => (
    <div className="pm-val-item">
      <Avatar image={v.avatar} shape="circle" size="large" />
      <div className="pm-val-text">
        <div className="pm-val-header">
          <strong>{v.usuario}</strong>
          <Rating value={v.estrellas} readOnly cancel={false} className="pm-val-stars" />
        </div>
        <p className="pm-val-com">{v.comentario}</p>
        <span className="pm-val-date">{v.fecha}</span>
      </div>
    </div>
  );

  return (
    <div className="pm-container">
      {/* barra de navegación global */}
      <HeaderPaciente />

      {/* cabecera azul */}
      <header className="pm-header">
        <img src={doctor.foto} alt={doctor.nombre} className="pm-img" />
        <div className="pm-info">
          <h1 className="pm-name">{doctor.nombre}</h1>
          <Tag value={doctor.horario.turno} rounded className="pm-tag" />
        </div>
      </header>

      {/* FILA PRINCIPAL – contacto · servicios · disponibilidad */}
      <div className="pm-top-row">
        {/* tarjeta – Datos de contacto */}
        <Card className="pm-card">
          <h3 className="pm-section-title">Datos de contacto</h3>

          <div className="pm-contact-item">
            <i className="pi pi-phone pm-contact-icon phone" />
            <div>
              <span className="pm-info-title">Teléfono</span>
              <h2 className="pm-info-value">{doctor.telefono}</h2>
            </div>
          </div>

          <div className="pm-contact-item">
            <i className="pi pi-envelope pm-contact-icon mail" />
            <div>
              <span className="pm-info-title">Correo</span>
              <h2 className="pm-info-value">{doctor.email}</h2>
            </div>
          </div>

          <div className="pm-contact-item">
            <i className="pi pi-building pm-contact-icon building" />
            <div>
              <span className="pm-info-title">Consultorio</span>
              <h2 className="pm-info-value">{doctor.consultorio}</h2>
            </div>
          </div>
        </Card>

        {/* tarjeta – Servicios */}
        <Card className="pm-card">
          <h3 className="pm-section-title">Servicios ofertados</h3>
          <ul className="pm-services-list">
            {doctor.servicios.map((s) => (
              <li key={s.nombre}>
                <span>{s.nombre}</span>
                <strong>{currency(s.precio)}</strong>
              </li>
            ))}
          </ul>
        </Card>

        {/* tarjeta – Disponibilidad */}
        <Card className="pm-card">
          <h3 className="pm-section-title">Disponibilidad</h3>
          <p>{doctor.horario.dias}</p>
          <p>{doctor.horario.turno}</p>
        </Card>
      </div>

      {/* Valoraciones (ancho completo) */}
      <Card title={`Valoraciones (${doctor.valoraciones.length})`} className="pm-card full">
        <DataView
          value={doctor.valoraciones}
          itemTemplate={valoracionTemplate}
          layout="list"
          paginator
          rows={3}
        />
      </Card>

      {/* botón CTA */}
      <div className="pm-cta">
        <Button label="Solicitar cita" className="pm-btn-cita p-button-lg" />
      </div>
    </div>
  );
}
