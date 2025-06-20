/**
 * Descripción:Se agrega el App y se establece tiempo local.
 * Fecha:11 Junio de 2025
 * Programador: Elvia Medina
 */

import 'primeicons/primeicons.css';
import { addLocale, locale } from 'primereact/api';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import PantallaBuscador from './components/admin/buscador';
import PantallaPerfilMedico from './components/medico/perfil-medico';
import PantallaRegistroMedico from './components/medico/registro-medico';
import PantallaHomePaciente from './components/paciente/home-paciente';
import PantallaRegistroPaciente from './components/paciente/registro-paciente';
import PantallaLanding from './components/usuario/landing';
import PantallaLogin from './components/usuario/login';
import PantallaPerfil from './components/usuario/perfil';

addLocale('es', {
  firstDayOfWeek: 1,
  dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
  dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
  monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  today: 'Hoy',
  clear: 'Limpiar',
});

locale('es');

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PantallaLanding />} />
        <Route path="/registro-medico" element={<PantallaRegistroMedico />} />
        <Route path="/registro-paciente" element={<PantallaRegistroPaciente />} />
        <Route path="/perfil" element={<PantallaPerfil />} />
        <Route path="/login" element={<PantallaLogin />} />
        <Route path="/perfil-medico" element={<PantallaPerfilMedico />} />
        <Route path="/buscador" element={<PantallaBuscador />} />
        <Route path="/home-paciente" element={<PantallaHomePaciente />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;