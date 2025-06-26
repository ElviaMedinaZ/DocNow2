/*
 * Descripción: Implementación de vista modal de confirmacion de cita
 * Fecha: 25 Junio de 2025
 * Programador: Elvia Medina
 */

import "../../styles/paciente/confirmacion-cita.css";

export default function ConfirmacionCita({ info, onFinalizar }) {
  return (
    <div className="confirmacion-container">
      <h2>¡Pago Exitoso!</h2>
      <p>Su cita ha sido confirmada y pagada</p>
      <div className="recibo">
        <h4>Recibo de Pago</h4>
        <p><strong>Servicio:</strong> {info.consulta}</p>
        <p><strong>Fecha:</strong> {info.fecha}</p>
        <p><strong>Hora:</strong> {info.hora}</p>
        <p><strong>Monto Pagado:</strong> ${info.total}</p>
        <p><strong>Método:</strong> Tarjeta de Crédito ****{info.tarjeta?.slice(-4)}</p>
      </div>
      <div className="pasos-siguientes">
        <h4>Próximos Pasos</h4>
        <ul>
          <li>Recibirá un email de confirmación</li>
          <li>Llegue 15 minutos antes de su cita</li>
          <li>Traiga su identificación y seguro médico</li>
        </ul>
      </div>
      <button onClick={onFinalizar}>Finalizar</button>
    </div>
  );
}
