/*
 * Descripción: Implementación de agendar cita con los modales
 * Fecha: 24 Junio de 2025
 * Programador: Elvia Medina
 */
import { Calendar } from "primereact/calendar";
import { useState } from "react";
import { FaClock } from "react-icons/fa";
import CitaResumen from "../../components/paciente/cita-resumen.jsx";
import "../../styles/paciente/cita-resumen.css";

import "../../styles/paciente/agendar-cita.css";

const appointments = [
  {
    title: "Consulta General de Cardiología",
    description: "Evaluación completa del sistema cardiovascular",
    duration: "45 min",
    price: "$150",
  },
  {
    title: "Ecocardiograma",
    description: "Ultrasonido del corazón para evaluar función cardíaca",
    duration: "30 min",
    price: "$200",
  },
  {
    title: "Electrocardiograma",
    description: "Registro de la actividad eléctrica del corazón",
    duration: "15 min",
    price: "$80",
  },
  {
    title: "Holter 24 horas",
    description: "Monitoreo continuo del ritmo cardíaco durante 24 horas",
    duration: "Instalación: 15 min",
    price: "$300",
  },
];

const availableTimes = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"
];

export default function AgendarCita() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({});

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [motivo, setMotivo] = useState("");
  const [notas, setNotas] = useState("");

  const handleNext = () => {
    if (step === 2) {
      setFormData({
        nombre,
        edad,
        email,
        telefono,
        motivo,
        consulta: appointments[selectedAppointment].title,
        duracion: appointments[selectedAppointment].duration,
        precio: appointments[selectedAppointment].price,
        fecha: date.toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        hora: selectedTime,
      });
    }
    setStep(step + 1);
  };

  const renderStep1 = () => (
    <div className="ap-container">
      <h2 className="ap-title">
        <span className="ap-icon">📅</span> Agendar Cita con Dr. María González
      </h2>
      <div className="ap-grid">
        <div className="ap-calendar-section">
          <h3 className="ap-subtitle">Seleccionar Fecha</h3>
          <Calendar value={date} onChange={(e) => setDate(e.value)} inline showIcon />
          <div className="ap-legend">
            <span className="ap-legend-item">
              <span className="ap-dot ap-dot-blue" /> Seleccionado
            </span>
            <span className="ap-legend-item">
              <span className="ap-dot ap-dot-light" /> Disponible
            </span>
            <span className="ap-legend-item">
              <span className="ap-dot ap-dot-gray" /> No disponible
            </span>
          </div>
        </div>
        <div className="ap-consultas-section">
          <h3 className="ap-subtitle">Tipo de Consulta</h3>
          {appointments.map((item, index) => (
            <div
              key={index}
              className={`ap-card ${selectedAppointment === index ? "ap-card-selected" : ""}`}
              onClick={() => setSelectedAppointment(index)}
            >
              <div className="ap-card-title">{item.title}</div>
              <div className="ap-card-description">{item.description}</div>
              <div className="ap-card-footer">
                <span className="ap-duration">
                  <FaClock /> {item.duration}
                </span>
                <span className="ap-price">{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {date && selectedAppointment !== null && (
        <div className="ap-horarios">
          <h3>Horarios Disponibles</h3>
          <p>{date.toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          <div className="ap-horarios-grid">
            {availableTimes.map((time) => (
              <button
                key={time}
                className={`ap-hora-btn ${selectedTime === time ? "ap-hora-seleccionada" : ""}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
          {selectedTime && (
            <button className="ap-btn-continuar" onClick={handleNext}>
              Continuar con los Datos
            </button>
          )}
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="ap-form-paciente">
      <h2>Información del Paciente</h2>
      <div className="ap-form-grid">
        <input placeholder="Ej: Juan Pérez García" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input placeholder="Ej: 35" value={edad} onChange={(e) => setEdad(e.target.value)} />
        <input placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="+1 (555) 123-4567" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <textarea placeholder="Describa brevemente el motivo de su consulta..." value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        <textarea placeholder="Información adicional que considere relevante..." value={notas} onChange={(e) => setNotas(e.target.value)} />
      </div>
      <div className="ap-form-actions">
        <button onClick={() => setStep(1)}>⟵ Volver</button>
        <button className="ap-btn-continuar" onClick={handleNext}>Revisar Cita</button>
      </div>
    </div>
  );

  return (
    <div>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && <CitaResumen info={formData} volver={() => setStep(2)} />}
    </div>
  );
}
