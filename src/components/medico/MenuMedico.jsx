/**
 * Descripción: Header del Medico
 * Fecha: 20-Jun-2025
 * Programador: Irais Reyes
 */

import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiUser } from "react-icons/fi";
import { Link } from 'react-router-dom';
import withReactContent from 'sweetalert2-react-content';
import logo from '../../assets/logo.png';

import styles from '../../styles/medico/MenuMedico.module.css'; 

const MySwal = withReactContent(Swal);

export default function HeaderMedico() {
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
    <header className={styles.headerMedico}>
      {/* Logo */}
      <div className={styles.logoContainerMedico}>
        <img src={logo} alt="DocNow" className={styles.logoIconMedico} />
        <span className={styles.logoTextMedico}>DocNow</span>
      </div>

      {/* Info del médico y menú */}
      <div className={styles.medicoActions}>
        <div className={styles.userMenu} onClick={(e) => op.current.toggle(e)}>
            <div className="notification-icon">
              <i className="pi pi-bell"></i>
              <span className="notification-dot"></span>
            </div>
           
           <img
              src={'https://imgs.search.brave.com/pWVnf_ZtV9pOcO9Qb2IBtDEjp4W7hg6y7poljyHohQo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90by1ncmF0aXMv/ZG9jdG9yYS1qb3Zl/bi1jb21wbGFjaWRh/LXZpc3RpZW5kby1i/YXRhLW1lZGljYS1l/c3RldG9zY29waW8t/YWxyZWRlZG9yLWN1/ZWxsby1waWUtcG9z/dHVyYS1jZXJyYWRh/XzQwOTgyNy0yNTQu/anBnP3NlbXQ9YWlz/X2h5YnJpZCZ3PTc0/MA'}
              alt="Foto de la doctora"
              className={styles.userAvatar}
            />
          <div className={styles.userInfo}>
            <span className={styles.userName}>Dra. María Gonzalez</span>
            <span className={styles.userEspecialidad}>Cardiología</span>
          </div>
        </div>

        {/* Botón kebab (móvil) */}
        <Button
          icon="pi pi-ellipsis-v"
          className={`p-button-text ${styles.kebabMenuMedico}`}
          onClick={(e) => op.current.toggle(e)}
          aria-label="Abrir menú"
        />
      </div>

      {/* Menú desplegable */}
      <OverlayPanel ref={op} className={styles.kebabPanelMedico} dismissable>
      <Link to="/perfil" onClick={() => op.current.hide()} className={styles.kebabLinkMedico}>
        <i /><FiUser /> Perfil
      </Link>
        <a
          href="#logout"
          onClick={async (e) => {
            e.preventDefault();
            op.current.hide();
            await cerrarSesion();
          }}
          className={`${styles.kebabLinkMedico} ${styles.logoutLinkMedico}`}
        >
          <i className="pi pi-sign-out" /> Cerrar sesión
        </a>
      </OverlayPanel>
    </header>
  );
}