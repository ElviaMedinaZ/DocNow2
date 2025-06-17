/* Login.jsx */
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import logo from '../../assets/logo.png';
import '../../styles/usuario/Login.css';

const MySwal = withReactContent(Swal);
const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const credencialesValidas = {
  correo: 'paciente@paciente.com',
  contrasena: 'Paciente$123',
};

export default function Login() {
  const navigate = useNavigate();
  const [datosFormulario, setDatosFormulario] = useState({
    correoElectronico: '',
    contrasena: '',
  });

  const [errores, setErrores] = useState({});

  const manejarCambio = (campo, valor) => {
    setDatosFormulario((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: false }));
  };

  const validarYEnviar = () => {
    const nuevosErrores = {};
    const nuevosMensajes = {};

    // -- Correo
    if (!datosFormulario.correoElectronico) {
      nuevosErrores.correoElectronico = true;
      nuevosMensajes.correoElectronico = 'El correo es obligatorio';
    } else if (!expresionCorreo.test(datosFormulario.correoElectronico)) {
      nuevosErrores.correoElectronico = true;
      nuevosMensajes.correoElectronico = 'Correo inválido';
    }

    // -- Contraseña
    if (!datosFormulario.contrasena) {
      nuevosErrores.contrasena = true;
      nuevosMensajes.contrasena = 'La contraseña es obligatoria';
    }

    // -- Credenciales
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
      const msg =
        nuevosMensajes.general ||
        nuevosMensajes[Object.keys(nuevosMensajes)[0]];
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
        confirmButtonColor: '#0A3B74',
      });
      return;
    }

     navigate('/HomePaciente');

    console.log('Sesión abierta', datosFormulario);
  };

  return (
    <div className="loginContainer">
      <div className="loginCard p-fluid">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="loginTitulo">Inicio de sesión</h2>

        {/* Correo */}
        <div className="formGroup">
          <InputText
            placeholder="Correo electrónico"
            value={datosFormulario.correoElectronico}
            type="email"
            onChange={(e) =>
              manejarCambio('correoElectronico', e.target.value)
            }
            className={`loginInput ${
              errores.correoElectronico ? 'p-invalid' : ''
            }`}
          />
        </div>

        {/* Contraseña */}
        <div className="formGroup">
          <Password
            placeholder="Contraseña"
            value={datosFormulario.contrasena}
            onChange={(e) => manejarCambio('contrasena', e.target.value)}
            toggleMask
            feedback={false}
            className="loginInput"
            inputClassName={errores.contrasena ? 'p-invalid' : ''}
          />
        </div>

        <Button label="Ingresar" onClick={validarYEnviar} className="btnIngresar" />
      </div>
    </div>
  );
}
