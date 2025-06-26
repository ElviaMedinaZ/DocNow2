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

/* configuraciones */
const MySwal      = withReactContent(Swal);
const TODAY       = new Date();
const passRegex   = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const cedulaRegex = /^\d{8}$/;        // 8 dígitos
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

/*especialidades */
const ESPECIALIDADES = [
  { label: 'Algología', value: 'Algología' },
  { label: 'Alergología', value: 'Alergología' },
  { label: 'Cardiología', value: 'Cardiología' },
  { label: 'Coloproctología', value: 'Coloproctología' },
  { label: 'Dermatología', value: 'Dermatología' },
  { label: 'Endocrinología', value: 'Endocrinología' },
  { label: 'Estomatología', value: 'Estomatología' },
  { label: 'Geriatría', value: 'Geriatría' },
  { label: 'Ginecología', value: 'Ginecología' },
  { label: 'Neurología', value: 'Neurología' },
  { label: 'Neumología', value: 'Neumología' },
  { label: 'Reumatología', value: 'Reumatología' },
  { label: 'Otorrinolaringología', value: 'Otorrinolaringología' },
  { label: 'Obstetricia', value: 'Obstetricia' },
  { label: 'Oncología', value: 'Oncología' },
  { label: 'Ortopedía', value: 'Ortopedía' },
  { label: 'Psicología', value: 'Psicología' },
  { label: 'Psiquiatria', value: 'Psiquiatria' },
  { label: 'Traumatología', value: 'Traumatología' },
  { label: 'Urología', value: 'Urología' },
  
];

