/**
 * Descripción: Header del Medico
 * Fecha: 20-Jun-2025
 * Programador: Irais Reyes
 */

import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import logo from '../../assets/logo.png';
import 'primeicons/primeicons.css';
// import  '../../styles/medico/MenuMedico.module.css';
import styles from '../../styles/medico/MenuMedico.module.css';
import { CiMenuKebab } from 'react-icons/ci';

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
      <header className={styles.headerMedico}>
        <div className={styles.logoContainerMedico}>
          <img src={logo} alt="DocNow" className={styles.logoIconMedico} />
          <span className={styles.logoTextMedico}>DocNow</span>
        </div>

        {/* Botón menú móvil */}
        <Button
          icon="pi pi-ellipsis-v"
          className={`p-button-text ${styles.kebabMenuMedico}`}
          onClick={(e) => op.current.toggle(e)}
          aria-label="Abrir menú"
        />

        {/* Botón escritorio */}
        <button className={styles.loginBtnMedico} onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      {/*menú móvil */}
      <OverlayPanel ref={op} className={styles.kebabPanelMedico} dismissable>
        <a
          href="#logout"
          onClick={async (e) => {
            e.preventDefault();
            op.current.hide();
            await cerrarSesion();
          }}
          className={styles.kebabLinkMedico}
        >
          Cerrar sesión
        </a>
      </OverlayPanel>
    </>
  );
}