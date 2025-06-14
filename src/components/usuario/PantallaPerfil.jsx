/**
 * Descripción: Vista de perfil del usuario
 * Fecha: 12 Junio de 2025
 * Programador: Irais Reyes
 */

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
const MySwal = withReactContent(Swal);
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import placeholder from '../../assets/avatar_placeholder.png';
import '../../styles/usuario/Perfil.css';

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
        icon: "success"
      });
    }
  });
};


  return (
    <div className="PerfilContainer">
      <div className="PerfilForm">

        <div className="FotoPreview">
            <div className="PreviewWrapper">
                <img 
                src={nuevaFoto || placeholder} 
                alt="Avatar" 
                className={`imagenPreview ${modoEdicion ? 'oscurecida' : ''}`} 
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
                    <label htmlFor="fileInput" className="OverlayTexto">
                    Editar
                    </label>

                </>
                )}
            </div>
        </div>

        <h2 className='nombreUsuario'>Nombre del usuario</h2>

        <div className="PFluid">
          <label>Correo electrónico</label>
          <InputText value={'ejemplo@gmail.com'} disabled />

          <label>Contraseña</label>
          <Password value="ejemploContraseña" disabled type="password" hideIcon="pi pi-eye" showIcon="pi pi-eye-slash" toggleMask className="custom-password"/>

          {modoEdicion && (
                <>
                    <label>Confirmar contraseña</label>
                    <Password value="ejemploContraseña"  type="password" hideIcon="pi pi-eye" showIcon="pi pi-eye-slash" disabled toggleMask className="custom-password"/>
                </>
            )}

          <label>Número telefónico</label>
          <InputText value={'6122334467'} disabled />
        </div>

        <div className="BotonesPerfil">
          {modoEdicion ? (
            <>
              <Button label="Guardar"  onClick={guardarCambios} className="btnPrincipal" />
              <Button label="Cancelar"  onClick={() => setModoEdicion(false)} className="btnCancelar" />
            </>
          ) : (
            <>
              <Button label="Editar" onClick={() => setModoEdicion(true)} className="btnPrincipal" />
              <Button label="Cerrar sesión" onClick={handleCerrarSesion} className="btnCerrar" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

