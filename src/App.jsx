/*
 * Descripción: Se agrega el App y se establece tiempo local.
 * Fecha: 11 Junio de 2025
 * Programador: Elvia Medina
 */


import 'primeicons/primeicons.css';
import { addLocale, locale } from 'primereact/api';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Usuario
import PantallaLanding from './components/usuario/landing';
import PantallaLogin from './components/usuario/login';
import PantallaNuevaContrasena from './components/usuario/nueva-contrasena';
import PantallaPerfil from './components/usuario/perfil';
import PantallaRecuperarContrasena from './components/usuario/recuperar-contrasena';
import PantallaVerificarCodigo from './components/usuario/verificar-codigo';

// Paciente
import Psicologo from './components/paciente/acudir-psicologo';
import AgendarCita from "./components/paciente/agendar-cita";
import ChequeoPreventivo from "./components/paciente/chequeo-preventivo";
import PantallaHomePaciente from './components/paciente/home-paciente';
import PantallaRegistroPaciente from './components/paciente/registro-paciente';
import UltrasonidoPrenatal from "./components/paciente/ultrasonido-prenatal";


// Médico
import PantallaConsultaMedica from './components/medico/consulta-medica';
import PantallaHistorialMedico from './components/medico/historial-medico';
import PantallaHomeMedico from './components/medico/home-medico';
import PantallaPerfilMedico from './components/medico/perfil-medico';
import PantallaPerfilMedicoPaciente from './components/medico/perfil-medico-paciente';
import PantallaRecetaMedica from './components/medico/receta-medica';
import PantallaRegistroMedico from './components/medico/registro-medico';


// Administrador
import PantallaDashboardAdmin from './components/admin/admin-dashboard';
import AdminLayout from './components/admin/admin-layout';
import PantallaBuscador from './components/admin/buscador';
import CitasAdmin from './components/admin/citas-admin';
import DoctoresAdmin from './components/admin/doctores-admin';
import EspecialidadesAdmin from './components/admin/especialidades-admin';
import PacientesAdmin from './components/admin/pacientes-admin';
import ServiciosAdmin from './components/admin/servicios-admin';
import HistorialMedico from './components/medico/historial-medico';

addLocale('es', {
  firstDayOfWeek: 1,
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  today: 'Hoy',
  clear: 'Limpiar',
});

locale('es');

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* --- Usuario --- */}
        <Route path="/" element={<PantallaLanding />} />
        <Route path="/login" element={<PantallaLogin />} />

        {/*Paciemnte*/}
        <Route path="/registro-medico" element={<PantallaRegistroMedico />} />
        <Route path="/perfil" element={<PantallaPerfil />} />
        <Route path="/recuperar-contrasena" element={<PantallaRecuperarContrasena />} />
        <Route path="/nueva-contrasena" element={<PantallaNuevaContrasena />} />
        <Route path="/verificar-codigo" element={<PantallaVerificarCodigo />} />

        {/* --- Paciente --- */}
        <Route path="/home-paciente" element={<PantallaHomePaciente />} />
        <Route path="/registro-paciente" element={<PantallaRegistroPaciente />} />
        <Route path="/chequeo-preventivo" element={<ChequeoPreventivo />} />
        <Route path="/ultrasonido-prenatal" element={<UltrasonidoPrenatal />} />
        <Route path="/psicologo" element={<Psicologo />} />
        <Route path="/agendar-cita" element={<AgendarCita />} />


        {/* --- Médico --- */}
        <Route path="/home-medico" element={<PantallaHomeMedico />} />
        <Route path="/perfil-medico-paciente/:uid" element={<PantallaPerfilMedicoPaciente />} />
        <Route path="/registro-medico" element={<PantallaRegistroMedico />} />
        <Route path="/registro-medico/:id" element={<PantallaRegistroMedico />} />
        <Route path="/consulta-medica" element={<PantallaConsultaMedica />} />
        <Route path='/historial-medico' element={<PantallaHistorialMedico/>}/>
        <Route path='/receta-medica' element={<PantallaRecetaMedica/>}/>
        <Route path="/perfil-medico" element={<PantallaPerfilMedico/>} />
        
        {/*Admin*/}

        {/* --- Administrador --- */}
        <Route path="/buscador" element={<PantallaBuscador />} />
        <Route path="/dashboard-admin" element={<PantallaDashboardAdmin />} />
        <Route path="/dashboard-admin/*" element={<AdminLayout />}>
          <Route index element={<PantallaDashboardAdmin />} />
          <Route path="doctores" element={<DoctoresAdmin />} />
          <Route path="especialidades" element={<EspecialidadesAdmin />} />
          <Route path="servicios" element={<ServiciosAdmin />} />
          <Route path="pacientes" element={<PacientesAdmin />} />
          <Route path="citas" element={<CitasAdmin />} />
          <Route path="historial/:pacienteId" element={<HistorialMedico />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;