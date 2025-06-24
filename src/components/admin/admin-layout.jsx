import { useEffect, useState } from 'react';
import {
  FaBars, FaCalendarAlt,
  FaSignOutAlt, FaStethoscope,
  FaThLarge, FaTimes, FaUser, FaUserCircle, FaUserMd
} from 'react-icons/fa';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import styles from '../../styles/admin/admin-layout.module.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => window.innerWidth <= 768 && setSidebarOpen(false);

  useEffect(() => {
    closeSidebar();
  }, [location]);

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
            <FaUserCircle /> Perfil
          </button>
          <button className={`${styles.accountBtn} ${styles.logoutBtn}`}>
            <FaSignOutAlt /> Cerrar Sesión
          </button>
          <div className={styles.userFooter}>
            <div className={styles.avatarDot}></div>
            <span>Admin Usuario</span>
          </div>
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
