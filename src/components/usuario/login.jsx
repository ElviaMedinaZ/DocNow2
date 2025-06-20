/**
 * Descripción:Se agrega la pantalla de login
 * Fecha:11 Junio de 2025
 * Programador: Elvia Medina
 */

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import logo from '../../assets/logo.png';
import '../../styles/usuario/Login.css';

const MySwal = withReactContent(Swal);
const correoReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const credencialesValidas = {
  correo: 'paciente@paciente.com',
  contrasena: 'Paciente$123'
};

export default function Login() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({ correoElectronico: '', contrasena: '' });
  const [errores, setErrores] = useState({});

  const manejarCambio = (campo, valor) => {
    setDatos(prev => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores(prev => ({ ...prev, [campo]: false }));
  };

  const validarYEnviar = async () => {
    const err = {};
    const msg = {};

    /* --- Validaciones --- */
    if (!datos.correoElectronico) {
      err.correoElectronico = true;
      msg.correoElectronico = 'El correo es obligatorio';
    } else if (!correoReg.test(datos.correoElectronico)) {
      err.correoElectronico = true;
      msg.correoElectronico = 'Correo inválido';
    }
    if (!datos.contrasena) {
      err.contrasena = true;
      msg.contrasena = 'La contraseña es obligatoria';
    }
    if (
      datos.correoElectronico &&
      datos.contrasena &&
      (datos.correoElectronico !== credencialesValidas.correo ||
        datos.contrasena !== credencialesValidas.contrasena)
    ) {
      err.correoElectronico = true;
      err.contrasena = true;
      msg.general = 'Correo o contraseña incorrectos';
    }

    setErrores(err);
    if (Object.keys(err).length) {
      await MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: msg.general || msg[Object.keys(msg)[0]],
        confirmButtonColor: '#0A3B74'
      });
      return;
    }

    await MySwal.fire({
      icon: 'success',
      title: '¡Bienvenido!',
      timer: 1200,
      showConfirmButton: false
    });
    navigate('/home-paciente');
  };

  return (
    <div className="loginContainer">
      <div className="loginCard p-fluid">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="loginTitulo">Inicio de sesión</h2>

        {/* ---- Correo ---- */}
        <div className="formGroup">
          <InputText
            placeholder="Correo electrónico"
            type="email"
            value={datos.correoElectronico}
            onChange={e => manejarCambio('correoElectronico', e.target.value)}
            className={`loginInput ${errores.correoElectronico ? 'p-invalid' : ''}`}
          />
        </div>

        {/* ---- Contraseña ---- */}
        <div className="formGroup">
          <Password
            placeholder="Contraseña"
            value={datos.contrasena}
            onChange={e => manejarCambio('contrasena', e.target.value)}
            toggleMask
            feedback={false}
            className="loginInput"
            inputClassName={errores.contrasena ? 'p-invalid' : ''}
          />
          <div className="forgot-wrapper">
            <Link to="/RecuperarContrasena" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <Button label="Ingresar" onClick={validarYEnviar} className="btnIngresar" />

        {/* ---- enlace REGISTRATE ---- */}
        <p className="register-text">
          ¿No tienes cuenta?{' '}
          <Link to="/registroPaciente" className="register-link">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
