/**
 * Descripción: Header del paciente
 * Fecha: 17-Jun-2025
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
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // Ajusta si tu ruta a firebase es distinta

const MySwal = withReactContent(Swal);

export default function HeaderPaciente() {
  const op = useRef(null);
  const [nombre, setNombre] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const navigate = useNavigate();
  const [hayNotificaciones, setHayNotificaciones] = useState(false);

  // ✅ Cargar notificaciones desde el backend
  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        const res = await fetch('/api/leerNotificaciones');
        const data = await res.json();
        if (Array.isArray(data.notificaciones) && data.notificaciones.length > 0) {
          setHayNotificaciones(true);
        } else {
          setHayNotificaciones(false);
        }
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
        setHayNotificaciones(false);
      }
    };

    cargarNotificaciones();
    const intervalo = setInterval(cargarNotificaciones, 60000); // cada 1 minuto
    return () => clearInterval(intervalo);
  }, []);

  const uid = localStorage.getItem('uid');
  console.log('UID desde localStorage:', uid);

    useEffect(() => {
    const obtenerNombrePaciente = async () => {
      const uid = localStorage.getItem('uid');
      if (!uid) return;

      try {
        const docRef = doc(db, 'usuarios', uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNombre(data.nombres); 
          setFotoUrl(data.fotoPerfil);
          console.log('Datos completos del usuario:', data);
        }
      } catch (error) {
        console.error('Error al obtener el nombre del paciente:', error);
      }
    };

    obtenerNombrePaciente();
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

  const handleLogoClick = () => {
  window.location.href = '/home-paciente';
};


  return (
    <header className="home-header">
      {/* Logo */}
     <Link to="/home-paciente" className="home-logo-container" onClick={handleLogoClick}>
        <img src={logo} alt="DocNow" className="home-logo-icon" />
        <span className="home-logo-text">DocNow</span>
      </Link>

      {/* Navegación visible solo en desktop */}
      <nav className="home-nav">
        <a
          href="#servicios-todos"
          onClick={(e) => {
            e.preventDefault();
            window.location.hash = '#servicios-todos';
          }}
        >
          Servicios
        </a>
        <a href="#medicos">Especialistas</a>
        <a href="#citas">Mis Citas</a>
      </nav>

      {/* Acciones: Notificación + Menú */}
      <div className="desktop-actions">
        <div className="notification-icon">
          <i className="pi pi-bell"></i>
          {hayNotificaciones && <span className="notification-dot"></span>}
        </div>

        <div className="user-menu" onClick={(e) => op.current.toggle(e)}>
           <div
            className="user-avatar"
            style={{
              backgroundImage: `url(${fotoUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '50%',
            }}
          ></div>
          <span className="user-name"> {nombre ? `Hola, ${nombre}` : 'Cargando...'} </span>
        </div>

        {/* Botón móvil tipo kebab */}
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
        <a href="#logout" className="btn-logout" onClick={async (e) => {
          e.preventDefault();
          op.current.hide();
          await cerrarSesion();
        }}>
          <i className="pi pi-sign-out" /> Cerrar sesión
        </a>
      </OverlayPanel>
    </header>
  );
}
