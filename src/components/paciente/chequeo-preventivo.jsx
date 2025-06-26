/**
 * Descripción: Implementación de recomendacion chequeo preventivo
 * Fecha: 24 Junio de 2025
 * Programador: Elvia Medina
 */

import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import '../../styles/paciente/chequeo-preventivo.css';

import HeaderPaciente from './menu-paciente';

export default function ChequeoPreventivo() {
  return (
    <>
      <div className="header-fixed">
        <HeaderPaciente />
      </div>

      <main className="chequeo-main">
        <section className="hero">
          <div className="hero-text">
            <h1><br/>Beneficios del chequeo Preventivo</h1>
            <p>
              La prevención es la mejor medicina. Descubre cómo los chequeos regulares
              pueden detectar problemas de salud antes de que se conviertan en algo serio y costoso.
            </p>
          </div>
          <div className="hero-image">
            <img src="https://felizfamilycare.com/wp-content/uploads/2024/06/Medium-shot-smiley-doctor-checking-woman-explaining-what-is-wellness-check-1024x683.jpg" alt="Chequeo Preventivo" />
          </div>
        </section>

        <section className="alerta">
          <p>🩺 <strong>¿Sabías que?</strong> El 80% de las enfermedades cardiovasculares y diabetes tipo 2 se pueden prevenir con chequeos regulares.</p>
        </section>

        <section className="beneficios">
          <h2>¿Por qué es crucial el chequeo preventivo?</h2>
          <div className="beneficio-grid">
            <div className="beneficio-card">
              <i className="pi pi-search beneficio-icon"></i>
              <h3>Detección Temprana</h3>
              <p>Detecta enfermedades en fases iniciales cuando son más fáciles de tratar.</p>
              <ul>
                <li>✔ Cáncer en etapas tempranas</li>
                <li>✔ Enfermedades cardiovasculares</li>
                <li>✔ Diabetes y prediabetes</li>
              </ul>
            </div>
            <div className="beneficio-card">
              <i className="pi pi-shield beneficio-icon"></i>
              <h3>Prevención de Riesgos</h3>
              <p>Controla factores como presión arterial o colesterol antes de que escalen.</p>
              <ul>
                <li>✔ Control de presión arterial</li>
                <li>✔ Niveles de colesterol</li>
                <li>✔ Índice de masa corporal</li>
              </ul>
            </div>
            <div className="beneficio-card">
              <i className="pi pi-heart beneficio-icon"></i>
              <h3>Monitoreo Continuo</h3>
              <p>Seguimiento personalizado de tu salud con planes de tratamiento.</p>
              <ul>
                <li>✔ Historial médico</li>
                <li>✔ Seguimiento de medicamentos</li>
                <li>✔ Planes de prevención</li>
              </ul>
            </div>
          </div>
        </section>


        <section className="frecuencia">
          <h2>¿Con qué frecuencia debo hacerme un chequeo?</h2>
          <div className="edad-grid">
            <div className="edad-card">
              <div className="edad-num">20+</div>
              <h4>Adultos Jóvenes</h4>
              <p className="frecuencia-texto">Cada 2–3 años</p>
              <ul>
                <li>Prevención primaria</li>
                <li>Educación en salud</li>
              </ul>
            </div>
            <div className="edad-card destacado">
              <div className="edad-num">40+</div>
              <h4>Adultos Medios</h4>
              <p className="frecuencia-texto">Cada 1–2 años</p>
              <ul>
                <li>Detección de cáncer</li>
                <li>Control cardiovascular</li>
              </ul>
            </div>
            <div className="edad-card">
              <div className="edad-num">65+</div>
              <h4>Adultos Mayores</h4>
              <p className="frecuencia-texto">Anualmente</p>
              <ul>
                <li>Función cognitiva</li>
                <li>Salud ósea</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="testimonios">
          <h2>Lo que dicen nuestros pacientes</h2>
          <div className="testimonios-grid">
            <blockquote>
              <p>"Gracias al chequeo preventivo detectaron mi prediabetes a tiempo."</p>
              <footer>Ana García, 45 años</footer>
            </blockquote>
            <blockquote>
              <p>"Me detectaron colesterol alto y ahora estoy mucho mejor."</p>
              <footer>Carlos Mendoza, 38 años</footer>
            </blockquote>
            <blockquote>
              <p>"Detectaron un tumor en etapa temprana que se pudo tratar completamente."</p>
              <footer>María López, 52 años</footer>
            </blockquote>
          </div>
        </section>
      </main>
      <footer className="home-footer">
            © {new Date().getFullYear()} DocNow. Todos los derechos reservados.
      </footer>
    </>
  );
}