export default function RegistroWeb() {
  const navigate = useNavigate();

  /* estado*/
  const [formData, setFormData] = useState({
    nombres            : '',
    apellidoP          : '',
    apellidoM          : '',
    especialidad       : '',
    cedulaProfesional  : '',
    cedulaEspecialidad : '',
    sexo               : '',
    fechaNacimiento    : null,
    estadoCivil        : '',
    correoElectronico  : '',
    telefono           : '',
    contrasena         : '',
    confirmar          : '',
    rol                : 'Doctor',
  });

  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [errores, setErrores]       = useState({});
  const [mensajes, setMensajes]     = useState({});
  const [cargando, setCargando]     = useState(false);

  const opcionesEstadoCivil = [
    { label: 'Soltero/a',   value: 'Soltero'   },
    { label: 'Casado/a',    value: 'Casado'    },
    { label: 'Divorciado/a',value: 'Divorciado'},
    { label: 'Viudo/a',     value: 'Viudo'     },
  ];

  /* handlers  */
  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores(prev  => ({ ...prev,  [campo]: false }));
      setMensajes(prev => ({ ...prev, [campo]: ''   }));
    }
  };

  const handleFotoChange = e => {
    const file = e.target.files[0];
    if (file) setFotoPerfil(URL.createObjectURL(file));
  };

  const calcularEdad = fecha =>
    fecha ? Math.floor((TODAY - fecha) / 31557600000) : 0;

  /* validación y envío */
  const validarYEnviar = async () => {
    const nuevosErrores  = {};
    const nuevosMensajes = {};

    /* campos requeridos */
    Object.entries(formData).forEach(([k, v]) => {
      if (!v) {
        nuevosErrores[k]  = true;
        nuevosMensajes[k] = 'Este campo es obligatorio';
      }
    });
    if (!fotoPerfil) {
      nuevosErrores.fotoPerfil  = true;
      nuevosMensajes.fotoPerfil = 'La foto es obligatoria';
    }

    /*validaciones específicas */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telRegex   = /^\d{10}$/;

    if (formData.correoElectronico && !emailRegex.test(formData.correoElectronico)) {
      nuevosErrores.correoElectronico  = true;
      nuevosMensajes.correoElectronico = 'Correo electrónico inválido';
    }

    if (formData.telefono && !telRegex.test(formData.telefono)) {
      nuevosErrores.telefono  = true;
      nuevosMensajes.telefono = 'Solo números, 10 dígitos';
    }

    if (formData.cedulaProfesional && !cedulaRegex.test(formData.cedulaProfesional)) {
      nuevosErrores.cedulaProfesional  = true;
      nuevosMensajes.cedulaProfesional = 'Debe tener 8 dígitos numéricos';
    }

    if (formData.cedulaEspecialidad && !cedulaRegex.test(formData.cedulaEspecialidad)) {
      nuevosErrores.cedulaEspecialidad  = true;
      nuevosMensajes.cedulaEspecialidad = 'Debe tener 8 dígitos numéricos';
    }

    if (formData.contrasena && !passRegex.test(formData.contrasena)) {
      nuevosErrores.contrasena  = true;
      nuevosMensajes.contrasena = 'Mínimo 8 caracteres, una mayúscula, un número y un símbolo';
    }

    if (formData.contrasena !== formData.confirmar) {
      nuevosErrores.confirmar  = true;
      nuevosMensajes.confirmar = 'Las contraseñas no coinciden';
    }

    if (formData.fechaNacimiento) {
      const edad = calcularEdad(formData.fechaNacimiento);
      if (formData.fechaNacimiento > TODAY) {
        nuevosErrores.fechaNacimiento  = true;
        nuevosMensajes.fechaNacimiento = 'La fecha no puede ser futura';
      } else if (edad > 130) {
        nuevosErrores.fechaNacimiento  = true;
        nuevosMensajes.fechaNacimiento = 'Fecha de nacimiento inválida';
      }
    }

    /* salida de validaciones */
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

    /* registro en Firebase */
    setCargando(true);
    try {
      const imgFile = document.querySelector('input[type="file"]')?.files[0];
      const base64  = await fileToBase64(imgFile);
      const fotoURL = await subirAImgbb(base64);
      if (!fotoURL) throw new Error('No se pudo subir la imagen');

      const cred = await createUserWithEmailAndPassword(
        auth,
        formData.correoElectronico,
        formData.contrasena
      );
      const uid = cred.user.uid;

      await setDoc(doc(db, 'usuarios', uid), {
        ...formData,
        fotoPerfil      : fotoURL,
        fechaNacimiento : formData.fechaNacimiento?.toISOString() || null,
        creadoEn        : new Date().toISOString(),
      });

      await MySwal.fire({
        icon : 'success',
        title: '¡Registro exitoso!',
        text : 'Tu cuenta fue creada correctamente.',
        confirmButtonColor: '#0A3B74',
      });

      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err);
      await MySwal.fire({
        icon : 'error',
        title: 'Error',
        text : err.message || 'Ocurrió un error.',
        confirmButtonColor: '#0A3B74',
      });
    } finally {
      setCargando(false);
    }
  };

  /*render */
  return (
    <div className="RegistroContainer">
      {cargando && (
        <div className="loader-overlay">
          <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
      )}

      <div className="RegistroForm">
        <img src={logo} alt="Logo" className="Logo" />
        <h2 className="Titulo">Registro</h2>
        <p className="Subtitulo">
          Llena los campos tal como aparecen en tus documentos oficiales.
        </p>

        {/*  foto  */}
        <div className="FotoPreview">
          <div className={`FotoWrapper ${errores.fotoPerfil ? 'PInvalid' : ''}`}>
            <img
              src={fotoPerfil || placeholder}
              alt="Avatar"
              className="PreviewImg"
            />
          </div>
          <label className="FileLabel">
            Cambiar foto
            <input type="file" accept="image/*" onChange={handleFotoChange} hidden />
          </label>
          {mensajes.fotoPerfil && <p className="ErrorMsg">{mensajes.fotoPerfil}</p>}
        </div>

        {/* formulario */}
        <div className="PFluid">
          <InputText
          placeholder="Nombre(s)"
          className={errores.nombres ? 'PInvalid' : ''}
          maxLength={40}
          value={formData.nombres}
          onChange={(e) =>
            handleChange('nombres', e.target.value.replace(/[0-9]/g, ''))
          }
          onKeyPress={(e) => {
            if (/\d/.test(e.key)) {
              e.preventDefault(); // bloquea teclas numéricas
            }
          }}
        />

          <InputText
            placeholder="Apellido paterno"
            className={errores.apellidoP ? 'PInvalid' : ''}
            maxLength={40}
            value={formData.apellidoP}
            onChange={(e) =>
              handleChange('apellidoP', e.target.value.replace(/[0-9]/g, ''))
            }
            onKeyPress={(e) => {
              if (/\d/.test(e.key)) {
                e.preventDefault(); // Bloquea entrada de números
              }
            }}
          />

          <InputText
            placeholder="Apellido materno"
            maxLength={40}
            className={errores.apellidoM ? 'PInvalid' : ''}
            value={formData.apellidoM}
            onChange={(e) =>
              handleChange('apellidoM', e.target.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, ''))
            }
            onKeyPress={(e) => {
              if (!/^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]$/.test(e.key)) {
                e.preventDefault(); // Bloquea números y caracteres especiales
              }
            }}
          />

          {/* NUEVOS CAMPOS */}
          <Dropdown
            value={formData.especialidad}
            options={ESPECIALIDADES}
            onChange={(e) => handleChange('especialidad', e.value)}
            placeholder="Especialidad"
            className={errores.especialidad ? 'PInvalid' : ''}
          />

          <InputText
            placeholder="Cédula profesional (8 dígitos)"
            className={errores.cedulaProfesional ? 'PInvalid' : ''}
            value={formData.cedulaProfesional}
            maxLength={8}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, '').slice(0, 8);
              handleChange('cedulaProfesional', soloNumeros);
            }}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault(); // Bloquea letras y otros símbolos
              }
            }}
          />

          <InputText
            placeholder="Cédula de especialidad (8 dígitos)"
            className={errores.cedulaEspecialidad ? 'PInvalid' : ''}
            value={formData.cedulaEspecialidad}
            maxLength={8}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, '').slice(0, 8);
              handleChange('cedulaEspecialidad', soloNumeros);
            }}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault(); // Bloquea letras y símbolos
              }
            }}
          />
          
          <Dropdown
            value={formData.sexo}
            options={[
              { label: 'Masculino', value: 'Masculino' },
              { label: 'Femenino',  value: 'Femenino'  },
            ]}
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

          <InputText
            placeholder="Correo electrónico"
            maxLength={40}
            className={errores.correoElectronico ? 'PInvalid' : ''}
            value={formData.correoElectronico}
            onChange={(e) => handleChange('correoElectronico', e.target.value)}
          />

           <InputText
            placeholder="Teléfono"
            className={errores.telefono ? 'PInvalid' : ''}
            value={formData.telefono}
            maxLength={10}
            onChange={(e) => handleChange('telefono', e.target.value.replace(/\D/g, ''))}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />

          <Password
            placeholder="Contraseña"
            feedback={false}
            toggleMask
            value={formData.contrasena}
            onChange={(e) => handleChange('contrasena', e.target.value)}
            className={errores.contrasena ? 'PInvalid' : ''}
          />

          <Password
            placeholder="Confirmar contraseña"
            feedback={false}
            toggleMask
            value={formData.confirmar}
            onChange={(e) => handleChange('confirmar', e.target.value)}
            className={errores.confirmar ? 'PInvalid' : ''}
          />

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
