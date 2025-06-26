
/*
 * Descripción: Implementación de vista modal de pago cita
 * Fecha: 24 Junio de 2025
 * Programador: Elvia Medina
 */


import { useState } from "react";
import Swal from "sweetalert2";
import "../../styles/paciente/pago-cita.css";

export default function PagoCita({ info, onConfirm, onBack }) {
  const [formulario, setFormulario] = useState({
    tarjeta: "",
    vencimiento: "",
    cvv: "",
    nombreTitular: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
  });

  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "tarjeta") {
      newValue = value.replace(/\D/g, "").slice(0, 15);
    }

    if (name === "vencimiento") {
      newValue = value.replace(/\D/g, "").slice(0, 4);
      if (newValue.length >= 3) {
        newValue = `${newValue.slice(0, 2)}/${newValue.slice(2)}`;
      }
    }

    if (name === "cvv") {
      newValue = value.replace(/\D/g, "").slice(0, 3);
    }

    if (name === "codigoPostal") {
      newValue = value.replace(/\D/g, "").slice(0, 5);
    }

    setFormulario({ ...formulario, [name]: newValue });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (Object.values(formulario).every((val) => val.trim() === "")) {
        e.preventDefault();
        return Swal.fire("Campos vacíos", "Por favor, complete todos los campos antes de continuar.", "warning");
      }
    }
  };

  const handlePagar = () => {
    const nuevosErrores = {};
    const { tarjeta, vencimiento, cvv, nombreTitular, direccion, ciudad, codigoPostal } = formulario;

    if (!/^\d{15}$/.test(tarjeta)) {
      nuevosErrores.tarjeta = true;
      return Swal.fire("Número de tarjeta inválido", "Debe contener exactamente 15 dígitos numéricos.", "error");
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(vencimiento)) {
      nuevosErrores.vencimiento = true;
      return Swal.fire("Fecha inválida", "Ingrese una fecha en formato MM/AA.", "error");
    } else {
      const [mesStr, anioStr] = vencimiento.split("/");
      const mes = parseInt(mesStr, 10);
      const anio = parseInt("20" + anioStr, 10);
      const fechaActual = new Date();
      const fechaVencimiento = new Date(anio, mes);

      if (fechaVencimiento <= fechaActual) {
        nuevosErrores.vencimiento = true;
        return Swal.fire("Tarjeta vencida", "La tarjeta ingresada ya expiró.", "error");
      }
    }

    if (!/^\d{3}$/.test(cvv)) {
      nuevosErrores.cvv = true;
      return Swal.fire("CVV inválido", "Debe contener exactamente 3 dígitos.", "error");
    }

    if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]{3,}$/.test(nombreTitular.trim())) {
      nuevosErrores.nombreTitular = true;
      return Swal.fire("Nombre inválido", "Solo se permiten letras y espacios (mínimo 3 caracteres).", "error");
    }

    if (!/^[a-zA-Z0-9\s.,#-]{5,}$/.test(direccion.trim())) {
      nuevosErrores.direccion = true;
      return Swal.fire("Dirección inválida", "Debe tener al menos 5 caracteres válidos.", "error");
    }

    if (!ciudad.trim()) {
      nuevosErrores.ciudad = true;
      return Swal.fire("Ciudad requerida", "Debe ingresar una ciudad válida.", "error");
    }

    if (!/^\d{5}$/.test(codigoPostal)) {
      nuevosErrores.codigoPostal = true;
      return Swal.fire("Código Postal inválido", "Debe contener exactamente 5 dígitos.", "error");
    }

    setErrores({});

    Swal.fire({
      title: "¿Desea realizar el pago?",
      text: `Se cobrará un total de $${info.total}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, pagar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          onConfirm({ tarjeta: tarjeta.slice(-4) });
        }, 1000);
      }
    });
  };

  return (
    <div className="pago-cita-container">
      <h2>Pago de la Cita</h2>
      <div className="pago-grid">
        <div className="pago-form">
          <h4>Información de Pago</h4>

          <input
            name="tarjeta"
            placeholder="Número de Tarjeta"
            onChange={handleChange}
            value={formulario.tarjeta}
            maxLength={15}
            className={errores.tarjeta ? "input-error" : ""}
            onKeyDown={handleKeyDown}
          />

          <input
            name="vencimiento"
            placeholder="Fecha de Vencimiento (MM/AA)"
            onChange={handleChange}
            value={formulario.vencimiento}
            maxLength={5}
            className={errores.vencimiento ? "input-error" : ""}
          />

          <input
            name="cvv"
            placeholder="CVV"
            onChange={handleChange}
            value={formulario.cvv}
            maxLength={3}
            className={errores.cvv ? "input-error" : ""}
          />

          <input
            name="nombreTitular"
            placeholder="Nombre del Titular"
            onChange={handleChange}
            value={formulario.nombreTitular}
            maxLength={40}
            className={errores.nombreTitular ? "input-error" : ""}
          />

          <input
            name="direccion"
            placeholder="Dirección de Facturación"
            onChange={handleChange}
            value={formulario.direccion}
            maxLength={80}
            className={errores.direccion ? "input-error" : ""}
          />

          <input
            name="ciudad"
            placeholder="Ciudad"
            onChange={handleChange}
            value={formulario.ciudad}
            maxLength={40}
            className={errores.ciudad ? "input-error" : ""}
          />

          <input
            name="codigoPostal"
            placeholder="Código Postal"
            onChange={handleChange}
            value={formulario.codigoPostal}
            maxLength={5}
            className={errores.codigoPostal ? "input-error" : ""}
          />

          <div className="pago-form-buttons">
            <button className="btn-volver" onClick={onBack}>⟵ Volver</button>
            <button onClick={handlePagar}>Pagar ${info.total}</button>
          </div>
        </div>

        <div className="pago-resumen">
          <h4>Resumen del Pago</h4>
          <p><strong>Servicio:</strong> {info.consulta}</p>
          <p><strong>Fecha:</strong> {info.fecha}</p>
          <p><strong>Hora:</strong> {info.hora}</p>
          <p><strong>Subtotal:</strong> ${info.precio}</p>
          <p><strong>Impuestos (10%):</strong> ${(parseFloat(info.precio) * 0.10).toFixed(2)}</p>
          <p><strong>Total:</strong> <span style={{ color: "green" }}>${info.total}</span></p>
        </div>
      </div>
    </div>
  );
}
