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
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

import placeholder from '../../assets/avatar_placeholder.png';
import logo from '../../assets/logo.png';
import '../../styles/usuario/Registro.css';

/* ---------- configuración ---------- */
const MySwal = withReactContent(Swal);
const TODAY = new Date();
const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

/* ---------- utilidades de imagen ---------- */
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

/* ---------- utilidades CURP (reglas RENAPO) ---------- */
const PARTICLES = [
  'DA','DAS','DE','DEL','DI','DIE','DD','EL','LA','LAS','LE','LES','LO','LOS',
  'MAC','MC','VAN','VON','Y'
];
const COMMON_NAMES = ['JOSE','J','JO','MARIA','MA','MA.'];
const OFFENSIVE = new Set([
  'BACA','BAKA','BUEI','BUEY','CACA','CAGA','CAGO','CAKA','CAKO','COGE','COGI',
  'COJA','COJE','COJI','COJO','CULO','FETO','GUEI','GUEY','JOTO','KACA','KACO',
  'KAGA','KAGO','KOJO','KUL0','MAME','MAMO','MEAR','MEAS','MEON','MION','MOCO',
  'MULA','PEDA','PEDO','PENE','PUTA','PUTO','QULO','RATA','RUIN'
]);

const removeDiacritics = (str) =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const stripParticles = (surname) =>
  removeDiacritics(surname.trim().toUpperCase())
    .split(/\s+/)
    .filter((w) => !PARTICLES.includes(w))
    .join('');

const firstInternalVowel = (word) => {
  const m = word.slice(1).match(/[AEIOU]/);
  return m ? m[0] : 'X';
};

const sanitizeOffensive = (prefix) =>
  OFFENSIVE.has(prefix) ? prefix[0] + 'X' + prefix.slice(2) : prefix;

