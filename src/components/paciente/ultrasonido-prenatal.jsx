/**
 * Descripción: Implementación de recomendacion acudir ultrasonido prenatal
 * Fecha: 24 Junio de 2025
 * Programador: Elvia Medina
 */


import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import '../../styles/paciente/ultrasonido-prenatal.css';

import HeaderPaciente from './menu-paciente';

export default function UltrasonidoPrenatal() {
  return (
    <>
      <div className="header-fixed">
        <HeaderPaciente />
      </div>

      <main className="ultrasonido-main">
        {/* Hero */}
        <section className="hero">
          <div className="hero-text">
            <h1>
              <br />Importancia del ultrasonido Prenatal
            </h1>
            <p>
              Un ultrasonido prenatal es clave para monitorear la salud y desarrollo del bebé. Brinda información vital
              que permite actuar de forma temprana ante cualquier complicación.
            </p>
          </div>
          <div className="hero-image">
            <img
              src="https://assets.ejecentral.com.mx/dims4/default/9453b76/2147483647/strip/true/crop/1280x853+0+0/resize/1440x960!/quality/90/?url=https%3A%2F%2Fk3-prod-ejecentral.s3.us-west-2.amazonaws.com%2Fbrightspot%2Ffe%2Fe5%2F1e1e41168cf467239cddd84adee9%2Fecografia-prenatal-embarazo-ultrasonido.jpg"
              alt="Ultrasonido Prenatal"
            />
          </div>
        </section>

        {/* Frase destacada */}
        <section className="alerta">
          <p>👶 <strong>¿Sabías que?</strong> El primer ultrasonido se recomienda entre la semana 6 y 9 de embarazo.</p>
        </section>

        {/* Beneficios */}
        <section className="beneficios">
          <h2>¿Por qué es importante el ultrasonido prenatal?</h2>
          <div className="beneficio-grid">
            <div className="beneficio-card">
              <i className="pi pi-eye beneficio-icon"></i>
              <h3>Visualización del desarrollo</h3>
              <p>Permite observar el crecimiento del bebé y su posición en el útero.</p>
            </div>
            <div className="beneficio-card">
              <i className="pi pi-heart beneficio-icon"></i>
              <h3>Chequeo de órganos</h3>
              <p>Revisión del corazón, cerebro y estructuras vitales del feto.</p>
            </div>
            <div className="beneficio-card">
              <i className="pi pi-exclamation-triangle beneficio-icon"></i>
              <h3>Prevención</h3>
              <p>Detección oportuna de malformaciones o riesgos en el embarazo.</p>
            </div>
          </div>
        </section>

        {/* Tipos de ultrasonido */}
        <section className="tipos-terapia">
          <h2>Tipos de ultrasonido</h2>
          <div className="tipos-grid">
            <div className="tipo-card">
              <h4>Transvaginal</h4>
              <p>Se usa en etapas tempranas del embarazo para detectar el saco gestacional.</p>
            </div>
            <div className="tipo-card">
              <h4>Ultrasonido 2D</h4>
              <p>El más habitual. Imágenes básicas del feto en blanco y negro.</p>
            </div>
            <div className="tipo-card">
              <h4>Ultrasonido 3D/4D</h4>
              <p>Visualización detallada del rostro y movimientos del bebé en tiempo real.</p>
            </div>
            <div className="tipo-card">
              <h4>Doppler</h4>
              <p>Evalúa el flujo sanguíneo entre madre y bebé.</p>
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section className="testimonios">
          <h2>Lo que dicen las mamás</h2>
          <div className="testimonios-grid">
            <blockquote>
              <p>"Fue emocionante escuchar el corazón de mi bebé por primera vez."</p>
              <footer>Ana M., 10 semanas</footer>
            </blockquote>
            <blockquote>
              <p>"El 4D nos permitió ver a nuestro hijo sonriendo. Increíble."</p>
              <footer>Lucía R., 32 semanas</footer>
            </blockquote>
            <blockquote>
              <p>"Gracias al ultrasonido detectamos un problema a tiempo. Muy agradecida."</p>
              <footer>Paola G., 20 semanas</footer>
            </blockquote>
          </div>
        </section>

        {/* CTA */}
        <section className="cta">
          <div className="cta-content">
            <h2>Agenda tu ultrasonido prenatal</h2>
            <p>Haz tu cita y asegúra el bienestar de tu bebé desde el inicio.</p>
          </div>
        </section>
      </main>

      <footer className="home-footer">
        © {new Date().getFullYear()} DocNow. Todos los derechos reservados.
      </footer>
    </>
  );
}
