/**
 * Descripción: Vista de presentacion 
 * de la pagina DocNow
 * Fecha: 16 Junio de 2025
 * Programador: Irais Reyes
 */

import logo from '../../assets/logo.png';
import doctoresImg from '../../assets/Iconos_Landing/doctores.png';
import styles from '../../styles/usuario/Landing.module.css';

export default function PerfilWeb() {
  return (
    <div className={styles.containerLanding}>
      <header className={styles.headerLanding}>
        <div className={styles.leftSection}>
          <img src={logo} alt="Logo" className={styles.logoLanding} />
          <h1 className={styles.tituloPrincipal}>DocNow</h1>
        </div>

        <div className={styles.rightSection}>
          <nav className={styles.contenedorMenu}>
            <a className={styles.menuHeader}>Inicio</a>
            <a className={styles.menuHeader}>Servicios</a>
            <a className={styles.menuHeader}>Opiniones</a>
            <a className={styles.menuHeader}>Contacto</a>
          </nav>

          <button className={styles.btnInicio}>Iniciar sesión</button>
        </div>
      </header>
      <section className={styles.section1}>
            <div className={styles.textoContainer}>
                <h1 className={styles.textoPrincipal}>
                Salud para todos<br />en un solo lugar
                </h1>
                <p className={styles.textoDescriptivo}>
                Accede a una red confiable de profesionales de<br />
                la salud, sin complicaciones. Dedicado a brindar<br />
                atención médica compasiva y de alta calidad.
                </p>
                <button className={styles.btnRegistro}>Regístrate</button>
            </div>

            <img src={doctoresImg} alt="Doctores" className={styles.imgLanding} />
        </section>
    </div>
  );
}