const buildCurpPrefix = (nombres, apP, apM = '') => {
  const apPclean = stripParticles(apP);
  const apMclean = stripParticles(apM);

  const l1 = apPclean[0] === 'Ñ' ? 'X' : (apPclean[0] || 'X');
  const l2 = firstInternalVowel(apPclean);
  const l3 = apMclean ? (apMclean[0] === 'Ñ' ? 'X' : apMclean[0]) : 'X';

  const nombresArr = removeDiacritics(nombres.trim().toUpperCase()).split(/\s+/);
  let nombreRef = nombresArr[0];
  if (COMMON_NAMES.includes(nombreRef) && nombresArr.length > 1) {
    nombreRef = nombresArr[1];
  }
  const l4 = nombreRef[0] || 'X';

  return sanitizeOffensive(`${l1}${l2}${l3}${l4}`);
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

  /* ---------- handlers ---------- */
  const handleChange = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: false }));
      setMensajes((prev) => ({ ...prev, [campo]: '' }));
    }
  };

  const handleFotoChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) setFotoPerfil(URL.createObjectURL(archivo));
  };

  const calcularEdad = (fecha) => (fecha ? Math.floor((TODAY - fecha) / 31557600000) : 0);

  /* ---------- validación y envío ---------- */
  const validarYEnviar = async () => {
    const nuevosErrores = {};
    const nuevosMensajes = {};

    /* ——— campos requeridos ——— */
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

    /* ——— validaciones específicas ——— */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telRegex = /^\d{10}$/;
    const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}\d{2}$/i;

    if (formData.correoElectronico && !emailRegex.test(formData.correoElectronico)) {
      nuevosErrores.correoElectronico = true;
      nuevosMensajes.correoElectronico = 'Correo electrónico inválido';
    }

    if (formData.telefono && !telRegex.test(formData.telefono)) {
      nuevosErrores.telefono = true;
      nuevosMensajes.telefono = 'Solo números, 10 dígitos';
    }

    if (formData.curp && !curpRegex.test(formData.curp)) {
      nuevosErrores.curp = true;
      nuevosMensajes.curp = 'CURP no válido';
    }

    if (formData.contrasena && !passRegex.test(formData.contrasena)) {
      nuevosErrores.contrasena = true;
      nuevosMensajes.contrasena = 'Mínimo 8 caracteres, una mayúscula, un número y un símbolo';
    }

    if (formData.contrasena !== formData.confirmar) {
      nuevosErrores.confirmar = true;
      nuevosMensajes.confirmar = 'Las contraseñas no coinciden';
    }

    if (formData.fechaNacimiento) {
      const edad = calcularEdad(formData.fechaNacimiento);
      if (formData.fechaNacimiento > TODAY) {
        nuevosErrores.fechaNacimiento = true;
        nuevosMensajes.fechaNacimiento = 'La fecha no puede ser futura';
      } else if (edad > 130) {
        nuevosErrores.fechaNacimiento = true;
        nuevosMensajes.fechaNacimiento = 'Fecha de nacimiento inválida';
      }
    }

    /* ——— validación de coherencia CURP ——— */
    if (!nuevosErrores.curp && formData.curp) {
      const curpUpper = formData.curp.trim().toUpperCase();
      const prefijoEsperado = buildCurpPrefix(
        formData.nombres,
        formData.apellidoP,
        formData.apellidoM
      );

      if (curpUpper.slice(0, 4) !== prefijoEsperado) {
        nuevosErrores.curp = true;
        nuevosMensajes.curp = 'CURP no concuerda con nombres/apellidos';
      }

      if (formData.fechaNacimiento) {
        const y = String(formData.fechaNacimiento.getFullYear()).slice(-2);
        const m = String(formData.fechaNacimiento.getMonth() + 1).padStart(2, '0');
        const d = String(formData.fechaNacimiento.getDate()).padStart(2, '0');
        const fechaEsperada = `${y}${m}${d}`;

        if (formData.curp && formData.sexo) {
        const curpSexo = formData.curp.trim().toUpperCase()[10]; // posición 11
        const esperado = formData.sexo === 'Masculino' ? 'H' : 'M';
        if (curpSexo !== esperado) {
          nuevosErrores.curp = true;
          nuevosMensajes.curp = 'CURP no concuerda con el sexo seleccionado';
        }
      }

      const entidadCurp = curpUpper.slice(11, 13);
      const clavesValidas = [
        'AS','BC','BS','CC','CL','CM','CS','CH','DF','DG','GT','GR','HG','JC','MC','MN','MS','NT',
        'NL','OC','PL','QT','QR','SP','SL','SR','TC','TS','TL','VZ','YN','ZS','NE'
      ];

      if (!clavesValidas.includes(entidadCurp)) {
        nuevosErrores.curp = true;
        nuevosMensajes.curp = 'La entidad federativa en el CURP no es válida';
      }


        if (curpUpper.slice(4, 10) !== fechaEsperada) {
          nuevosErrores.curp = true;
          nuevosMensajes.curp = 'CURP no concuerda con la fecha de nacimiento';
        }
      }
    }

    /* ——— duplicidad de CURP en Firestore ——— */
    if (!nuevosErrores.curp) {
      const q = query(collection(db, 'usuarios'), where('curp', '==', formData.curp.trim().toUpperCase()));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        nuevosErrores.curp = true;
        nuevosMensajes.curp = 'Este CURP ya está registrado';
      }
    }

    /* ——— salida de validaciones ——— */
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

    /* ——— registro en Firebase ——— */
    setCargando(true);
    try {
      const file = document.querySelector('input[type="file"]')?.files[0];
      const base64 = await fileToBase64(file);
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
        curp: formData.curp.trim().toUpperCase(),
        fotoPerfil: fotoURL,
        fechaNacimiento: formData.fechaNacimiento?.toISOString() || null,
        creadoEn: new Date().toISOString(),
      });

      await MySwal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'TTu cuenta fue creada correctamente. Serás dirigido al inicio de sesión.',
        confirmButtonColor: '#0A3B74',
      });

      navigate('/login', { replace: true });
    } catch (err) {
      let mensajeError = 'Ocurrió un error inesperado. Intenta nuevamente.';

      if (err.code === 'auth/email-already-in-use') {
        mensajeError = 'El correo ya está registrado. Te llevaremos al inicio de sesión.';
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
        <p className="Subtitulo">Llena los campos tal como aparecen en tus documentos oficiales.</p>

        {/* --- foto de perfil --- */}
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

        {/* --- formulario --- */}
        <div className="PFluid">
          <InputText
            placeholder="Nombre(s)"
            className={errores.nombres ? 'PInvalid' : ''}
            value={formData.nombres}
            onChange={(e) => handleChange('nombres', e.target.value)}
          />

          <InputText
            placeholder="Apellido paterno"
            className={errores.apellidoP ? 'PInvalid' : ''}
            value={formData.apellidoP}
            onChange={(e) => handleChange('apellidoP', e.target.value)}
          />

          <InputText
            placeholder="Apellido materno"
            className={errores.apellidoM ? 'PInvalid' : ''}
            value={formData.apellidoM}
            onChange={(e) => handleChange('apellidoM', e.target.value)}
          />

          <InputText
            placeholder="CURP"
            className={errores.curp ? 'PInvalid' : ''}
            value={formData.curp}
            onChange={(e) => handleChange('curp', e.target.value)}
          />

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

          <InputText
            placeholder="Correo electrónico"
            className={errores.correoElectronico ? 'PInvalid' : ''}
            value={formData.correoElectronico}
            onChange={(e) => handleChange('correoElectronico', e.target.value)}
          />

          <InputText
            placeholder="Teléfono"
            className={errores.telefono ? 'PInvalid' : ''}
            value={formData.telefono}
            onChange={(e) => handleChange('telefono', e.target.value)}
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
