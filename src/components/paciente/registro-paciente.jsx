/**
 * Descripción: Implementación de la vista de Registro para el paciente
 * Fecha: 11 Junio de 2025
 * Programador: Elvia Medina
 */

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

import placeholder from '../../assets/avatar_placeholder.png';
import logo from '../../assets/logo.png';
import '../../styles/usuario/Registro.css';

const MySwal = withReactContent(Swal);
const HOY = new Date();
const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

/* ---------- utilidades imagen ---------- */
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
  });

const subirAImgbb = async (base64) => {
  const body = new FormData();
  body.append('key', imgbbApiKey);
  body.append('image', base64);

  try {
    const res = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body });
    const data = await res.json();
    return data.success ? data.data.url : null;
  } catch (err) {
    console.error('Error subiendo imagen:', err);
    return null;
  }
};

/* ---------- componente ---------- */
export default function RegistroWeb() {
  const navigate = useNavigate();
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
    rol: 'Paciente',
  });

  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [errores, setErrores] = useState({});
  const [mensajes, setMensajes] = useState({});
  const [cargando, setCargando] = useState(false);

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
    if (archivo) setFotoPerfil(URL.createObjectURL(archivo));
  };

  const calcularEdad = (fecha) => {
    if (!fecha) return 0;
    return Math.floor((HOY - fecha) / 31557600000); // 365.25 días
  };

  const validarYEnviar = async () => {
  const nuevosErrores = {};
  const nuevosMensajes = {};

    /* --- validaciones locales --- */
    Object.entries(formData).forEach(([campo, valor]) => {
      if (!valor) {
        nuevosErrores[campo] = true;
        nuevosMensajes[campo] = 'Este campo es obligatorio';
      }
    });
    if (!fotoPerfil) {
      nuevosErrores.fotoPerfil = true;
      nuevosMensajes.fotoPerfil = 'La foto es obligatoria';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correoElectronico && !emailRegex.test(formData.correoElectronico)) {
      nuevosErrores.correoElectronico = true;
      nuevosMensajes.correoElectronico = 'Correo electrónico inválido';
    }
    const telRegex = /^[0-9]{10}$/;
    if (formData.telefono && !telRegex.test(formData.telefono)) {
      nuevosErrores.telefono = true;
      nuevosMensajes.telefono = 'Solo números, 10 dígitos';
    }
    const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}\d{2}$/i;
    if (formData.curp && !curpRegex.test(formData.curp)) {
      nuevosErrores.curp = true;
      nuevosMensajes.curp = 'CURP no válido';
    }
    if (formData.contrasena && !passRegex.test(formData.contrasena)) {
      nuevosErrores.contrasena = true;
      nuevosMensajes.contrasena =
        'Mínimo 8 caracteres, una mayúscula, un número y un símbolo';
    }
    if (formData.contrasena !== formData.confirmar) {
      nuevosErrores.confirmar = true;
      nuevosMensajes.confirmar = 'Las contraseñas no coinciden';
    }
    if (formData.fechaNacimiento) {
      const edad = calcularEdad(formData.fechaNacimiento);
      if (formData.fechaNacimiento > HOY) {
        nuevosErrores.fechaNacimiento = true;
        nuevosMensajes.fechaNacimiento = 'La fecha no puede ser futura';
      } else if (edad > 130) {
        nuevosErrores.fechaNacimiento = true;
        nuevosMensajes.fechaNacimiento = 'Fecha de nacimiento inválida';
      }
    }

    setErrores(nuevosErrores);
    setMensajes(nuevosMensajes);

    if (Object.keys(nuevosMensajes).length) {
      await MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: nuevosMensajes[Object.keys(nuevosMensajes)[0]],
        confirmButtonColor: '#0A3B74',
      });
      return;
    }

    setCargando(true);
    try {
      // 1. Foto a ImgBB
      const file = document.querySelector('input[type="file"]')?.files[0];
      const base64 = await fileToBase64(file);
      const fotoURL = await subirAImgbb(base64);
      if (!fotoURL) throw new Error('No se pudo subir la imagen');

      // 2. Crear usuario
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.correoElectronico,
        formData.contrasena
      );
      const uid = cred.user.uid;

      // 3. Guardar en Firestore
      await setDoc(doc(db, 'usuarios', uid), {
        ...formData,
        fotoPerfil: fotoURL,
        fechaNacimiento: formData.fechaNacimiento?.toISOString() || null,
        creadoEn: new Date().toISOString(),
      });

      await MySwal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta fue creada correctamente.',
        confirmButtonColor: '#0A3B74',
      });

      navigate('/login', { replace: true });
      return;

    } catch (err) {
      console.error('Error en el registro:', err);

      // Valor por defecto
      let mensajeError = 'Ocurrió un error inesperado. Intenta nuevamente.';

      if (err.code === 'auth/email-already-in-use') {
        mensajeError =
          'El correo utilizado ya está registrado. Te llevaremos al inicio de sesión.';
        
        await MySwal.fire({
          icon: 'info',
          title: 'Correo ya registrado',
          text: mensajeError,
          confirmButtonColor: '#0A3B74',
        });
        navigate('/login', { replace: true });
        return;
      }

      if (err.code === 'auth/invalid-email')
        mensajeError = 'El correo electrónico no es válido.';
      else if (err.code === 'auth/weak-password')
        mensajeError = 'La contraseña es demasiado débil.';

      await MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: mensajeError,
        confirmButtonColor: '#0A3B74',
      });
    } finally {
      setCargando(false);
    }

  };

  /* ---------- render ---------- */
  return (
    <div className="RegistroContainer">
      {/* --- loader overlay --- */}
      {cargando && (
        <div className="loader-overlay"> {/* NEW ➍ */}
          <div className="lds-ring">
            <div></div><div></div><div></div><div></div>
          </div>
        </div>
      )}

      <div className="RegistroForm">
        <img src={logo} alt="Logo" className="Logo" />
        <h2 className="Titulo">Registro</h2>
        <p className="Subtitulo">
          Llena los campos tal como aparecen en tus documentos oficiales.
        </p>

        {/* Foto */}
        <div className="FotoPreview">
          <img
            src={fotoPerfil || placeholder}
            alt="Avatar"
            className={`PreviewImg ${errores.fotoPerfil ? 'PInvalid' : ''}`}
          />
          <label className="FileLabel">
            Cambiar foto
            <input type="file" accept="image/*" onChange={handleFotoChange} hidden />
          </label>
          {mensajes.fotoPerfil && <p className="ErrorMsg">{mensajes.fotoPerfil}</p>}
        </div>

        {/* Formulario */}
        <div className="PFluid">
          {/* ...inputs sin modificar... */}
          <InputText placeholder="Nombre(s)"        className={errores.nombres ? 'PInvalid' : ''}  value={formData.nombres}         onChange={(e) => handleChange('nombres', e.target.value)} />
          <InputText placeholder="Apellido paterno" className={errores.apellidoP ? 'PInvalid' : ''} value={formData.apellidoP}     onChange={(e) => handleChange('apellidoP', e.target.value)} />
          <InputText placeholder="Apellido materno" className={errores.apellidoM ? 'PInvalid' : ''} value={formData.apellidoM}     onChange={(e) => handleChange('apellidoM', e.target.value)} />
          <InputText placeholder="CURP"             className={errores.curp ? 'PInvalid' : ''}      value={formData.curp}          onChange={(e) => handleChange('curp', e.target.value)} />

          <Dropdown
            value={formData.sexo}
            options={[{ label: 'Masculino', value: 'Masculino' }, { label: 'Femenino', value: 'Femenino' }]}
            onChange={(e) => handleChange('sexo', e.value)}
            placeholder="Sexo"
            className={errores.sexo ? 'PInvalid' : ''}
          />

          <Calendar
            value={formData.fechaNacimiento}
            onChange={(e) => handleChange('fechaNacimiento', e.value)}
            placeholder="Fecha de nacimiento"
            showIcon
            dateFormat="dd/mm/yy"
            className={errores.fechaNacimiento ? 'PInvalid' : ''}
          />

          <Dropdown
            value={formData.estadoCivil}
            options={opcionesEstadoCivil}
            onChange={(e) => handleChange('estadoCivil', e.value)}
            placeholder="Estado civil"
            className={errores.estadoCivil ? 'PInvalid' : ''}
          />

          <InputText placeholder="Correo electrónico" className={errores.correoElectronico ? 'PInvalid' : ''} value={formData.correoElectronico} onChange={(e) => handleChange('correoElectronico', e.target.value)} />
          <InputText placeholder="Teléfono"           className={errores.telefono ? 'PInvalid' : ''}  value={formData.telefono}       onChange={(e) => handleChange('telefono', e.target.value)} />
          <Password  placeholder="Contraseña"          feedback={false} toggleMask value={formData.contrasena} onChange={(e) => handleChange('contrasena', e.target.value)} className={errores.contrasena ? 'PInvalid' : ''} />
          <Password  placeholder="Confirmar contraseña" feedback={false} toggleMask value={formData.confirmar}  onChange={(e) => handleChange('confirmar', e.target.value)}  className={errores.confirmar ? 'PInvalid' : ''} />

          <Button
            label={cargando ? 'Registrando…' : 'Siguiente'}
            onClick={validarYEnviar}
            className="BtnSiguiente p-button-primary"
            disabled={cargando}
          />
        </div>
      </div>
    </div>
  );
}
