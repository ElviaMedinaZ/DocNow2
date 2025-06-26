/*
 * Descripción: Implementación de agendar cita con validaciones y modales
 * Fecha: 24 Junio de 2025
 * Programador: Elvia Medina
 */

import { addDoc, collection, doc, getDoc, Timestamp } from "firebase/firestore";
import { Calendar } from "primereact/calendar";
import { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import Swal from "sweetalert2";
import { auth, db } from "../../lib/firebase";

import CitaResumen from "../../components/paciente/cita-resumen.jsx";
import ConfirmacionCita from "../../components/paciente/confirmacion-cita.jsx";
import PagoCita from "../../components/paciente/pago-cita.jsx";
import "../../styles/paciente/agendar-cita-error.css";
import "../../styles/paciente/agendar-cita.css";

const appointments = [
  { title: "Consulta General de Cardiología", description: "Evaluación completa del sistema cardiovascular", duration: "45 min", price: "150" },
  { title: "Ecocardiograma", description: "Ultrasonido del corazón para evaluar función cardíaca", duration: "30 min", price: "200" },
  { title: "Electrocardiograma", description: "Registro de la actividad eléctrica del corazón", duration: "15 min", price: "80" },
  { title: "Holter 24 horas", description: "Monitoreo continuo del ritmo cardíaco durante 24 horas", duration: "Instalación: 15 min", price: "300" },
];

const availableTimes = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM"
];

const convertirHoraAFecha = (horaStr, fechaBase) => {
  const [horaMinuto, meridiano] = horaStr.split(" ");
  let [horas, minutos] = horaMinuto.split(":").map(Number);
  if (meridiano === "PM" && horas !== 12) horas += 12;
  if (meridiano === "AM" && horas === 12) horas = 0;

  const fecha = new Date(fechaBase);
  fecha.setHours(horas, minutos, 0, 0);
  return fecha;
};

