/**
 * Descripción: Header del paciente con bandeja de notificaciones
 * Fecha: 26-Jun-2025
 * Programador: Elvia Medina
 */

import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import logo from '../../assets/logo.png';
import '../../styles/paciente/menu-paciente.css';

const MySwal = withReactContent(Swal);

export default function HeaderPaciente() {
  const op = useRef(null);
  const notiRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [hayNotificaciones, setHayNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        const res = await fetch('/api/leerNotificaciones');
        const data = await res.json();
        if (Array.isArray(data.notificaciones)) {
          setNotificaciones(data.notificaciones);
          setHayNotificaciones(data.notificaciones.length > 0);
        }
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
        setNotificaciones([]);
        setHayNotificaciones(false);
      }
    };

    cargarNotificaciones();
    const intervalo = setInterval(cargarNotificaciones, 60000);
    return () => clearInterval(intervalo);
  }, []);

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

  const handleLogoClick = (e) => {
    if (location.pathname === '/home-paciente') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="home-header">
      {/* Logo */}
      <Link to="/home-paciente" className="home-logo-container" onClick={handleLogoClick}>
        <img src={logo} alt="DocNow" className="home-logo-icon" />
        <span className="home-logo-text">DocNow</span>
      </Link>

      {/* Navegación */}
      <nav className="home-nav">
        <a href="#servicios">Servicios</a>
        <a href="#medicos">Especialistas</a>
        <a href="#citas">Mis Citas</a>
      </nav>

      {/* Acciones: Notificación + Menú */}
      <div className="desktop-actions">
        <div className="notification-icon" onClick={(e) => notiRef.current.toggle(e)}>
          <i className="pi pi-bell"></i>
          {hayNotificaciones && <span className="notification-dot"></span>}
        </div>

        <OverlayPanel ref={notiRef} className="noti-dropdown" dismissable>
          {notificaciones.length > 0 ? (
            notificaciones.map((n, i) => (
              <div key={i} className="noti-item">
                <div className="noti-title">📅 {n.titulo || 'Cita próxima'}</div>
                <div className="noti-text">
                  🕒 {new Date(n.fecha).toLocaleDateString('es-MX')} a las {n.hora} <br />
                  👨‍⚕️ {n.doctor}
                </div>
              </div>
            ))
          ) : (
            <div className="noti-empty">Sin notificaciones por ahora.</div>
          )}
        </OverlayPanel>

        <div className="user-menu" onClick={(e) => op.current.toggle(e)}>
          <div className="user-avatar"></div>
          <span className="user-name">María González</span>
        </div>

        <Button
          icon="pi pi-ellipsis-v"
          className="p-button-text kebab-menu"
          onClick={(e) => op.current.toggle(e)}
          aria-label="Abrir menú"
        />
      </div>

      {/* Menú desplegable */}
      <OverlayPanel ref={op} className="user-dropdown" dismissable>
        <div className="mobile-only">
          <a href="#servicios"><i className="pi pi-briefcase" /> Servicios</a>
          <a href="#medicos"><i className="pi pi-users" /> Especialistas</a>
          <a href="#citas"><i className="pi pi-calendar" /> Mis Citas</a>
          <hr />
        </div>

        <Link to="/perfil" onClick={() => op.current.hide()}>
          <i className="pi pi-user" /> Perfil
        </Link>

        <a href="#configuracion"><i className="pi pi-cog" /> Configuración</a>
        <a
          href="#logout"
          className="btn-logout"
          onClick={async (e) => {
            e.preventDefault();
            op.current.hide();
            await cerrarSesion();
          }}
        >
          <i className="pi pi-sign-out" /> Cerrar sesión
        </a>
      </OverlayPanel>
    </header>
  );
}
