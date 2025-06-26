/*
 * Descripción: Creacion de registro medico
 * Fecha: 21 Junio de 2025
 * Programador: Elvia Medina
 */

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

/* React*/
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

/* firebase */
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

/*style */
import placeholder from '../../assets/avatar_placeholder.png';
import logo from '../../assets/logo.png';
import '../../styles/usuario/Registro.css';

import { useEffect } from 'react';
import { obtenerEspecialidades } from '../../utils/firebaseEspecialidades'; // ruta correcta
import { actualizarDoctor } from '../../utils/firebaseDoctores';



const MySwal = withReactContent(Swal);
const HOY = new Date();
const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const cedulaRegex = /^\d{8}$/;
const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

/* imagen */
const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload  = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
  });

const subirAImgbb = async (base64) => {
  const body = new FormData();
  body.append('key', imgbbApiKey);
  body.append('image', base64);

  try {
    const res  = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body });
    const data = await res.json();
    return data.success ? data.data.url : null;
  } catch (err) {
    console.error('Error subiendo imagen:', err);
    return null;
  }
};

export default function RegistroWeb({ datosIniciales, modo = 'crear', onSave, onClose }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombres: '',
    apellidoP: '',
    apellidoM: '',
    cedulaProfesional: '',
    especialidades: '',
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

  const [especialidades, setEspecialidades] = useState([]);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [errores, setErrores] = useState({});
  const [mensajes, setMensajes] = useState({});
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (modo === 'editar' && datosIniciales) {
      setFormData(prev => ({
        ...prev,
        nombres: datosIniciales.nombres || '',
        apellidoP: datosIniciales.apellidoP || '',
        apellidoM: datosIniciales.apellidoM || '',
        cedulaProfesional: datosIniciales.cedulaProfesional || '',
        especialidades: datosIniciales.especialidad || '',
        sexo: datosIniciales.sexo || '',
        fechaNacimiento: datosIniciales.fechaNacimiento ? new Date(datosIniciales.fechaNacimiento) : null,
        estadoCivil: datosIniciales.estadoCivil || '',
        correoElectronico: datosIniciales.email || '',
        telefono: datosIniciales.telefono || '',
        contrasena: '',
        confirmar: '',
        rol: datosIniciales.rol || 'Doctor',
        turnoDia: datosIniciales.turnoDia || 'lunes a viernes',
        turnoHora: datosIniciales.turnoHora || 'matutino'
      }));
      if (datosIniciales.fotoPerfil) setFotoPerfil(datosIniciales.fotoPerfil);
    }
  }, [datosIniciales, modo]);

  useEffect(() => {
    const cargarEspecialidades = async () => {
      const data = await obtenerEspecialidades();
      setEspecialidades(data);
    };
    cargarEspecialidades();
  }, []);

  const opcionesEstadoCivil = [
    { label: 'Soltero/a', value: 'Soltero' },
    { label: 'Casado/a', value: 'Casado' },
    { label: 'Divorciado/a', value: 'Divorciado' },
    { label: 'Viudo/a', value: 'Viudo' },
  ];

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores(prev => ({ ...prev, [campo]: false }));
      setMensajes(prev => ({ ...prev, [campo]: '' }));
    }
  };

  const handleFotoChange = e => {
    const file = e.target.files[0];
    if (file) setFotoPerfil(URL.createObjectURL(file));
  };

  const calcularEdad = fecha => fecha ? Math.floor((Date.now() - fecha) / 31557600000) : 0;

  const validarYEnviar = async () => {

    const nuevosErrores = {};
    const nuevosMensajes = {};

    Object.entries(formData).forEach(([k, v]) => {
        // En modo editar, ignorar validación de contraseñas
        if (modo === 'editar' && (k === 'contrasena' || k === 'confirmar')) {
          return;
        }

        if (!v) {
          nuevosErrores[k] = true;
          nuevosMensajes[k] = 'Este campo es obligatorio';
        }
      });

    if (!fotoPerfil) {
      nuevosErrores.fotoPerfil = true;
      nuevosMensajes.fotoPerfil = 'La foto es obligatoria';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telRegex = /^\d{10}$/;
    const cedulaRegex = /^\d{8}$/;

    if (formData.correoElectronico && !emailRegex.test(formData.correoElectronico))
      nuevosMensajes.correoElectronico = 'Correo inválido';

    if (formData.telefono && !telRegex.test(formData.telefono))
      nuevosMensajes.telefono = 'Teléfono inválido';

    if (formData.cedulaProfesional && !cedulaRegex.test(formData.cedulaProfesional))
      nuevosMensajes.cedulaProfesional = 'Cédula inválida';

    if (modo === 'crear') {
      if (!passRegex.test(formData.contrasena))
        nuevosMensajes.contrasena = 'Contraseña débil';
      if (formData.contrasena !== formData.confirmar)
        nuevosMensajes.confirmar = 'No coincide';
    }

    console.log("Datos validados:", formData);


    setErrores(nuevosErrores);
    setMensajes(nuevosMensajes);

    if (Object.keys(nuevosMensajes).length > 0) {
      await Swal.fire('Error', Object.values(nuevosMensajes)[0], 'error');
      return;
    }
   
    setCargando(true);
    try {

   if (modo === 'editar') {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Deseas guardar los cambios realizados?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0A3B74',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, guardar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) {
    setCargando(false);
    return;
  }

  const camposAActualizar = {
    nombres: formData.nombres,
    apellidoP: formData.apellidoP,
    apellidoM: formData.apellidoM,
    cedulaProfesional: formData.cedulaProfesional,
    especialidad: formData.especialidades,
    sexo: formData.sexo,
    fechaNacimiento: formData.fechaNacimiento?.toISOString() || null,
    estadoCivil: formData.estadoCivil,
    email: formData.correoElectronico,
    telefono: formData.telefono,
    turnoDia: formData.turnoDia,
    turnoHora: formData.turnoHora,
  };

  const imgFile = document.querySelector('input[type="file"]')?.files[0];
  if (imgFile) {
    const base64 = await fileToBase64(imgFile);
    const fotoURL = await subirAImgbb(base64);
    if (fotoURL) camposAActualizar.fotoPerfil = fotoURL;
  }

  await actualizarDoctor(datosIniciales.id, camposAActualizar);

  await Swal.fire('¡Actualizado!', 'Los datos fueron guardados correctamente.', 'success');
  onSave({ ...datosIniciales, ...camposAActualizar }, 'editar');
  onClose();
  return;
}
else {

      const imgFile = document.querySelector('input[type="file"]')?.files[0];
      const base64 = await fileToBase64(imgFile);
      const fotoURL = await subirAImgbb(base64);
      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.correoElectronico,
        formData.contrasena
      );

      await setDoc(doc(db, 'usuarios', cred.user.uid), {
        ...formData,
        fotoPerfil: fotoURL,
        fechaNacimiento: formData.fechaNacimiento?.toISOString() || null,
        creadoEn: new Date().toISOString(),
      });

      await Swal.fire('¡Registro exitoso!', 'Cuenta creada correctamente.', 'success');
      navigate('/login', { replace: true });
      
    }

    } catch (e) {
      console.error(e);
      Swal.fire('Error', e.message || 'Error al registrar.', 'error');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="RegistroContainer">
      {cargando && (
        <div className="loader-overlay">
          <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
      )}

      <div className="RegistroForm">
        <img src={logo} alt="Logo" className="Logo" />
        <h2 className="Titulo">{modo === 'editar' ? 'Editar Doctor' : 'Registro'}</h2>
        <p className="Subtitulo">
          Llena los campos tal como aparecen en tus documentos oficiales.
        </p>

        {/* FOTO */}
        <div className="FotoPreview">
          <div className={`FotoWrapper ${errores.fotoPerfil ? 'PInvalid' : ''}`}>
            <img src={fotoPerfil || placeholder} alt="Avatar" className="PreviewImg" />
          </div>
          <label className="FileLabel">
            Cambiar foto
            <input type="file" accept="image/*" onChange={handleFotoChange} hidden />
          </label>
        </div>

        {/* FORMULARIO */}
        <div className="PFluid">
          <InputText placeholder="Nombre(s)" value={formData.nombres} onChange={(e) => handleChange('nombres', e.target.value)} />
          <InputText placeholder="Apellido paterno" value={formData.apellidoP} onChange={(e) => handleChange('apellidoP', e.target.value)} />
          <InputText placeholder="Apellido materno" value={formData.apellidoM} onChange={(e) => handleChange('apellidoM', e.target.value)} />
          <InputText placeholder="Cédula profesional" value={formData.cedulaProfesional} onChange={(e) => handleChange('cedulaProfesional', e.target.value)} />
          <Dropdown value={formData.especialidades} options={especialidades} onChange={(e) => handleChange('especialidades', e.value)} placeholder="Especialidades" />
          <Dropdown value={formData.sexo} options={[{ label: 'Masculino', value: 'Masculino' }, { label: 'Femenino', value: 'Femenino' }]} onChange={(e) => handleChange('sexo', e.value)} placeholder="Sexo" />
          <Calendar value={formData.fechaNacimiento} onChange={(e) => handleChange('fechaNacimiento', e.value)} placeholder="Fecha de nacimiento" showIcon dateFormat="dd/mm/yy" />
          <Dropdown value={formData.estadoCivil} options={opcionesEstadoCivil} onChange={(e) => handleChange('estadoCivil', e.value)} placeholder="Estado civil" />
          <InputText
            placeholder="Correo electrónico"
            value={formData.correoElectronico}
            onChange={(e) => handleChange('correoElectronico', e.target.value)}
            disabled={modo === 'editar'}
          />

          <InputText placeholder="Teléfono" value={formData.telefono} onChange={(e) => handleChange('telefono', e.target.value)} />

          {/* CONTRASEÑA */}
          {modo === 'editar' ? (
            <div className="password-masked">
              <InputText value="*************" disabled />
            </div>
          ) : (
            <>
              <Password placeholder="Contraseña" feedback={false} toggleMask value={formData.contrasena} onChange={(e) => handleChange('contrasena', e.target.value)} />
              <Password placeholder="Confirmar contraseña" feedback={false} toggleMask value={formData.confirmar} onChange={(e) => handleChange('confirmar', e.target.value)} />
            </>
          )}

          {/* BOTÓN */}
         <Button
            label={modo === 'editar' ? 'Guardar cambios' : 'Siguiente'}
            onClick={validarYEnviar}
            className="BtnSiguiente p-button-primary"
          />

        </div>
      </div>
    </div>
  );
}