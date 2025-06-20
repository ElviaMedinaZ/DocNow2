/**
 * Descripción: Implementación de la vista home del paciente
 * Fecha: 17 Junio de 2025
 * Programador: Elvia Medina
 */

import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { FaCalendarAlt, FaSearch, FaStar } from 'react-icons/fa';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import HeaderPaciente from '../../components/paciente/MenuPaciente';
import '../../styles/paciente/HomePaciente.css';

const MySwal = withReactContent(Swal);

const doctor1 = 'https://www.lanacion.com.ar/resizer/v2/dr-VGT2DJVTCFHVXA5DCJWF6F7L5Y.jpg?auth=6744d4e14c7d06fc09def55b0ded72e7aba5bc63c8393aec488a6dd7bc97a678&width=880&height=586&quality=70&smart=true';
const doctor2 = 'https://resizer.glanacion.com/resizer/v2/ellen-pompeo-asegura-que-meredith-tardo-un-tiempo-SIRFKCI6XJBYXKY6T3POUM5XOY.jpg?auth=d79d4a436783dc72ea16c67e1ccf49d789ff8f559abce6e00d3a07a1e94d4481&width=780&height=520&quality=70&smart=true';
const doctor3 = 'https://resizer.glanacion.com/resizer/v2/sandra-oh-interpretaba-a-la-cirujana-cristina-VAWMIDRLFNHFRC3O3T3ANVQMRI.jpg?auth=1be97810e2b60cb9eccc3e6b3a27db4df22ef40f329aa2706c09a603657dd787&width=780&height=520&quality=70&smart=true';

const servicios = [
  { id: 1, nombre: 'Medicina Familiar', img: 'https://endoscopynet.com/wp-content/uploads/consulta-Dra-Walkenys-wordpress-2048x1365.jpg' },
  { id: 2, nombre: 'Rayos X', img: 'https://azura.mx/cancun/wp-content/uploads/sites/3/2022/11/para-que-sirven-los-rayos-x-1-768x490.png' },
  { id: 3, nombre: 'Ultrasonidos', img: 'https://cirugiamorelos.com/wp-content/uploads/2020/08/types-of-ultrasounds.jpg' },
  { id: 4, nombre: 'Laboratorio', img: 'https://diariofarma.com/wp-content/uploads/2023/05/Depositphotos_474408074_XL1.jpg' },
  { id: 5, nombre: 'Psicología', img: 'https://www.exitopersonal.com/imagenes/como-elegir-psicologo-para-el-desarrollo-personal.jpg' },
  { id: 6, nombre: 'Nutrición', img: 'https://escuelaclinica.com/wp-content/uploads/CSA175.jpg' },
];

const medicos = [
  { id: 1, nombre: 'Dr.Gregory House', img: doctor1, calificacion: 4.8 },
  { id: 2, nombre: 'Dra. Meredit Gray', img: doctor2, calificacion: 4.9 },
  { id: 3, nombre: 'Dra. Cristina Yang', img: doctor3, calificacion: 4.7 },
];

export default function HomePacienteWeb() {
  const [busqueda, setBusqueda] = useState('');

  const citas = [
    { id: 1, doctor: medicos[0], fecha: '16 junio 2025', hora: '10:00 AM' },
    { id: 2, doctor: medicos[2], fecha: '20 junio 2025', hora: '12:30 PM' },
  ];

  const recomendaciones = [
    { id: 1, titulo: 'Beneficios del chequeo preventivo', img: 'https://www.imbanaco.com/es_CO/el-blog-de-clinica-imbanaco/inicia-este-2025-realizandote-tu-chequeo-medico-preventivo.ficheros/3519758-Chequeo%20m%C3%A9dico%20preventivo_Imbanaco%20%281%29.jpg' },
    { id: 2, titulo: '¿Cuándo acudir al psicólogo?', img: 'https://clinicaelite.es/wp-content/uploads/2023/08/es-bueno-ir-al-psicologo.jpg' },
    { id: 3, titulo: 'Importancia del ultrasonido prenatal', img: 'https://ecobabygirona5d.com/wp-content/uploads/2022/06/ecografia-en-el-embarazo-1024x675.jpg' },
  ];

  return (
    <div className="home-container">
      <HeaderPaciente/>
      <section className="home-hero">
        <h1>Tu salud, en un solo lugar</h1>
        <p>Encuentra médicos confiables, reserva servicios fácilmente y mantén el control de tus citas.</p>
      </section>

      <div className="home-search-wrapper">
        <div className="home-search-box-with-button">
          <div className="home-search-box">
            <FaSearch className="home-search-icon" />
            <InputText
              placeholder="Buscar médicos, servicios, especialidades…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button className="home-search-btn">Buscar</button>
        </div>
      </div>

      <section id="servicios" className="home-section">
        <h2 className="mb-3">Servicios disponibles</h2>
        <div className="servicios-grid">
          {servicios.map((s) => (
            <div className="servicio-card text-center" key={s.id}>
              <img src={s.img} alt={s.nombre} />
              <span>{s.nombre}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="medicos" className="home-section">
        <h2>Médicos destacados</h2>
        <div className="doctores-grid">
          {medicos
            .filter((m) => m.nombre.toLowerCase().includes(busqueda.toLowerCase()))
            .map((m) => (
              <div className="doctor-card" key={m.id}>
                <img src={m.img} alt={m.nombre} />
                <h3>{m.nombre}</h3>
                <div className="doctor-rating">
                  <FaStar /> {m.calificacion}
                </div>
              </div>
            ))}
        </div>
      </section>

      <section id="citas" className="home-section">
        <h2>Próximas citas</h2>
        <div className="citas-grid">
          {citas.map((c) => (
            <div className="cita-card" key={c.id}>
              <img src={c.doctor.img} alt={c.doctor.nombre} />
              <div className="cita-info">
                <p>{c.doctor.nombre}</p>
                <p className="cita-fecha">
                  <FaCalendarAlt /> {c.fecha} — {c.hora}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2>Recomendaciones para ti</h2>
        <div className="recomendaciones-grid">
          {recomendaciones.map((r) => (
            <div className="recomendacion-card" key={r.id}>
              <img src={r.img} alt={r.titulo} />
              <div><h4>{r.titulo}</h4></div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <h2>¿Listo para cuidar tu salud?</h2>
        <button className="home-login-btn">Agenda tu cita ahora</button>
      </section>

      <footer className="home-footer">
        © {new Date().getFullYear()} DocNow. Todos los derechos reservados.
      </footer>
    </div>
  );
}
