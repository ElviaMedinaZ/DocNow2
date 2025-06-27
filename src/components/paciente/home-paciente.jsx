/**
 * Descripción: Implementación de la vista home del paciente
 * Fecha: 17 Junio de 2025
 * Programador: Elvia Medina
 */

import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaSearch, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../../styles/paciente/home-paciente.css';
import HeaderPaciente from './menu-paciente';
import { obtenerCitasPaciente } from '../../utils/firebaseCitas';
import { collection, getDoc, getDocs, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
//Firebase

import { obtenerServicios } from '../../utils/firebaseServicios';

const MySwal = withReactContent(Swal);

const doctor1 = 'https://www.lanacion.com.ar/resizer/v2/dr-VGT2DJVTCFHVXA5DCJWF6F7L5Y.jpg?auth=6744d4e14c7d06fc09def55b0ded72e7aba5bc63c8393aec488a6dd7bc97a678&width=880&height=586&quality=70&smart=true';
const doctor2 = 'https://resizer.glanacion.com/resizer/v2/ellen-pompeo-asegura-que-meredith-tardo-un-tiempo-SIRFKCI6XJBYXKY6T3POUM5XOY.jpg?auth=d79d4a436783dc72ea16c67e1ccf49d789ff8f559abce6e00d3a07a1e94d4481&width=780&height=520&quality=70&smart=true';
const doctor3 = 'https://resizer.glanacion.com/resizer/v2/sandra-oh-interpretaba-a-la-cirujana-cristina-VAWMIDRLFNHFRC3O3T3ANVQMRI.jpg?auth=1be97810e2b60cb9eccc3e6b3a27db4df22ef40f329aa2706c09a603657dd787&width=780&height=520&quality=70&smart=true';

export const obtenerDoctores = async () => {
  const snapshot = await getDocs(collection(db, 'usuarios'));

  const doctores = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.rol === 'Doctor') {
      doctores.push({
        uid: doc.id, // ID del documento (UID)
        nombre: data.nombres,
        especialidad: data.especialidad || '',
        foto: data.fotoPerfil || '',
      });
    }
  });

  return doctores;
};

export default function HomePacienteWeb() {


  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [servicios, setServicios] = useState([]);
  const [mostrarSoloServicios, setMostrarSoloServicios] = useState(false);

  const [citas, setCitas] = useState([]);

  const [doctores, setDoctores] = useState([]);


useEffect(() => {
  const cargarDoctores = async () => {
    const data = await obtenerDoctores();
    setDoctores(data);
  };
  cargarDoctores();
}, []);

useEffect(() => {
  const cargarCitas = async () => {
    const pacienteId = localStorage.getItem('uid');
    if (!pacienteId) return;

    const citasData = await obtenerCitasPaciente(pacienteId);

    // Opcional: obtener nombre del doctor
    const citasConDoctor = await Promise.all(
      citasData.map(async (cita) => {
        const docRef = doc(db, 'usuarios', cita.doctorId);
        const snap = await getDoc(docRef);
        const doctor = snap.exists() ? snap.data() : {};
        return {
          ...cita,
          doctorNombre: doctor.nombres || 'Sin nombre',
          doctorImg: doctor.fotoPerfil || '', // si tienes imagen del doctor
        };
      })
    );

    setCitas(citasConDoctor);
  };

  cargarCitas();
}, []);


  useEffect(() => {
  const checkHash = () => {
      setMostrarSoloServicios(window.location.hash === '#servicios-todos');
    };

    window.addEventListener('hashchange', checkHash);
    checkHash(); // Ejecutar en primer render

    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  useEffect(() => {
    const cargarServicios = async () => {
      const datos = await obtenerServicios();
      setServicios(datos);
    };

    cargarServicios();
  }, []);



  const recomendaciones = [
    { id: 1, titulo: 'Beneficios del chequeo preventivo', img: 'https://www.imbanaco.com/es_CO/el-blog-de-clinica-imbanaco/inicia-este-2025-realizandote-tu-chequeo-medico-preventivo.ficheros/3519758-Chequeo%20m%C3%A9dico%20preventivo_Imbanaco%20%281%29.jpg' },
    { id: 2, titulo: '¿Cuándo acudir al psicólogo?', img: 'https://clinicaelite.es/wp-content/uploads/2023/08/es-bueno-ir-al-psicologo.jpg' },
    { id: 3, titulo: 'Importancia del ultrasonido prenatal', img: 'https://ecobabygirona5d.com/wp-content/uploads/2022/06/ecografia-en-el-embarazo-1024x675.jpg' },
  ];

return (
  <div className="home-container">
    <HeaderPaciente />

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

    {/* Servicios */}
    <section id="servicios" className="home-section">
      <h2 className="mb-3">Servicios disponibles</h2>
      <div className="servicios-grid">
        {(mostrarSoloServicios ? servicios : servicios.slice(0, 6)).map((s) => (
          <div className="servicio-card text-center" key={s.id}>
            <img src={s.img} alt={s.nombre} />
            <span>{s.nombre}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Especialistas */}
    {!mostrarSoloServicios && (
      <section id="medicos" className="home-section">
        <h2>Médicos especialistas</h2>
        <div className="doctores-grid">
          {doctores.map((doctor) => (
            <div
              className="doctor-card"
              key={doctor.uid}
              onClick={() => navigate(`/perfil-medico-paciente/${doctor.uid}`)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={doctor.foto || 'https://via.placeholder.com/100'}
                alt={doctor.nombre}
              />
              <h3>{doctor.nombre}</h3>
              <p>{doctor.especialidad}</p>
            </div>
          ))}
        </div>
      </section>
    )}

    {/* Próximas Citas */}
    {!mostrarSoloServicios && (
      <section id="citas" className="home-section">
  <h2>Próximas citas</h2>
  <div className="citas-grid">
    {citas.length === 0 ? (
      <p>No tienes citas próximas.</p>
    ) : (
      citas.map((cita) => (
        <div className="cita-card" key={cita.id}>
          <img src={cita.doctorImg || 'https://via.placeholder.com/100'} alt={cita.doctorNombre} />
          <div className="cita-info">
            <p>{cita.doctorNombre}</p>
            <p className="cita-fecha">
              <FaCalendarAlt /> {cita.fecha} — {cita.hora}
            </p>
            <p>Servicio: {cita.servicio}</p>
          </div>
        </div>
      ))
    )}
  </div>
</section>

    )}

    {/* Recomendaciones */}
    {!mostrarSoloServicios && (
      <section className="home-section">
        <h2>Recomendaciones para ti</h2>
        <div className="recomendaciones-grid">
          {recomendaciones.map((r) => (
            <div
              className="recomendacion-card"
              key={r.id}
              onClick={() => {
                if (r.id === 1) navigate('/chequeo-preventivo');
                if (r.id === 2) navigate('/psicologo');
                if (r.id === 3) navigate('/ultrasonido-prenatal');
              }}
              style={{ cursor: 'pointer' }}
            >
              <img src={r.img} alt={r.titulo} />
              <div><h4>{r.titulo}</h4></div>
            </div>
          ))}
        </div>
      </section>
    )}

    {!mostrarSoloServicios && (
      <section className="home-cta">
        <h2>¿Listo para cuidar tu salud?</h2>
      </section>
    )}

    <footer className="home-footer">
      © {new Date().getFullYear()} DocNow. Todos los derechos reservados.
    </footer>
  </div>
);

}
