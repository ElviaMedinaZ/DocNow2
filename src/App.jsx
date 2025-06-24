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

//Usuario
import PantallaLanding from './components/usuario/landing';
import PantallaLogin from './components/usuario/login';

//Admin
import PantallaBuscador from './components/admin/buscador';
import PantallaHomeAdmin from './components/admin/home-admin';

//Paciente
import PantallaPerfilMedico from './components/medico/perfil-medico-paciente';
import PantallaHomePaciente from './components/paciente/home-paciente';
import PantallaRegistroPaciente from './components/paciente/registro-paciente';
import PantallaPerfil from './components/usuario/perfil';

//Medico
import PantallaHomeMedico from './components/medico/home-medico';
import PantallaRegistroMedico from './components/medico/registro-medico';
import PantallaConsultaMedica from './components/medico/consulta-medica';
import PantallaHistorialMedico from './components/medico/historial-medico';




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
        {/*Usuario*/}
        <Route path="/" element={<PantallaLanding />} />
        <Route path="/login" element={<PantallaLogin />} />

        {/*Paciemnte*/}
        <Route path="/registro-medico" element={<PantallaRegistroMedico />} />
        <Route path="/perfil" element={<PantallaPerfil />} />
        <Route path="/home-paciente" element={<PantallaHomePaciente />} />

        {/*Medico*/}
        <Route path="/registro-paciente" element={<PantallaRegistroPaciente />} />
        <Route path="/perfil-medico-paciente" element={<PantallaPerfilMedico />} />
        <Route path='/home-medico' element={<PantallaHomeMedico/>}/>
        <Route path='/consulta-medica' element={<PantallaConsultaMedica/>}/>
        <Route path='/historial-medico' element={<PantallaHistorialMedico/>}/>
        
        {/*Admin*/}
        <Route path="/buscador" element={<PantallaBuscador />} />
        <Route path='/home-admin' element={<PantallaHomeAdmin/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;