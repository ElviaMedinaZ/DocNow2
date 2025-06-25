/**
 * Descripción: Implementación de recomendacion acudir al psicologo
 * Fecha: 24 Junio de 2025
 * Programador: Elvia Medina
 */

import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import '../../styles/paciente/acudir-psicologo.css';

import HeaderPaciente from './menu-paciente';

export default function AcudirPsicologo() {
  return (
    <>
      <div className="header-fixed">
        <HeaderPaciente />
      </div>

      <main className="psicologo-main">
        {/* Hero */}
        <section className="hero">
          <div className="hero-text">
            <h1><br />Importancia de acudir al Psicólogo</h1>
            <p>
              La salud mental es esencial. Acudir al psicólogo es un acto de amor propio, no una señal de debilidad.
              Cuidar tu mente es tan necesario como cuidar tu cuerpo.
            </p>
          </div>
          <div className="hero-image">
            <img src="https://pymstatic.com/28815/conversions/motivos-de-consulta-psicologica-comunes-wide_webp.webp" alt="Consulta psicológica" />
          </div>
        </section>

        {/* Frase destacada */}
        <section className="alerta">
          <p>🧠 <strong>¿Sabías que?</strong> El 75% de los trastornos mentales comienzan antes de los 24 años.</p>
        </section>

        {/* Beneficios */}
        <section className="beneficios">
          <h2>¿Por qué acudir al psicólogo?</h2>
          <div className="beneficio-grid">
            <div className="beneficio-card">
              <i className="pi pi-users beneficio-icon"></i>
              <h3>Apoyo Emocional</h3>
              <p>Habla sin juicios, con empatía y comprensión profesional.</p>
              <ul>
                <li>✔ Ansiedad y estrés</li>
                <li>✔ Duelo, depresión</li>
                <li>✔ Problemas de pareja</li>
              </ul>
            </div>
            <div className="beneficio-card">
              <i className="pi pi-cog beneficio-icon"></i>
              <h3>Técnicas y Estrategias</h3>
              <p>Aprende a identificar y gestionar tus emociones.</p>
              <ul>
                <li>✔ Mindfulness</li>
                <li>✔ Reestructuración cognitiva</li>
                <li>✔ Autoobservación y hábitos</li>
              </ul>
            </div>
            <div className="beneficio-card">
              <i className="pi pi-sun beneficio-icon"></i>
              <h3>Autoconocimiento</h3>
              <p>Descubre patrones de pensamiento y fortalece tu autoestima.</p>
              <ul>
                <li>✔ Ciclos de comportamiento</li>
                <li>✔ Narrativa personal</li>
                <li>✔ Desarrollo interior</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Mitos comunes */}
        <section className="mitos">
          <h2>Mitos comunes sobre ir al psicólogo</h2>
          <div className="mito-grid">
            <div className="mito-card">
              <img src="https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/svg/1f9e0.svg" alt="mito 1" />
              <h4>“Solo los locos van al psicólogo”</h4>
              <p>Falso. La terapia es para todos, incluso personas sanas que buscan mejorar aspectos de su vida.</p>
            </div>
            <div className="mito-card">
              <img src="https://cdn-icons-png.flaticon.com/512/6009/6009544.png" alt="mito 2" />
              <h4>“Yo puedo solo con todo”</h4>
              <p>Buscar ayuda no es debilidad, es inteligencia emocional. Todos necesitamos apoyo en algún momento.</p>
            </div>
            <div className="mito-card">
              <img src="https://cdn-icons-png.flaticon.com/512/6381/6381399.png" alt="mito 3" />
              <h4>“La terapia dura años”</h4>
              <p>No siempre. Hay terapias breves con objetivos específicos que mejoran tu vida en pocas sesiones.</p>
            </div>
          </div>
        </section>

        {/* Tipos de terapia */}
        <section className="tipos-terapia">
          <h2>Tipos de terapia psicológica</h2>
          <div className="tipos-grid">
            <div className="tipo-card">
              <h4>Terapia Cognitivo-Conductual (TCC)</h4>
              <p>Basada en la identificación de pensamientos negativos y cómo cambiarlos.</p>
            </div>
            <div className="tipo-card">
              <h4>Terapia Humanista</h4>
              <p>Se enfoca en el crecimiento personal, la empatía y la autorrealización.</p>
            </div>
            <div className="tipo-card">
              <h4>Terapia Sistémica</h4>
              <p>Ideal para terapia familiar o de pareja, estudia la dinámica del grupo.</p>
            </div>
            <div className="tipo-card">
              <h4>Terapia Psicoanalítica</h4>
              <p>Explora tu inconsciente, recuerdos y experiencias pasadas que influyen hoy.</p>
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section className="testimonios">
          <h2>Testimonios reales</h2>
          <div className="testimonios-grid">
            <blockquote>
              <p>"Aprendí a poner límites sin culpa. Me siento más libre y tranquila."</p>
              <footer>Daniela P., 33 años</footer>
            </blockquote>
            <blockquote>
              <p>"Mi hijo tenía ansiedad escolar. La terapia infantil cambió nuestras vidas."</p>
              <footer>Marcos T., 40 años</footer>
            </blockquote>
            <blockquote>
              <p>"Conocí partes de mí que nunca había explorado. Fue transformador."</p>
              <footer>Laura G., 27 años</footer>
            </blockquote>
          </div>
        </section>

        {/* Llamado a la acción */}
        <section className="cta">
          <div className="cta-content">
            <h2>Da el primer paso hacia tu bienestar</h2>
            <p>No estás solo. Habla con un profesional hoy.</p>
          </div>
        </section>
      </main>
      <footer className="home-footer">
        © {new Date().getFullYear()} DocNow. Todos los derechos reservados.
      </footer>
    </>
  );
}
