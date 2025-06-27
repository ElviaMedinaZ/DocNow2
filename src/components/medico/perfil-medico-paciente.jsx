/*
 * Descripción: Implementación de la vista de Perfil para el médico desde la vista del paciente
 * Fecha: 14 Junio de 2025
 * Programador: Elvia Medina
 */

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataView } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';

import '../../styles/paciente/perfil-medico-paciente.css';
import HeaderPaciente from '../paciente/menu-paciente';
import AgendarCita from '../../components/paciente/agendar-cita';

export default function PerfilMedicoDashboard() {
  const { uid } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [modalCita, setModalCita] = useState(false);

  useEffect(() => {
    const cargarDoctor = async () => {
      const ref = doc(db, 'usuarios', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();

        // Simulamos valores faltantes para renderizado
        setDoctor({
          nombre: data.nombres || 'Sin nombre',
          turno: data.turnoHora || 'Matutino',
          experiencia: data.experiencia || 0,
          foto: data.fotoPerfil || '',
          telefono: data.telefono || 'No disponible',
          email: data.email || '',
          consultorio: data.consultorio || 'N/A',
          servicios: data.Servicios?.split(',').map(s => ({
            nombre: s,
            precio: 300,
            desc: 'Descripción no disponible',
            dur: '30 min'
          })) || [],
          horario: [
            { dia: 'Lunes', horas: '8:00 AM - 1:00 PM' },
            { dia: 'Martes', horas: '8:00 AM - 1:00 PM' },
            { dia: 'Miércoles', horas: '8:00 AM - 1:00 PM' },
            { dia: 'Jueves', horas: '8:00 AM - 1:00 PM' },
            { dia: 'Viernes', horas: '8:00 AM - 1:00 PM' },
            { dia: 'Sábado', horas: '8:00 AM - 12:00 PM' },
            { dia: 'Domingo', horas: 'No disponible' },
          ],
          valoraciones: [] // Puedes cargar valoraciones reales si las tienes
        });
      }
    };

    cargarDoctor();
  }, [uid]);

  if (!doctor) return <p>Cargando perfil del médico...</p>;

  const currency = (n) => `$${n.toLocaleString('es-MX')}`;
  const promedio = doctor.valoraciones.length > 0
    ? doctor.valoraciones.reduce((acc, v) => acc + v.estrellas, 0) / doctor.valoraciones.length
    : 0;
  const totalReseñas = doctor.valoraciones.length;

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
              <Button
                label="Agendar Cita"
                icon="pi pi-calendar-plus"
                className="pm-btn-cita"
                onClick={() => setModalCita(true)}
              />
            </div>
          </Card>

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
          <Card className="pm-card pm-services-card" title="Servicios Médicos">
            <div className="pm-services-grid">
              {doctor.servicios.map((s, i) => (
                <div key={i} className="pm-service-box">
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

          <Card className="pm-card full" title={`Reseñas de Pacientes  ·  ${promedio.toFixed(1)} (${totalReseñas})`}>
            <DataView value={doctor.valoraciones} itemTemplate={valoracionTemplate} layout="list" paginator rows={5} />
          </Card>
        </main>
      </div>

      {modalCita && (
        <div className="modal-overlay" onClick={() => setModalCita(false)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar-modal" onClick={() => setModalCita(false)}>×</button>
            <AgendarCita onClose={() => setModalCita(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