export default function AgendarCita({ onClose }) {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({});

  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [motivo, setMotivo] = useState("");
  const [notas, setNotas] = useState("");

  const [errores, setErrores] = useState({});
  const [uid, setUid] = useState(null);

  // Calcular edad desde fecha de nacimiento
  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const m = hoy.getMonth() - fechaNacimiento.getMonth();
    return m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate()) ? edad - 1 : edad;
  };

  // Cargar datos del paciente al montar
  useEffect(() => {
    const cargarDatosPaciente = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        setUid(user.uid);

        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setNombre(data.nombres || "");
          setEdad(data.fechaNacimiento ? calcularEdad(new Date(data.fechaNacimiento)).toString() : "");
          setEmail(data.correoElectronico || data.email || "");
          setTelefono(data.telefono || "");
        }
      } catch (error) {
        console.error("Error al cargar datos del paciente:", error);
      }
    };

    cargarDatosPaciente();
  }, []);

  const toggleAppointment = (index) => {
    setSelectedAppointments((prev) =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleNext = () => {
    if (step === 1) {
      if (!date) return Swal.fire("Fecha requerida", "Por favor seleccione una fecha para la cita.", "warning");
      if (selectedAppointments.length === 0) return Swal.fire("Consulta requerida", "Seleccione al menos un servicio.", "warning");
      if (!selectedTime) return Swal.fire("Hora requerida", "Debe seleccionar un horario disponible.", "warning");
    }

    if (step === 2) {
      const nuevosErrores = {};
      if (!nombre.trim()) nuevosErrores.nombre = true;
      if (!edad.trim()) nuevosErrores.edad = true;
      if (!email.trim()) nuevosErrores.email = true;
      if (!telefono.trim() || telefono.length !== 10) nuevosErrores.telefono = true;
      if (!motivo.trim()) nuevosErrores.motivo = true;

      setErrores(nuevosErrores);

      if (Object.keys(nuevosErrores).length > 0) {
        if (Object.values(nuevosErrores).length === 5) {
          return Swal.fire("Todos los campos están vacíos", "Debe llenar todos los campos requeridos.", "warning");
        }
        return Swal.fire("Campos incompletos", "Revise los campos marcados en rojo.", "warning");
      }

      const consultas = selectedAppointments.map(i => appointments[i]);
      const totalPrecio = consultas.reduce((acc, cur) => acc + parseFloat(cur.price), 0);
      const listaConsultas = consultas.map(c => c.title).join(", ");
      const duraciones = consultas.map(c => c.duration).join(" + ");

      setFormData({
        nombre,
        edad,
        email,
        telefono,
        motivo,
        notas,
        consulta: listaConsultas,
        duracion: duraciones,
        precio: totalPrecio,
        fecha: date.toLocaleDateString("es-MX", {
          weekday: "long", year: "numeric", month: "long", day: "numeric"
        }),
        hora: selectedTime,
        consultorio: "Consultorio 205",
      });
    }

    setStep(step + 1);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const renderStep1 = () => {
    const ahora = new Date();
    const esHoy = date && date.toDateString() === ahora.toDateString();

    const horariosFiltrados = esHoy
      ? availableTimes.filter((hora) => {
          const horaCompleta = convertirHoraAFecha(hora, date);
          return horaCompleta > ahora;
        })
      : availableTimes;

    return (
      <div className="ap-container">
        <h2 className="ap-title"><span className="ap-icon">📅</span> Agendar Cita con Dr. María González</h2>
        <div className="ap-grid">
          <div className="ap-calendar-section">
            <h3 className="ap-subtitle">Seleccionar Fecha</h3>
            <Calendar
              value={date}
              onChange={(e) => setDate(e.value)}
              inline
              showIcon
              // minDate={today}
                minDate={today}
              // maxDate={maxDate}
            />
          </div>

          <div className="ap-consultas-section">
            <h3 className="ap-subtitle">Servicios a solicitar</h3>
            {appointments.map((item, index) => (
              <div
                key={index}
                className={`ap-card ${selectedAppointments.includes(index) ? "ap-card-selected" : ""}`}
                onClick={() => toggleAppointment(index)}
              >
                <div className="ap-card-title">{item.title}</div>
                <div className="ap-card-description">{item.description}</div>
                <div className="ap-card-footer">
                  <span className="ap-duration"><FaClock /> {item.duration}</span>
                  <span className="ap-price">${item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {date && selectedAppointments.length > 0 && (
          <div className="ap-horarios">
            <h3>Horarios Disponibles</h3>
            <p>{date.toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            <div className="ap-horarios-grid">
              {horariosFiltrados.map((time) => (
                <button
                  key={time}
                  className={`ap-hora-btn ${selectedTime === time ? "ap-hora-seleccionada" : ""}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
            <button className="ap-btn-continuar" onClick={handleNext}>Continuar con los Datos</button>
          </div>
        )}
      </div>
    );
  };

  const renderStep2 = () => (
    <div className="ap-form-paciente">
      <h2>Información del Paciente</h2>
      <div className="ap-form-grid">
        <input className={errores.nombre ? "input-error" : ""} maxLength={50} placeholder="Ej: Juan Pérez García" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input className={errores.edad ? "input-error" : ""} maxLength={3} placeholder="Ej: 35" value={edad} onChange={(e) => setEdad(e.target.value.replace(/\D/g, ""))} />
        <input className={errores.email ? "input-error" : ""} maxLength={50} placeholder="ejemplo@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={errores.telefono ? "input-error" : ""} maxLength={10} placeholder="5551234567" value={telefono} onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))} />
        <textarea className={errores.motivo ? "input-error" : ""} placeholder="Motivo de consulta..." value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        <textarea placeholder="Notas adicionales..." value={notas} onChange={(e) => setNotas(e.target.value)} />
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
      {step === 3 && <CitaResumen info={formData} volver={() => setStep(2)} continuar={() => setStep(4)} />}
      {step === 4 && (
        <PagoCita
          info={{ ...formData, total: (parseFloat(formData.precio) * 1.1).toFixed(2) }}
          onConfirm={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}
      {step === 5 && (
        <ConfirmacionCita
          info={{
            ...formData,
            total: (parseFloat(formData.precio) * 1.1).toFixed(2),
            tarjeta: "1213",
          }}
          onFinalizar={async () => {
            try {
              const citaData = {
                ...formData,
                total: (parseFloat(formData.precio) * 1.1).toFixed(2),
                tarjeta: "1213",
                fecha: date.toISOString(),
                hora: selectedTime,
                creadaEn: Timestamp.now(),
                uid: uid,
              };

              await addDoc(collection(db, "citas"), citaData);

              await Swal.fire({
                title: "¡Cita registrada con éxito!",
                text: "Recibirá una confirmación por email o SMS.",
                icon: "success",
                confirmButtonText: "OK"
              });

              if (onClose) onClose();
              setStep(1);
              setDate(null);
              setSelectedAppointments([]);
              setSelectedTime(null);
              setFormData({});
              setNombre(""); setEdad(""); setEmail(""); setTelefono(""); setMotivo(""); setNotas("");
              setErrores({});
            } catch (error) {
              console.error("Error al guardar la cita:", error);
              await Swal.fire("Error", "No se pudo guardar la cita. Intenta nuevamente.", "error");
            }
          }}
          onBack={() => setStep(4)}
        />
      )}
    </div>
  );
}
