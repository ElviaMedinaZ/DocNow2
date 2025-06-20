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
import { TabMenu } from 'primereact/tabmenu';
import { Tag } from 'primereact/tag';
import { useState } from 'react';
import { Divider } from 'primereact/divider';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { useState } from 'react';

import HeaderPaciente from '../../components/paciente/MenuPaciente';
import '../../styles/medico/PerfilMedico.css';

/* -------------------- datos demo -------------------- */
// Datos de prueba
const doctorDemo = {
  nombre: 'Dr. Mario Orantes',
  especialidad:'Cardiologo',
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
      avatar: 'https://i.pravatar.cc/100?img=23',
      estrellas: 5,
      comentario: 'Buen servicio 👍',
      fecha: '27 mar 2022',
    },
  ],
};
/* ---------------------------------------------------- */

export default function PerfilMedico({ doctor = doctorDemo }) {
  const [active, setActive] = useState(0);

  const tabs = [
    { label: 'Datos',          icon: 'pi pi-id-card'   },
    { label: 'Servicios',      icon: 'pi pi-list'      },
    { label: 'Disponibilidad', icon: 'pi pi-calendar'  },
    { label: 'Valoraciones',   icon: 'pi pi-star-fill' },
  ];

  const currency = (n) => `$${n.toLocaleString('es-MX')}`;

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
      {/* Barra superior global */}
      <HeaderPaciente />

      {/* Cabecera del perfil */}
      <header className="pm-header">
        <img src={doctor.foto} alt={doctor.nombre} className="pm-img" />
        <div className="pm-info">
          <h1 className="pm-name">{doctor.nombre}</h1>
          <Tag value={doctor.horario.turno} rounded className="pm-tag" />
        </div>
      </header>

      {/* Menú de secciones */}
      <TabMenu
        model={tabs}
        activeIndex={active}
        onTabChange={(e) => setActive(e.index)}
        className="pm-tabmenu"
      />

      {/* Contenido por pestaña */}
      <div className="pm-main">
        {/* Datos */}
        {active === 0 && (
          <Card className="pm-card">
            <h3 className="pm-section-title">Datos de contacto</h3>
            <ul className="pm-contact-list">
              <li><i className="pi pi-phone"    /> {doctor.telefono}</li>
              <li><i className="pi pi-envelope" /> {doctor.email}</li>
              <li><i className="pi pi-building" /> {doctor.consultorio}</li>
            </ul>
          </Card>
        )}

        {/* Servicios */}
        {active === 1 && (
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
        )}

        {/* Disponibilidad */}
        {active === 2 && (
          <Card className="pm-card">
            <h3 className="pm-section-title">Disponibilidad</h3>
            <p>{doctor.horario.dias}</p>
            <p>{doctor.horario.turno}</p>
          </Card>
        )}

        {/* Valoraciones */}
        {active === 3 && (
          <Card title={`Valoraciones (${doctor.valoraciones.length})`} className="pm-card">
            <DataView
              value={doctor.valoraciones}
              itemTemplate={valoracionTemplate}
              layout="list"
              paginator
              rows={3}
            />
          </Card>
        )}

        {/* CTA */}
        <div className="pm-cta">
          <Button label="Solicitar cita" className="pm-btn-cita p-button-lg" />
        </div>
      </div>
    </div>
  );
}
