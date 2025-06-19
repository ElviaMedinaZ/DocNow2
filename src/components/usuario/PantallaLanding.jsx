/**
 * Descripción: Vista de presentación de la página DocNow
 * Fecha: 16 junio 2025
 * Programador: Irais Reyes
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import menu from '../../assets/Iconos_Landing/MenuHamburguesa.png';
import logoBlanco from '../../assets/Iconos_Landing/logo_blanco.png';
import personaUno from '../../assets/Iconos_Landing/persona_1.jpeg';
import personaDos from '../../assets/Iconos_Landing/persona_2.jpeg';
import doctoresImg from '../../assets/Iconos_Landing/doctores.png';
import Inyeccion from '../../assets/Iconos_Landing/injection.png';
import rayosX from '../../assets/Iconos_Landing/X-Ray.png';
import ultrasonido from '../../assets/Iconos_Landing/Ultrasound.png';
import consulta from '../../assets/Iconos_Landing/Out Patient Department.png';
import doctorSeccion2 from '../../assets/Iconos_Landing/doctorLanding.png';
import styles from '../../styles/usuario/Landing.module.css';

export default function PerfilWeb() {
  const navigate = useNavigate();          // <-- hook de navegación

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // abre el menu cuando la pantalla se adapta a movil
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // se ajusta cuando la pantalla se adapta a movil
  useEffect(() => {
  const checkScreenSize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);

  return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // arreglo de servicios
  const servicios = [
    {
      id: 1,
      titulo: 'Inyecciones',
      imagen: Inyeccion,
      alt: 'inyeccion',
      descripcion: (
        <>
          Aplicación segura y profesional <br />
          de medicamentos vía <br />
          intramuscular o subcutánea, <br />
          realizada por personal <br />
          capacitado.
        </>
      ),
    },
    {
      id: 2,
      titulo: 'Rayos X',
      imagen: rayosX,
      alt: 'rayos x',
      descripcion: (
        <>
          Diagnóstico por imagen de alta <br />
          presición para detectar <br />
          fracturas, infecciones u otras <br />
          condiciones internas.
        </>
      ),
    },
    {
      id: 3,
      titulo: 'Ultrasonido',
      imagen: ultrasonido,
      alt: 'ultrasonido',
      descripcion: (
        <>
          Estudios no invasivos que <br />
          utilizan ondas sonoras para <br />
          observar órganos, tejidos y <br />
          embarazos, sin radiación.
        </>
      ),
    },
    {
      id: 4,
      titulo: 'Consultorio',
      imagen: consulta,
      alt: 'consultorio',
      descripcion: (
        <>
          Atención médica personalizada <br />
          por especialistas en diversas <br />
          áreas, en un entorno cómodo y <br />
          profesional.
        </>
      ),
    },
  ];

  // dividimos el array porque hay 2 columnas 
  const serviciosCol1 = servicios.filter((s) => s.id === 1 || s.id === 3);
  const serviciosCol2 = servicios.filter((s) => s.id === 2 || s.id === 4);


  return (
    <div className={styles.containerLanding}>
      <header className={styles.headerLanding}>
        <div className={styles.leftSection}>
          <img src={logo} alt="Logo" className={styles.logoLanding} />
          <h1 className={styles.tituloPrincipal}>DocNow</h1>
        </div>

         <div onClick={toggleMenu}>
          <img src={menu} alt="iconoMenu" className={styles.menuIcon}/>
        </div>
        

        <div className={styles.rightSection}>
          <nav className={styles.contenedorMenu}>
            <a className={styles.menuHeader}>Inicio</a>
            <a className={styles.menuHeader} href='#servicios'>Servicios</a>
            <a className={styles.menuHeader} href='#opiniones'>Opiniones</a>
            <a className={styles.menuHeader} href='#contacto'>Contacto</a>
          </nav>

          {/** redirigir al login*/}
          <button className={styles.btnInicio} onClick={() => navigate('/login')}> Iniciar sesión</button>
        </div>
        
      </header>

      {menuAbierto && (
        <div className={styles.menuHamburguesa}>
          <a className={styles.menuHeader} onClick={toggleMenu}>Inicio</a>
          <a className={styles.menuHeader} href="#servicios" onClick={toggleMenu}>Servicios</a>
          <a className={styles.menuHeader} href="#opiniones" onClick={toggleMenu}>Opiniones</a>
          <a className={styles.menuHeader} href="#contacto" onClick={toggleMenu}>Contacto</a>
          <a className={`${styles.menuHeader} ${styles.inicioMovil}`} onClick={() => navigate('/login')}>Iniciar sesión</a>
        </div>
      )}
      
      {/* seccion 1 */}
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

      {/* seccion 2 */}
      <section className={styles.section2}>
        <div className={styles.contenidoServicios}>
          {isMobile ? (
            <>
              <div className={styles.textoContainer}>
                <h1 className={styles.textoServicios} id="servicios">
                  Nuestros servicios
                </h1>
                <p className={styles.textoIntroductorio}>
                  Servicios de atención médica de clase<br />
                  mundial para usted y sus seres queridos.
                </p>
              </div>

              {servicios.map((servicio) => (
                <div key={servicio.id} className={styles.tarjeta}>
                  <div className={styles.encabezadoTarjeta}>
                    <h2 className={styles.numero}>{servicio.id}</h2>
                    <h2 className={styles.tituloTarjeta}>{servicio.titulo}</h2>
                  </div>
                  <img
                    src={servicio.imagen}
                    alt={servicio.alt}
                    className={styles.logoTarjeta}
                  />
                  <p className={styles.contenidoTarjeta}>{servicio.descripcion}</p>
                </div>
              ))}

              <img
                src={doctorSeccion2}
                alt="Doctor"
                className={styles.imgLanding}
              />
            </>
          ) : (
            <>
              <div className={styles.textoContainer}>
                <h1 className={styles.textoServicios} id="servicios">
                  Nuestros servicios
                </h1>
                <p className={styles.textoIntroductorio}>
                  Servicios de atención médica de clase<br />
                  mundial para usted y sus seres queridos.
                </p>
                <img
                  src={doctorSeccion2}
                  alt="Doctor"
                  className={styles.imgLanding}
                />
              </div>

              <div className={styles.tarjetasWrapper}>
                <div className={styles.columnaTarjetas}>
                  {serviciosCol1.map((servicio) => (
                    <div key={servicio.id} className={styles.tarjeta}>
                      <div className={styles.encabezadoTarjeta}>
                        <h2 className={styles.numero}>{servicio.id}</h2>
                        <h2 className={styles.tituloTarjeta}>{servicio.titulo}</h2>
                      </div>
                      <img
                        src={servicio.imagen}
                        alt={servicio.alt}
                        className={styles.logoTarjeta}
                      />
                      <p className={styles.contenidoTarjeta}>{servicio.descripcion}</p>
                    </div>
                  ))}
                </div>

                <div className={`${styles.columnaTarjetas} ${styles.desfasada}`}>
                  {serviciosCol2.map((servicio) => (
                    <div key={servicio.id} className={styles.tarjeta}>
                      <div className={styles.encabezadoTarjeta}>
                        <h2 className={styles.numero}>{servicio.id}</h2>
                        <h2 className={styles.tituloTarjeta}>{servicio.titulo}</h2>
                      </div>
                      <img
                        src={servicio.imagen}
                        alt={servicio.alt}
                        className={styles.logoTarjeta}
                      />
                      <p className={styles.contenidoTarjeta}>{servicio.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* seccion 3 */}
      <section className={styles.section3} id="opiniones">
        <div className={styles.bancoOpiniones}>
          <p className={styles.testimonio}>Testimonios</p>
          <h1 className={styles.tituloResena}>
            Reseñas genuinas de nuestros <br />
            pacientes felices
          </h1>
        </div>

        <div className={styles.opinionesWrapper}>
          <div className={styles.tarjetaOpinion}>
            <img src={personaUno} alt="persona" className={styles.usuario} />
            <h2 className={styles.nombreUsuario}>Alicia Martinez</h2>
            <p className={styles.textoOpinion}>
              Necesitaba hacerme unos rayos X con <br />
              urgencia y aquí pude encontrar un <br />
              centro cercano y disponible el mismo <br />
              día. El servicio fue rápido y profesional.
            </p>
          </div>

          <div className={styles.tarjetaOpinion}>
            <img src={personaDos} alt="persona" className={styles.usuario} />
            <h2 className={styles.nombreUsuario}>Pedro Fernández</h2>
            <p className={styles.textoOpinion}>
              Me encanta que puedo ver las <br />
              especialidades, precios y opiniones de <br />
              otros pacientes antes de elegir. Es <br />
              como tener un directorio médico <br />
              confiable en la palma de la mano.
            </p>
          </div>
        </div>
      </section>

      {/* pie de pagina */}
      <footer className={styles.piePagina}>
        <div className={styles.footerTop}>
          <div className={styles.leftSectionPie}>
            <img src={logoBlanco} alt="Logo" className={styles.logoLanding} />
            <h2 className={styles.tituloPie}>DocNow</h2>
          </div>

          <div className={styles.contactosSeccion}>
            <h2 id="contacto">Contáctanos</h2>
            <p>info@support.com</p>
            <p>+(0361) 234 567</p>
            <p>Baja California Sur, La Paz</p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>Copyright © 2025 DocNow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
