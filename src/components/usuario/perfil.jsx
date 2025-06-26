/*
 * Descripción: Vista de perfil del usuario
 * Fecha: 12 Junio de 2025
 * Programador: Irais Reyes y Elvia Medina
 */

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import placeholder from '../../assets/avatar_placeholder.png';
import styles from '../../styles/usuario/Perfil.module.css';

const MySwal = withReactContent(Swal);

// Expresiones regulares para validación
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telRegex = /^\d{10}$/;
const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function PerfilWeb() {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [foto, setFoto] = useState(null);

  // Datos del perfil (nombre fijo, no editable)
  const nombre = 'María López';
  const [correo, setCorreo] = useState('maria.lopez@gmail.com');
  const [telefono, setTelefono] = useState('5551234567');
  const [password, setPassword] = useState('Contraseña$123');

  // Datos originales para restaurar al cancelar
  const [originalData, setOriginalData] = useState({
    correo: 'maria.lopez@gmail.com',
    telefono: '5551234567',
    password: 'Contraseña$123',
  });

  const [errores, setErrores] = useState({});

  const handleFotoChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) setFoto(URL.createObjectURL(archivo));
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
  };

  const validarCampos = () => {
    const nuevosErrores = {};
    const nuevosMensajes = {};

    if (!correo.trim() || !emailRegex.test(correo)) {
      nuevosErrores.correo = true;
      nuevosMensajes.correo = 'Correo electrónico inválido';
    }

    if (!telefono.trim() || !telRegex.test(telefono)) {
      nuevosErrores.telefono = true;
      nuevosMensajes.telefono = 'Solo números, 10 dígitos';
    }

    if (password && !passRegex.test(password)) {
      nuevosErrores.password = true;
      nuevosMensajes.password = 'Mínimo 8 caracteres, una mayúscula, un número y un símbolo';
    }

    setErrores(nuevosErrores);
    return nuevosMensajes;
  };

  const guardarCambios = async () => {
    const mensajes = validarCampos();

    if (Object.keys(mensajes).length > 0) {
      const mensaje = Object.values(mensajes)[0];
      await MySwal.fire({
        icon: 'error',
        title: 'Error de validación',
        text: mensaje,
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


    setModoEdicion(false);
    setErrores({});

    await MySwal.fire({
      icon: 'success',
      title: '¡Guardado!',
      text: 'Tu perfil ha sido actualizado.',
      confirmButtonColor: '#0A3B74',
    });
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