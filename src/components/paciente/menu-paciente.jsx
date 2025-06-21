/**
 * Descripción: Header del paciente
 * Fecha: 17-Jun-2025
 * Programador: Elvia Medina
 */

import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import logo from '../../assets/logo.png';
import '../../styles/paciente/home-paciente.css';
import '../../styles/paciente/menu-paciente.css';

const MySwal = withReactContent(Swal);

export default function HeaderPaciente() {
  const op = useRef(null);
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    const { isConfirmed } = await MySwal.fire({
      title: '¿Cerrar sesión?',
      text: 'Tendrás que volver a iniciar sesión para entrar de nuevo.',
      icon: 'question',
      confirmButtonText: 'Sí, cerrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0a3b74',
      showCancelButton: true,
      reverseButtons: true,
    });

    if (isConfirmed) navigate('/login');
  };

  return (
    <>
      <header className="home-header">
        <div className="home-logo-container">
          <img src={logo} alt="DocNow" className="home-logo-icon" />
          <span className="home-logo-text">DocNow</span>
        </div>

        {/*navegacion de web*/}
        <nav className="home-nav">
          <a href="#servicios">Servicios</a>
          <a href="#medicos">Especialistas</a>
          <a href="#citas">Mis Citas</a>
        </nav>

        <Button  icon="pi pi-ellipsis-v" className="p-button-text kebab-menu" onClick={(e) => op.current.toggle(e)} aria-label="Abrir menú" />

        {/*botón cerrar sesión (escritorio*/}
        <button className="home-login-btn" onClick={cerrarSesion}> Cerrar sesión </button>
      </header>

      {/* menu para movil*/}
      <OverlayPanel ref={op} className="kebab-panel" dismissable>
        <a href="#servicios" onClick={() => op.current.hide()}> Servicios</a>
        <a href="#medicos" onClick={() => op.current.hide()}>Especialistas</a>
        <a href="#citas" onClick={() => op.current.hide()}> Mis Citas </a>
        <a href="#logout" className="btn-logout" onClick={async (e) => {
            e.preventDefault();
            op.current.hide();
            await cerrarSesion();
          }}>Cerrar sesión
        </a>
      </OverlayPanel>
    </>
  );
}