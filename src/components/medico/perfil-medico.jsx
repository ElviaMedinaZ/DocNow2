/*
 * Descripción: Vista de perfil del medico
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const telRegex = /^\d{10}$/;
const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const catalogoServicios = [
  'Consulta', 'Toma de presión', 'Inyecciones', 'Ultrasonido', 'Electrocardiograma',
  'Curaciones', 'Papanicolaou', 'Colocación de sueros', 'Revisión oftalmológica',
  'Audiometría', 'Vacunación', 'Chequeo general', 'Extracción de puntos',
  'Pruebas COVID-19', 'Rayos X',
];

export default function PerfilMedico() {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [foto, setFoto] = useState(null);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState(['Rayos X']);

  const abrirModalServicios = async () => {
    const htmlChecks = catalogoServicios.map((svc, i) =>
      `<div style="text-align:left;margin:6px 0">
         <input type="checkbox" id="svc_${i}" ${serviciosSeleccionados.includes(svc) ? 'checked' : ''}>
         <label for="svc_${i}" style="margin-left:6px">${svc}</label>
       </div>`
    ).join('');

    const { isConfirmed } = await MySwal.fire({
      title: 'Selecciona los servicios',
      html: htmlChecks,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      preConfirm: () => {
        const nuevos = [];
        catalogoServicios.forEach((svc, i) => {
          const checkbox = document.getElementById(`svc_${i}`);
          if (checkbox && checkbox.checked) nuevos.push(svc);
        });
        return nuevos;
      },
      confirmButtonColor: '#0A3B74',
      cancelButtonColor: '#d33',
    });

    if (isConfirmed) {
      const nuevosServicios = [];
      catalogoServicios.forEach((svc, i) => {
        const checkbox = document.getElementById(`svc_${i}`);
        if (checkbox?.checked) nuevosServicios.push(svc);
      });
      setServiciosSeleccionados(nuevosServicios);
    }
  };

  const [correo, setCorreo] = useState('maria.gonzalez@hospital.com');
  const [telefono, setTelefono] = useState('5551234567');
  const [password, setPassword] = useState('Contraseña$123');
  const [descripcion, setDescripcion] = useState('10 años de experiencia.');

  const [originalData, setOriginalData] = useState({ correo, telefono, password, descripcion });
  const [errores, setErrores] = useState({});

  const handleFotoChange = (e) => {
    const archivo = e.target.files[0];
    if (archivo) setFoto(URL.createObjectURL(archivo));
  };

  const activarEdicion = () => {
    setOriginalData({ correo, telefono, password, descripcion });
    setModoEdicion(true);
  };

  const cancelarCambios = () => {
    setCorreo(originalData.correo);
    setTelefono(originalData.telefono);
    setPassword(originalData.password);
    setDescripcion(originalData.descripcion);
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

    if (serviciosSeleccionados.length === 0) {
      nuevosErrores.servicios = true;
      nuevosMensajes.servicios = 'Debes seleccionar al menos un servicio';
    }

    if (!descripcion.trim()) {
      nuevosErrores.descripcion = true;
      nuevosMensajes.descripcion = 'La descripción es obligatoria';
    }

    if (descripcion.length > 50) {
      nuevosErrores.descripcion = true;
      nuevosMensajes.descripcion = 'Máximo 50 caracteres';
    }

    setErrores(nuevosErrores);
    return nuevosMensajes;
  };

  const guardarCambios = async () => {
    const mensajes = validarCampos();

    if (Object.keys(mensajes).length > 0) {
      const mensaje = Object.values(mensajes)[0];
      await MySwal.fire({ icon: 'error', title: 'Error de validación', text: mensaje, confirmButtonColor: '#0A3B74' });
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

    await MySwal.fire({ icon: 'success', title: '¡Guardado!', text: 'Tu perfil ha sido actualizado.', confirmButtonColor: '#0A3B74' });
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
        MySwal.fire({ title: 'Sesión cerrada', text: 'Has salido correctamente.', icon: 'success', confirmButtonColor: '#0A3B74' });
      }
    });
  };

  return (
    <div className={styles.PerfilUsuarioContainer}>
      <div className={styles.PerfiUsuarioForm}>
        <div className={styles.FotoIconoPreview}>
          <div className={styles.PreviewDeWrapper}>
            <img src={foto || placeholder} alt="Avatar" className={styles.imagenPerfilPreview} />
            {modoEdicion && (
              <>
                <input type="file" id="fileInput" hidden accept="image/*" onChange={handleFotoChange} />
                <label htmlFor="fileInput" className={styles.OverlayDeTexto}>Editar</label>
              </>
            )}
          </div>
        </div>

        <h2 className={styles.nombreDeUsuario}>Dra María Gonzalez</h2>

        <div className={styles.PFluidPerfil}>
          <label className={styles.laberPerfil}>Correo electrónico</label>
          <InputText value={correo} onChange={(e) => setCorreo(e.target.value)} disabled={!modoEdicion} className={`${styles.inputPerfil} ${errores.correo ? 'p-invalid' : ''}`} />

          <label className={styles.laberPerfil}>Contraseña</label>
          <Password value={password} onChange={(e) => setPassword(e.target.value)} disabled={!modoEdicion} toggleMask feedback={false} className={`${styles.passwordPerfil} ${errores.password ? 'p-invalid' : ''}`} />

          <label className={styles.laberPerfil}>Número telefónico</label>
          <InputText value={telefono} onChange={(e) => { const valor = e.target.value; if (/^\d{0,10}$/.test(valor)) setTelefono(valor); }} disabled={!modoEdicion} className={`${styles.inputPerfil} ${errores.telefono ? 'p-invalid' : ''}`} />

          <label className={styles.laberPerfil}>Servicio</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            {serviciosSeleccionados.length > 0 ? (
              serviciosSeleccionados.map((svc, i) => (
                <span key={i} style={{ background: '#0A3B74', color: 'white', padding: '4px 10px', borderRadius: '16px', fontSize: '0.85rem' }}>{svc}</span>
              ))
            ) : (
              <span style={{ fontStyle: 'italic', color: '#999' }}>Sin servicios seleccionados</span>
            )}
          </div>

          {modoEdicion && <Button label="Editar servicios" icon="pi pi-pencil" className={styles.btnEditarCambios} onClick={abrirModalServicios} />}

          <label className={styles.laberPerfil}>Descripción</label>
          <InputText value={descripcion} onChange={(e) => { const valor = e.target.value; if (valor.length <= 50) setDescripcion(valor); }} disabled={!modoEdicion} className={`${styles.inputPerfil} ${errores.descripcion ? 'p-invalid' : ''}`} />
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
