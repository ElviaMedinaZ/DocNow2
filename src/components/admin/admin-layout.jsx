/**
 * Descripción: Componente de diseño principal para la vista de administrador.
 * Incluye la barra lateral con navegación, barra superior y contenedor de contenido.
 * Controla la visibilidad del menú lateral de forma responsive.
 *
 * Fecha: 22 Junio de 2025
 * Programador: Elvia Medina
 */

import { useEffect, useState } from 'react';
import {
  FaBars, FaCalendarAlt,
  FaSignOutAlt, FaStethoscope,
  FaThLarge, FaTimes, FaUser, FaUserCircle, FaUserMd
} from 'react-icons/fa';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import styles from '../../styles/admin/admin-layout.module.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';



export default function AdminLayout() {
  const [nombreAdmin, setNombreAdmin] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const location = useLocation();

  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => window.innerWidth <= 768 && setSidebarOpen(false);

  
 const MySwal = withReactContent(Swal);
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

    if (isConfirmed) {
      localStorage.removeItem('uid'); // ✅ Limpia sesión local
      navigate('/login');             // ✅ Redirige sin cerrar sesión Firebase
    }
  };

  useEffect(() => {
    closeSidebar();
  }, [location]);

  useEffect(() => {
  const obtenerNombreAdmin = async () => {
    const uid = localStorage.getItem('uid');
    if (!uid) return;

    try {
      const snap = await getDoc(doc(db, 'usuarios', uid));
      if (snap.exists()) {
        const data = snap.data();
        setNombreAdmin(`${data.nombres || ''} ${data.apellidoP || ''}`);
      }
    } catch (error) {
      console.error('Error al obtener admin:', error);
    }
  };

  obtenerNombreAdmin();
}, []);

  return (
    <div className={styles.adminWrapper}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles.sidebarHead}>
          <div className={styles.branding}>
            <img src={logo} alt="DocNow logo" className={styles.logoImage} />
            <div>
              <strong>DocNow</strong>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <small className={styles.navSection}>Navegación</small>
          <NavLink end to="/dashboard-admin">
            <FaThLarge /> Dashboard
          </NavLink>
          <NavLink to="/dashboard-admin/doctores">
            <FaUserMd /> Doctores
          </NavLink>
          <NavLink to="/dashboard-admin/especialidades">
            <FaStethoscope /> Especialidades
          </NavLink>
          <NavLink to="/dashboard-admin/servicios">
            <FaUser /> Servicios
          </NavLink>
          <NavLink to="/dashboard-admin/pacientes">
            <FaUser /> Pacientes
          </NavLink>
          <NavLink to="/dashboard-admin/citas">
            <FaCalendarAlt /> Citas Agendadas
          </NavLink>
        </nav>

        <div className={styles.accountSection}>
          <small className={styles.navSection}>Mi Cuenta</small>
          <button className={styles.accountBtn}>
            <FaUserCircle /> Admin{nombreAdmin ? `: ${nombreAdmin}` : ''}
          </button>

         <button
            className={`${styles.accountBtn} ${styles.logoutBtn}`}
            onClick={cerrarSesion}
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>

        </div>
      </aside>

      {sidebarOpen && window.innerWidth <= 768 && (
        <div className={styles.overlay} onClick={closeSidebar}></div>
      )}

      {/* Main */}
      <main className={`${styles.main} ${!sidebarOpen ? styles.mainFull : ''}`}>
        <header className={styles.topbar}>
          <button className={styles.hamburger} onClick={toggleSidebar}>
            <FaBars />
          </button>
        </header>

        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
