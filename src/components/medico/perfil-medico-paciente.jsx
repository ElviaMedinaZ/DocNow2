/**
 * Descripción: Implementación de la vista de Perfil para el médico desde la vista del paciente
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

/* datos demo */
const doctorDemo = {
  nombre: 'Dr. Mario González',
  turno: 'Matutino',
  experiencia: 15, // años
  foto: 'https://i.pravatar.cc/150?img=13',
  telefono: '612 158 4464',
  email: 'mario.gonzalez@gmail.com',
  consultorio: '3',
  servicios: [
    { nombre: 'Consulta general',  precio: 500, desc: 'Revisión médica', dur: '45 min' },
    { nombre: 'Inyecciones', precio: 200, desc: 'Aplicacion de medicación o vacunas',      dur: '30 min' },
    { nombre: 'Ultrasonidos', precio: 80,  desc: 'Descarta cualquier tumor',  dur: '15 min' },
  ],
  horario: [
    { dia: 'Lunes',     horas: '8:00 AM - 1:00 PM' },
    { dia: 'Martes',    horas: '8:00 AM - 1:00 PM' },
    { dia: 'Miércoles', horas: '8:00 AM - 1:00 PM' },
    { dia: 'Jueves',    horas: '8:00 AM - 1:00 PM' },
    { dia: 'Viernes',   horas: '8:00 AM - 1:00 PM' },
    { dia: 'Sábado',    horas: '8:00 AM - 12:00 PM' },
    { dia: 'Domingo',   horas: 'No disponible' },
  ],
  valoraciones: [
    { id: 1, usuario: 'Ana Martínez',  avatar: 'https://i.pravatar.cc/150?img=47', estrellas: 5, comentario: 'Excelente doctora, muy profesional y empática. Me explicó todo detalladamente y el tratamiento ha sido muy efectivo.', fecha: '14/1/2024' },
    { id: 2, usuario: 'Carlos López',  avatar: 'https://i.pravatar.cc/150?img=12', estrellas: 5, comentario: 'La Dra. González es excepcional. Su conocimiento y experiencia son evidentes. Altamente recomendada.', fecha: '9/1/2024' },
    { id: 3, usuario: 'Laura Rodríguez', avatar: 'https://i.pravatar.cc/100?img=23', estrellas: 4, comentario: 'Muy buena atención, aunque tuve que esperar un poco más de lo esperado. El diagnóstico fue acertado.', fecha: '4/1/2024' },
    { id: 4, usuario: 'Miguel Torres', avatar: 'https://i.pravatar.cc/150?img=15', estrellas: 5, comentario: 'Increíble profesional. Me ayudó mucho con mi problema cardiaco. Muy recomendable.', fecha: '27/12/2023' },
    { id: 5, usuario: 'Sofía Hernández', avatar: 'https://i.pravatar.cc/150?img=8', estrellas: 5, comentario: 'La mejor cardióloga que he visitado. Muy detallada en sus explicaciones y muy cálida en el trato.', fecha: '19/12/2023' },
  ],
};

export default function PerfilMedicoDashboard({ doctor = doctorDemo }) {
  const currency = (n) => `$${n.toLocaleString('es-MX')}`;

  /* valoracion promedio*/
  const promedio = doctor.valoraciones.reduce((acc, v) => acc + v.estrellas, 0) / doctor.valoraciones.length;
  const totalReseñas = doctor.valoraciones.length;

  /* valoracion */
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
      <HeaderPaciente />

      <div className="pm-layout">
        <aside className="pm-aside">
          {/* tarjeta perfil */}
          <Card className="pm-card pm-profile-card">
            <div className="pm-profile-center">
              <Avatar image={doctor.foto} shape="circle" size="xlarge" className="pm-avatar" />
              <h2 className="pm-name">{doctor.nombre}</h2>
              <Tag value={doctor.turno} rounded className="pm-tag" />
              <div className="pm-rating-row">
                <Rating value={promedio} readOnly cancel={false} className="pm-val-stars" />
                <span className="pm-rating-text">{promedio.toFixed(1)} ({totalReseñas} reseñas)</span>
              </div>
              <p className="pm-exp">{doctor.experiencia} años de experiencia</p>
              <Button label="Agendar Cita" icon="pi pi-calendar-plus" className="pm-btn-cita" />
            </div>
          </Card>

          {/* tarjeta contacto */}
          <Card className="pm-card">
            <h3 className="pm-section-title">Información de Contacto</h3>
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

          {/* tarjeta horarios */}
          <Card className="pm-card">
            <h3 className="pm-section-title">Horarios de Atención</h3>
            {doctor.horario.map((d) => (
              <p key={d.dia} className="pm-schedule-row">
                <span className="pm-day">{d.dia}</span>
                <span className="pm-hours">{d.horas}</span>
              </p>
            ))}
          </Card>
        </aside>

        <main className="pm-main">
          {/* servicios médicos */}
          <Card className="pm-card pm-services-card" title="Servicios Médicos">
            <div className="pm-services-grid">
              {doctor.servicios.map((s) => (
                <div key={s.nombre} className="pm-service-box">
                  <div className="pm-service-head">
                    <h4>{s.nombre}</h4>
                    <Tag value={currency(s.precio)} className="pm-tag-precio" />
                  </div>
                  <p className="pm-service-desc">{s.desc}</p>
                  <span className="pm-service-time">⏱ {s.dur}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* reseñas */}
          <Card className="pm-card full" title={`Reseñas de Pacientes  ·  ${promedio.toFixed(1)} (${totalReseñas})`}>
            <DataView value={doctor.valoraciones} itemTemplate={valoracionTemplate} layout="list" paginator rows={5} />
          </Card>
        </main>
      </div>
    </div>
  );
}
