/*
 * Descripción: Implementacion del resumen de la cita (ventana modal)
 * Fecha: 24 Junio de 2025
 * Programador: Elvia Medina
 */
import "../../styles/paciente/cita-resumen.css";

export default function CitaResumen({ info, volver, continuar }) {
  return (
    <div className="cr-container">
      <h2 className="cr-title">🩺 Detalles de la Cita</h2>

      <div className="cr-section">
        <h3 className="cr-subtitle">Información Médica</h3>
        <div className="cr-grid-2">
          <div>
            <p><strong>Doctor:</strong> Dr. María González</p>
            <p><strong>Especialidad:</strong> Cardiología</p>
            <p><strong>Servicio:</strong> {info.consulta}</p>
            <p><strong>Duración:</strong> {info.duracion}</p>
            <p><strong>Costo:</strong> <span className="cr-price">${info.precio}</span></p>
          </div>
          <div>
            <h4 className="cr-subsubtitle">Fecha y Hora</h4>
            <p><strong>Fecha:</strong> {info.fecha}</p>
            <p><strong>Hora:</strong> {info.hora}</p>
            <p><strong>Ubicación:</strong> {info.consultorio}</p>
          </div>
        </div>
      </div>

      <div className="cr-section">
        <h3 className="cr-subtitle">Información del Paciente</h3>
        <div className="cr-grid-2">
          <div>
            <p><strong>Nombre:</strong> {info.nombre}</p>
            <p><strong>Email:</strong> {info.email}</p>
            <p><strong>Motivo de consulta:</strong> <em>{info.motivo}</em></p>
          </div>
          <div>
            <p><strong>Edad:</strong> {info.edad}</p>
            <p><strong>Teléfono:</strong> {info.telefono}</p>
          </div>
        </div>
      </div>

      <div className="cr-alert">
        <h4>⚠ Información Importante</h4>
        <ul>
          <li>• Llegue 15 minutos antes de su cita</li>
          <li>• Traiga su identificación y seguro médico</li>
          <li>• Para cancelar, contacte con 24 horas de anticipación</li>
        </ul>
      </div>

      <div className="cr-actions">
        <button onClick={volver} className="cr-btn-outline">⟵ Editar Información</button>
        <button onClick={continuar} className="cr-btn-confirm">✓ Confirmar Cita</button>
      </div>
    </div>
  );
}
