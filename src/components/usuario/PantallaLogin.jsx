/**
 * Descripción: Vista de Inicio de Sesión
 * Programador: Elvia Medina
 * Fecha: 12-Jun-2025
 */

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import logo from '../../assets/logo.png';
import '../../styles/usuario/login.css';
const MySwal = withReactContent(Swal);
const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Credenciales validas
const credencialesValidas = {
  correo: 'admin@admin.com',
  contrasena: 'Admin$123',
};

export default function Login() {
  const [datosFormulario, setDatosFormulario] = useState({
    correoElectronico: '',
    contrasena: '',
  });

  const [errores, setErrores] = useState({});

  const manejarCambio = (campo, valor) => {
    setDatosFormulario((prev) => ({ ...prev, [campo]: valor }));

    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: false }));
    }
  };

  const validarYEnviar = () => {
    const nuevosErrores = {};
    const nuevosMensajes = {};

    // Validacion del correo
    if (!datosFormulario.correoElectronico) {
      nuevosErrores.correoElectronico = true;
      nuevosMensajes.correoElectronico = 'El correo es obligatorio';
    } else if (!expresionCorreo.test(datosFormulario.correoElectronico)) {
      nuevosErrores.correoElectronico = true;
      nuevosMensajes.correoElectronico = 'Correo inválido';
    }

    // Validacion de la contraseña
    if (!datosFormulario.contrasena) {
      nuevosErrores.contrasena = true;
      nuevosMensajes.contrasena = 'La contraseña es obligatoria';
    }

    // Verificacion de credenciales
    if (
      datosFormulario.correoElectronico &&
      datosFormulario.contrasena &&
      (datosFormulario.correoElectronico !== credencialesValidas.correo ||
        datosFormulario.contrasena !== credencialesValidas.contrasena)
    ) {
      nuevosErrores.correoElectronico = true;
      nuevosErrores.contrasena = true;
      nuevosMensajes.general = 'Correo o contraseña incorrectos';
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length) {
      const mensaje = nuevosMensajes.general || nuevosMensajes[Object.keys(nuevosMensajes)[0]];
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: mensaje,
        confirmButtonColor: '#0A3B74',
      });
      return;
    }

    console.log('Sesión abierta', datosFormulario);
  };

  return (
    <div className="loginContainer">
      <div className="loginCard p-fluid">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="loginTitulo">Inicio de sesión</h2>

        <div className="formGroup">
          <InputText
            placeholder="Correo electrónico"
            value={datosFormulario.correoElectronico}
            className={`loginInput ${errores.correoElectronico ? 'pInvalid' : ''}`}
            onChange={(e) => manejarCambio('correoElectronico', e.target.value)}
            type="email"
          />
        </div>

        <div className="formGroup">
          <Password
            placeholder="Contraseña"
            value={datosFormulario.contrasena}
            className={`loginInput ${errores.contrasena ? 'pInvalid' : ''}`}
            onChange={(e) => manejarCambio('contrasena', e.target.value)}
            toggleMask
            feedback={false}
          />
        </div>

        <Button label="Ingresar" onClick={validarYEnviar} className="btnIngresar" />
      </div>
    </div>
  );
}
