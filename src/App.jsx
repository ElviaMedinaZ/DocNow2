/**
 * Descripción:Modificación del App
 * Fecha:11 Junio de 2025
 * Programador: Elvia Medina
 */

import 'primeicons/primeicons.css';
import { addLocale, locale } from 'primereact/api';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';

import PantallaRegistro from './components/usuario/PantallaRegistroPaciente';

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

// Establece el idioma global por defecto
locale('es');

function App() {
  return (
    <>
      <PantallaRegistro />
    </>
  );
}

export default App;
