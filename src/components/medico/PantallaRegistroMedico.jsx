/**
 * Descripción: Implementación de la vista de Registro para el médico
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

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';   


import placeholder from '../../assets/avatar_placeholder.png';
import logo from '../../assets/logo.png';
import '../../styles/usuario/Registro.css';

const MySwal = withReactContent(Swal);
const HOY = new Date();
const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const cedulaRegex = /^\d{8}$/;
const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

export default function RegistroWeb() {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidoP: '',
    apellidoM: '',
    cedulaProfesional: '',
    sexo: '',
    fechaNacimiento: null,
    estadoCivil: '',
    correoElectronico: '',
    telefono: '',
    contrasena: '',
    confirmar: '',
    rol: "Doctor",
    turnoDia: "lunes a viernes",
    turnoHora: "matutino"
  });

  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [errores, setErrores] = useState({});
  const [mensajes, setMensajes] = useState({});

  /* ------------ Utilidades para ImgBB ----------- */
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // quitamos 'data:image/...;base64,'
      reader.onerror = (err) => reject(err);
    });

  const subirAImgbb = async (base64) => {
    const body = new FormData();
    body.append('key', imgbbApiKey);
    body.append('image', base64);

    try {
      const res = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (data.success) return data.data.url;
      console.error('ImgBB error:', data);
      return null;
    } catch (e) {
      console.error('Error subiendo imagen:', e);
      return null;
    }
  };

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

  const validarYEnviar = async () => {
    const nuevosErrores = {};
    const nuevosMensajes = {};

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

    //Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.correoElectronico && !emailRegex.test(formData.correoElectronico)) {
      nuevosErrores.correoElectronico = true;
      nuevosMensajes.correoElectronico = 'Correo electrónico inválido';
    }

     //Telefono
    const telRegex = /^[0-9]{10,}$/;
    if (formData.telefono && !telRegex.test(formData.telefono)) {
      nuevosErrores.telefono = true;
      nuevosMensajes.telefono = 'Solo números, mínimo 10 dígitos';
    }

     //Cedula
    if (formData.cedulaProfesional && !cedulaRegex.test(formData.cedulaProfesional)) {
      nuevosErrores.cedulaProfesional = true;
      nuevosMensajes.cedulaProfesional = 'La cédula debe contener 8 dígitos numéricos';
    }

     //Contraseña
    if (formData.contrasena && !passRegex.test(formData.contrasena)) {
      nuevosErrores.contrasena = true;
      nuevosMensajes.contrasena =
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial';
    }

     //Conirmar Contraseña
    if (formData.contrasena !== formData.confirmar) {
      nuevosErrores.confirmar = true;
      nuevosMensajes.confirmar = 'Las contraseñas no coinciden';
    }

     //Fecha de nacimiento
    if (formData.fechaNacimiento) {
      const edad = calcularEdad(formData.fechaNacimiento);
      if (formData.fechaNacimiento > HOY) {
        nuevosErrores.fechaNacimiento = true;
        nuevosMensajes.fechaNacimiento = 'La fecha no puede ser futura';
      } else if (edad > 130) {
        nuevosErrores.fechaNacimiento = true;
        nuevosMensajes.fechaNacimiento = 'Favor de ingresar una fecha válida';
      }else if (edad < 18) {
        nuevosErrores.fechaNacimiento = true;
        nuevosMensajes.fechaNacimiento = 'Debe ser mayor de  edad';
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

 /* ------------ Proceso de registro ------------ */
    try {
      // 1) Foto → base64 → ImgBB
      const fileInput = document.querySelector('input[type="file"]');
      const file = fileInput?.files[0];
      const base64 = await fileToBase64(file);
      const fotoURL = await subirAImgbb(base64);
      if (!fotoURL) throw new Error('No se pudo subir la imagen');

      // 2) Crear usuario en Auth
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.correoElectronico,
        formData.contrasena
      );
      const uid = cred.user.uid;

      // 3) Guardar en Firestore
      await setDoc(doc(db, 'usuarios', uid), {
        ...formData,
        fotoPerfil: fotoURL,
        fechaNacimiento: formData.fechaNacimiento?.toISOString() || null,
        creadoEn: new Date().toISOString(),
      });

      // 4) Éxito
      await MySwal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta fue creada correctamente.',
        confirmButtonColor: '#0A3B74',
      });
      // Limpia el formulario o redirige si lo deseas
    } catch (e) {
      console.error('❌ Error en el registro:', e);
      MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: e.message,
        confirmButtonColor: '#0A3B74',
      });
    }
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
        </div>

        <div className="PFluid">
          <InputText placeholder="Nombre(s)" className={errores.nombres ? 'PInvalid' : ''} value={formData.nombres} onChange={(e) => handleChange('nombres', e.target.value)} />
          <InputText placeholder="Apellido paterno" className={errores.apellidoP ? 'PInvalid' : ''} value={formData.apellidoP} onChange={(e) => handleChange('apellidoP', e.target.value)} />
          <InputText placeholder="Apellido materno" className={errores.apellidoM ? 'PInvalid' : ''} value={formData.apellidoM} onChange={(e) => handleChange('apellidoM', e.target.value)} />
          <InputText placeholder="Cédula profesional" className={errores.cedulaProfesional ? 'PInvalid' : ''} value={formData.cedulaProfesional} onChange={(e) => handleChange('cedulaProfesional', e.target.value)} />
          {mensajes.cedulaProfesional && <p className="ErrorMsg">{mensajes.cedulaProfesional}</p>}

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
          {mensajes.estadoCivil && <p className="ErrorMsg">{mensajes.estadoCivil}</p>}
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
