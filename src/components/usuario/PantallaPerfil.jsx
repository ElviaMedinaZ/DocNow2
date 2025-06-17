/**
 * Descripción: Vista de perfil del usuario
 * Fecha: 12 Junio de 2025
 * Programador: Irais Reyes
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

export default function PerfilWeb({ auth, db, subirImagenAImgBB }) {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [nuevaFoto, setNuevaFoto] = useState(null);

  const handleFotoChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setNuevaFoto(URL.createObjectURL(archivo));
    }
  };

  const guardarCambios = async () => {
    if (!nuevaFoto.startsWith('blob')) {
      alert('Selecciona una nueva imagen primero.');
      return;
    }

    if (!auth.currentUser) return alert('Usuario no autenticado.');

    const url = await subirImagenAImgBB(nuevaFoto);
    if (!url) return alert('No se pudo subir la imagen.');

    await db.collection('usuarios').doc(auth.currentUser.uid).update({ fotoUrl: url });

    alert('Foto de perfil actualizada.');
    setModoEdicion(false);
  };

  const handleCerrarSesion = () => {
    MySwal.fire({
      title: "¿Estás seguro?",
      text: "¡Tendrás que iniciar sesión nuevamente!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        MySwal.fire({
          title: "Sesión cerrada",
          text: "Has salido correctamente.",
          icon: "success",
          confirmButtonColor: "#0A3B74",
        });
      }
    });
  };

  return (
    <div className={styles.PerfilUsuarioContainer}>
      <div className={styles.PerfiUsuarioForm}>

        <div className={styles.FotoIconoPreview}>
          <div className={styles.PreviewDeWrapper}>
            <img 
              src={nuevaFoto || placeholder} 
              alt="Avatar" 
              className={`${styles.imagenPerfilPreview} ${modoEdicion ? styles.oscurecida : ''}`} 
            />

            {modoEdicion && (
              <>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFotoChange} 
                  hidden 
                  id="fileInput" 
                />
                <label htmlFor="fileInput" className={styles.OverlayDeTexto}>
                  Editar
                </label>
              </>
            )}
          </div>
        </div>

        <h2 className={styles.nombreDeUsuario}>Nombre del usuario</h2>

        <div className={styles.PFluidPerfil}>
          <label className={styles.laberPerfil}>Correo electrónico</label>
          <InputText className={styles.inputPerfil} value={'ejemplo@gmail.com'} disabled />

          <label className={styles.laberPerfil}>Contraseña</label>
          <Password 
            value="ejemploContraseña" 
            disabled 
            type="password" 
            hideIcon="pi pi-eye" 
            showIcon="pi pi-eye-slash" 
            toggleMask 
            className={styles.passwordPerfil} 
          />

          {modoEdicion && (
            <>
              <label className={styles.laberPerfil}>Confirmar contraseña</label>
              <Password 
                value="ejemploContraseña" 
                type="password" 
                hideIcon="pi pi-eye" 
                showIcon="pi pi-eye-slash" 
                disabled 
                toggleMask 
                className={styles.passwordPerfil} 
              />
            </>
          )}

          <label className={styles.laberPerfil}>Número telefónico</label>
          <InputText className={styles.inputPerfil} value={'6122334467'} disabled />
        </div>

        <div className={styles.BotonesPerfilUsuario}>
          {modoEdicion ? (
            <>
              <Button label="Guardar" onClick={guardarCambios} className={styles.btnGuardarCambios} />
              <Button label="Cancelar" onClick={() => setModoEdicion(false)} className={styles.btnCancelarEdicion} />
            </>
          ) : (
            <>
              <Button label="Editar" onClick={() => setModoEdicion(true)} className={styles.btnEditarCambios} />
              <Button label="Cerrar sesión" onClick={handleCerrarSesion} className={styles.btnCerrarPerfil} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
