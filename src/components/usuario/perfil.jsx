/*
 * Descripción: Vista de perfil del usuario
 * Fecha: 12 Junio de 2025
 * Programador: Irais Reyes y Elvia Medina
 */

import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import { db } from '../../lib/firebase'; // Tu configuración de Firestore
import placeholder from '../../assets/avatar_placeholder.png';
import styles from '../../styles/usuario/Perfil.module.css';

const MySwal = withReactContent(Swal);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telRegex = /^\d{10}$/;
const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function PerfilWeb() {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [foto, setFoto] = useState(null);
  const [archivoFoto, setArchivoFoto] = useState(null);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});
  const [originalData, setOriginalData] = useState({});

  // Cargar perfil desde Firebase
  useEffect(() => {
    const cargarDatosPerfil = async () => {
      const uid = localStorage.getItem('uid');
      if (!uid) return;

      try {
        const ref = doc(db, 'usuarios', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setNombre(data.nombres || '');
          setCorreo(data.email || '');
          setTelefono(data.telefono || '');
          setPassword(data.contrasena || '');
          setFoto(data.fotoPerfil || null);
          setOriginalData({
            correo: data.email || '',
            telefono: data.telefono || '',
            password: data.contrasena || '',
          });
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
      }
    };

    cargarDatosPerfil();
  }, []);

  const handleFotoChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setArchivoFoto(archivo);
      setFoto(URL.createObjectURL(archivo)); // vista previa
    }
  };

  const activarEdicion = () => {
    setOriginalData({ correo, telefono, password });
    setModoEdicion(true);
  };

  const cancelarCambios = () => {
    setCorreo(originalData.correo);
    setTelefono(originalData.telefono);
    setPassword(originalData.password);
    setErrores({});
    setModoEdicion(false);
    setArchivoFoto(null);
  };

  const validarCampos = () => {
    const nuevosErrores = {};
    const mensajes = {};

    if (!correo.trim() || !emailRegex.test(correo)) {
      nuevosErrores.correo = true;
      mensajes.correo = 'Correo electrónico inválido';
    }

    if (!telefono.trim() || !telRegex.test(telefono)) {
      nuevosErrores.telefono = true;
      mensajes.telefono = 'Solo números, 10 dígitos';
    }

    if (password && !passRegex.test(password)) {
      nuevosErrores.password = true;
      mensajes.password = 'Mínimo 8 caracteres, una mayúscula, un número y un símbolo';
    }

    setErrores(nuevosErrores);
    return mensajes;
  };

  const guardarCambios = async () => {
    const mensajes = validarCampos();
    if (Object.keys(mensajes).length > 0) {
      await MySwal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: Object.values(mensajes)[0],
        confirmButtonColor: '#0A3B74',
      });
      return;
    }

    const confirm = await MySwal.fire({
      title: '¿Guardar cambios?',
      text: '¿Estás seguro de actualizar tu información?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#0A3B74',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
    });

    if (!confirm.isConfirmed) return;

    try {
      const uid = localStorage.getItem('uid');
      const ref = doc(db, 'usuarios', uid);
      let nuevaFotoUrl = foto;

      if (archivoFoto) {
        const storage = getStorage();
        const ruta = storageRef(storage, `usuarios/${uid}/perfil.jpg`);
        await uploadBytes(ruta, archivoFoto);
        nuevaFotoUrl = await getDownloadURL(ruta);
      }

      await updateDoc(ref, {
        email: correo,
        telefono,
        contrasena: password,
        fotoPerfil: nuevaFotoUrl,
      });

      setModoEdicion(false);
      setErrores({});
      setArchivoFoto(null);

      await MySwal.fire({
        icon: 'success',
        title: '¡Guardado!',
        text: 'Tu perfil ha sido actualizado.',
        confirmButtonColor: '#0A3B74',
      });
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      await MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar tu perfil. Inténtalo más tarde.',
        confirmButtonColor: '#0A3B74',
      });
    }
  };

  const handleCerrarSesion = () => {
    MySwal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tendrás que iniciar sesión de nuevo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0A3B74',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: 'Sesión cerrada',
          text: 'Has salido correctamente.',
          icon: 'success',
          confirmButtonColor: '#0A3B74',
        });
        // auth.signOut()
      }
    });
  };

  return (
    <div className={styles.PerfilUsuarioContainer}>
      <div className={styles.PerfiUsuarioForm}>
        <div className={styles.FotoIconoPreview}>
          <div className={styles.PreviewDeWrapper}>
            <img
              src={foto || placeholder}
              alt="Avatar"
              className={styles.imagenPerfilPreview}
            />
            {modoEdicion && (
              <>
                <input type="file" id="fileInput" hidden accept="image/*" onChange={handleFotoChange} />
                <label htmlFor="fileInput" className={styles.OverlayDeTexto}>Editar</label>
              </>
            )}
          </div>
        </div>

        <h2 className={styles.nombreDeUsuario}>{nombre}</h2>

        <div className={styles.PFluidPerfil}>
          <label className={styles.laberPerfil}>Correo electrónico</label>
          <InputText
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={!modoEdicion}
            className={`${styles.inputPerfil} ${errores.correo ? 'p-invalid' : ''}`}
          />

          <label className={styles.laberPerfil}>Contraseña</label>
          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!modoEdicion}
            toggleMask
            feedback={false}
            className={`${styles.passwordPerfil} ${errores.password ? 'p-invalid' : ''}`}
          />

          <label className={styles.laberPerfil}>Número telefónico</label>
          <InputText
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            disabled={!modoEdicion}
            className={`${styles.inputPerfil} ${errores.telefono ? 'p-invalid' : ''}`}
          />
        </div>

        <div className={styles.BotonesPerfilUsuario}>
          {modoEdicion ? (
            <>
              <Button label="Guardar" className={styles.btnGuardarCambios} onClick={guardarCambios} />
              <Button label="Cancelar" className={styles.btnCancelarEdicion} onClick={cancelarCambios} />
            </>
          ) : (
            <>
              <Button label="Editar" className={styles.btnEditarCambios} onClick={activarEdicion} />
              <Button label="Cerrar sesión" className={styles.btnCerrarPerfil} onClick={handleCerrarSesion} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
