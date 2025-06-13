/**
 * Descripción: Diseño de vista Registro con SweetAlert2 + validación de fecha
 * Fecha: 11 Junio de 2025
 * Programador: Elvia Medina
 */

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import placeholder from '../../assets/avatar_placeholder.png';
import logo from '../../assets/logo.png';
import '../../styles/usuario/Registro.css';

const MySwal = withReactContent(Swal);
const HOY = new Date();
const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;


export default function RegistroWeb() {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidoP: '',
    apellidoM: '',
    curp: '',
    sexo: '',
    fechaNacimiento: null,
    estadoCivil: '',
    correoElectronico: '',
    telefono: '',
    contrasena: '',
    confirmar: '',
  });

  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [errores, setErrores] = useState({});
  const [mensajes, setMensajes] = useState({});

  const opcionesEstadoCivil = [
    { label: 'Soltero/a', value: 'Soltero' },
    { label: 'Casado/a', value: 'Casado' },
    { label: 'Divorciado/a', value: 'Divorciado' },
    { label: 'Viudo/a', value: 'Viudo' },
  ];

  const handleChange = (campo, valor) => {
    setFormData({ ...formData, [campo]: valor });
    if (errores[campo]) {
      setErrores({ ...errores, [campo]: false });
      setMensajes({ ...mensajes, [campo]: '' });
    }
  };

  const handleFotoChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setFotoPerfil(URL.createObjectURL(archivo));
    }
  };

  const calcularEdad = (fecha) => {
    if (!fecha) return 0;
    const diff = HOY.getTime() - fecha.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const validarYEnviar = () => {
    const nuevosErrores = {};
    const nuevosMensajes = {};

    // Requeridos
    Object.entries(formData).forEach(([campo, valor]) => {
      if (!valor) {
        nuevosErrores[campo] = true;
        nuevosMensajes[campo] = 'Este campo es obligatorio';
      }
    });

    // Foto obligatoria
    if (!fotoPerfil) {
      nuevosErrores.fotoPerfil = true;
      nuevosMensajes.fotoPerfil = 'La foto es obligatoria';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correoElectronico && !emailRegex.test(formData.correoElectronico)) {
      nuevosErrores.correoElectronico = true;
      nuevosMensajes.correoElectronico = 'Correo electrónico inválido';
    }

    // Teléfono
    const telRegex = /^[0-9]{10,}$/;
    if (formData.telefono && !telRegex.test(formData.telefono)) {
      nuevosErrores.telefono = true;
      nuevosMensajes.telefono = 'Solo números, mínimo 10 dígitos';
    }

    // CURP
    const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}\d{2}$/i;
    if (formData.curp && !curpRegex.test(formData.curp)) {
      nuevosErrores.curp = true;
      nuevosMensajes.curp = 'CURP no válido';
    }

   // Contraseña
if (formData.contrasena && !passRegex.test(formData.contrasena)) {
  nuevosErrores.contrasena = true;
  nuevosMensajes.contrasena =
    'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial';
}

if (formData.contrasena !== formData.confirmar) {
  nuevosErrores.confirmar = true;
  nuevosMensajes.confirmar = 'Las contraseñas no coinciden';
}


    // Fecha de nacimiento
    if (formData.fechaNacimiento) {
      const edad = calcularEdad(formData.fechaNacimiento);
      if (formData.fechaNacimiento > HOY) {
        nuevosErrores.fechaNacimiento = true;
        nuevosMensajes.fechaNacimiento = 'La fecha no puede ser futura';
      } else if (edad > 130) {
        nuevosErrores.fechaNacimiento = true;
        nuevosMensajes.fechaNacimiento = 'Favor de  ingresar  una fecha valida ';
      }
    }

    setErrores(nuevosErrores);
    setMensajes(nuevosMensajes);

    const primeraClaveError = Object.keys(nuevosMensajes)[0];
    if (primeraClaveError) {
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: nuevosMensajes[primeraClaveError],
        confirmButtonColor: '#0A3B74',
      });
      return;
    }

    MySwal.fire({
      icon: 'success',
      title: '¡Registro completado!',
      text: 'El registro se completó correctamente',
      confirmButtonColor: '#0A3B74',
    }).then(() => {
      console.log('Formulario válido:', { ...formData, fotoPerfil });
    });
  };

  return (
    <div className="RegistroContainer">
      <div className="RegistroForm">
        <img src={logo} alt="Logo" className="Logo" />
        <h2 className="Titulo">Registro</h2>
        <p className="Subtitulo">Llena los campos tal como aparecen en tus documentos oficiales.</p>

        {/* Foto */}
        <div className="FotoPreview">
          <img src={fotoPerfil || placeholder} alt="Avatar" className={`PreviewImg ${errores.fotoPerfil ? 'PInvalid' : ''}`} />
          <label className="FileLabel">
            Cambiar foto
            <input type="file" accept="image/*" onChange={handleFotoChange} hidden />
          </label>
          {mensajes.fotoPerfil && <p className="ErrorMsg">{mensajes.fotoPerfil}</p>}
        </div>

        <div className="PFluid">
          <InputText placeholder="Nombre(s)" className={errores.nombres ? 'PInvalid' : ''} value={formData.nombres} onChange={(e) => handleChange('nombres', e.target.value)} />
          <InputText placeholder="Apellido paterno" className={errores.apellidoP ? 'PInvalid' : ''} value={formData.apellidoP} onChange={(e) => handleChange('apellidoP', e.target.value)} />
          <InputText placeholder="Apellido materno" className={errores.apellidoM ? 'PInvalid' : ''} value={formData.apellidoM} onChange={(e) => handleChange('apellidoM', e.target.value)} />

          <InputText placeholder="CURP" className={errores.curp ? 'PInvalid' : ''} value={formData.curp} onChange={(e) => handleChange('curp', e.target.value)} />

          <Dropdown
            value={formData.sexo}
            options={[
              { label: 'Masculino', value: 'Masculino' },
              { label: 'Femenino', value: 'Femenino' },
            ]}
            onChange={(e) => handleChange('sexo', e.value)}
            placeholder="Sexo"
            className={errores.sexo ? 'PInvalid' : ''}
          />

          <Calendar value={formData.fechaNacimiento} onChange={(e) => handleChange('fechaNacimiento', e.value)} placeholder="Fecha de nacimiento" showIcon dateFormat="dd/mm/yy" className={errores.fechaNacimiento ? 'PInvalid' : ''} />

          <Dropdown value={formData.estadoCivil} options={opcionesEstadoCivil} onChange={(e) => handleChange('estadoCivil', e.value)} placeholder="Estado civil" className={errores.estadoCivil ? 'PInvalid' : ''} />
          <InputText placeholder="Correo electrónico" className={errores.correoElectronico ? 'PInvalid' : ''} value={formData.correoElectronico} onChange={(e) => handleChange('correoElectronico', e.target.value)} />
          <InputText placeholder="Teléfono" className={errores.telefono ? 'PInvalid' : ''} value={formData.telefono} onChange={(e) => handleChange('telefono', e.target.value)} />
          <Password placeholder="Contraseña" feedback={false} toggleMask value={formData.contrasena} onChange={(e) => handleChange('contrasena', e.target.value)} className={errores.contrasena ? 'PInvalid' : ''} />
          <Password placeholder="Confirmar contraseña" feedback={false} toggleMask value={formData.confirmar} onChange={(e) => handleChange('confirmar', e.target.value)} className={errores.confirmar ? 'PInvalid' : ''} />
          <Button label="Siguiente" onClick={validarYEnviar} className="BtnSiguiente p-button-primary" />
        </div>
      </div>
    </div>
  );
}
