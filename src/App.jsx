/**
 * Descripción: Se agrega el App y se establece tiempo local.
 * Fecha: 11 Junio de 2025
 * Programador: Elvia Medina
 */

import 'primeicons/primeicons.css';
import { addLocale, locale } from 'primereact/api';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PantallaBuscador from './components/admin/buscador';
import PantallaRegistroMedico from './components/medico/registro-medico';
import PantallaHomePaciente from './components/paciente/home-paciente';
import PantallaRegistroPaciente from './components/paciente/registro-paciente';
import PantallaLanding from './components/usuario/landing';
import PantallaLogin from './components/usuario/login';
import PantallaPerfil from './components/usuario/perfil';

// Paciente

// Médico
import PantallaConsultaMedica from './components/medico/consulta-medica';
import PantallaHistorialMedico from './components/medico/historial-medico';
import PantallaHomeMedico from './components/medico/home-medico';



import PantallaPerfilMedico from './components/medico/perfil-medico-paciente';

// Admin
import { default as AdminDashboard, default as PantallaDashboardAdmin } from './components/admin/admin-dashboard';
import AdminLayout from './components/admin/admin-layout';
import CitasAdmin from './components/admin/citas-admin';
import DoctoresAdmin from './components/admin/doctores-admin';
import EspecialidadesAdmin from './components/admin/especialidades-admin';
import PacientesAdmin from './components/admin/pacientes-admin';
import ServiciosAdmin from './components/admin/servicios-admin';

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
        {/* Usuario */}
        <Route path="/" element={<PantallaLanding />} />
        <Route path="/login" element={<PantallaLogin />} />
        <Route path="/perfil" element={<PantallaPerfil />} />

        {/* Paciente */}
        <Route path="/home-paciente" element={<PantallaHomePaciente />} />
        <Route path="/registro-paciente" element={<PantallaRegistroPaciente />} />

        {/* Médico */}
        <Route path="/home-medico" element={<PantallaHomeMedico />} />
        <Route path="/perfil-medico-paciente" element={<PantallaPerfilMedico />} />
        <Route path="/registro-medico" element={<PantallaRegistroMedico />} />
        <Route path="/registro-medico/:id" element={<PantallaRegistroMedico />} />
        <Route path='/consulta-medica' element={<PantallaConsultaMedica/>}/>
        <Route path='/historial-medico' element={<PantallaHistorialMedico/>}/>

        <Route path="/buscador" element={<PantallaBuscador />} />
        <Route path="/dashboard-admin" element={<AdminDashboard />} />

        <Route path="/dashboard-admin/*" element={<AdminLayout />}>
          <Route index element={<PantallaDashboardAdmin />} />
          <Route path="doctores" element={<DoctoresAdmin />} />
          <Route path="especialidades" element={<EspecialidadesAdmin />} />
          <Route path="servicios" element={<ServiciosAdmin />} />
          <Route path="pacientes" element={<PacientesAdmin />} />
          <Route path="citas" element={<CitasAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
