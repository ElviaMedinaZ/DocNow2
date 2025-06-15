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

import PantallaPerfilMedico from './components/medico/PantallaPerfilMedico';
import PantallaRegistroMedico from './components/medico/PantallaRegistroMedico';
import PantallaRegistroPaciente from './components/paciente/PantallaRegistroPaciente';
import PantallaLogin from './components/usuario/PantallaLogin';
import { default as PantallaPerfil } from './components/usuario/PantallaPerfil';

addLocale('es', {
  firstDayOfWeek: 1,
  dayNames: ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],
  dayNamesShort: ['dom','lun','mar','mié','jue','vie','sáb'],
  dayNamesMin: ['D','L','M','X','J','V','S'],
  monthNames: ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
  monthNamesShort: ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],
  today: 'Hoy',
  clear: 'Limpiar',
});

locale('es');

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/paciente" element={<PantallaRegistroPaciente />} />
        <Route path="/medico" element={<PantallaRegistroMedico />} />
        <Route path="/perfil" element={<PantallaPerfil />} />
        <Route path="/login" element={<PantallaLogin />} />
        <Route path="/PerfilMedico" element={<PantallaPerfilMedico />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
