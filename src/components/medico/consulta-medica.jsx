/**
 * Descripción: Implementación de la vista de consulta medica
 * Fecha: 14 Junio de 2025
 * Programador: Irais Reyes
 */

import React, { useState } from "react";
// import { signOut } from 'firebase/auth';
// import { auth } from '../../lib/firebase';
import { LuUserRound } from "react-icons/lu";
import { InputNumber } from 'primereact/inputnumber';
import { FloatLabel } from 'primereact/floatlabel';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from "primereact/inputtext";
import { FiSave } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { BsHeartPulse } from "react-icons/bs";
import { MdHistory } from "react-icons/md";
import { GoArrowLeft } from "react-icons/go";
import { FiUser } from "react-icons/fi";
import { LuStethoscope } from "react-icons/lu";
import { InputTextarea } from 'primereact/inputtextarea';
import { GrDocumentText } from "react-icons/gr";
import { MdOutlineBloodtype } from "react-icons/md";
import { MdOutlineLocalPhone } from "react-icons/md";
import { LiaWeightSolid } from "react-icons/lia";
import { LuRuler } from "react-icons/lu";
import { IoIosCalendar } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import { Dialog } from 'primereact/dialog';
import HeaderMedico from '../../components/medico/MenuMedico';
import HistorialMedico from '../../components/medico/historial-medico';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import RecetaPDF from '../../components/medico/receta-medica';
import '../../styles/medico/ConsultaMedica.css';

export default function HomeMedico() {
      const [mostrarPDF, setMostrarPDF] = useState(false);
  const navigate = useNavigate();
  const [datosGuardados, setDatosGuardados] = useState(false);
  const [saturacion, setSaturacion] = useState('');
  const [edad, setEdad] = useState(null);
  const [peso, setPeso] = useState(null);
  const [estatura, setEstatura] = useState(null);
  const [sintomas, setSintomas] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [recomendaciones, setRecomendaciones] = useState('');
  const [notas, setNotas] = useState('');
  const [tipoSangreSeleccionada, setTipoSangreSeleccionada] = useState(null);
  const [alergias, setAlergias] = useState('');
  
  const tipoSangre = [
    { name: 'A+', code: 'A+' },
    { name: 'A-', code: 'A-' },
    { name: 'B+', code: 'B+' },
    { name: 'B-', code: 'B-' },
    { name: 'AB+', code: 'AB+' },
    { name: 'AB-', code: 'AB-' },
    { name: 'O+', code: 'O+' },
    { name: 'O-', code: 'O-' },
  ];

  const pacientes = [
    {
      id: '1',
      nombres: 'Juan',
      apellidoP: 'Pérez',
      apellidoM: 'García',
      rol: 'Paciente',
      sexo: 'M',
      fotoURL: 'https://img.freepik.com/foto-gratis/retrato-chico-casual-posando-estudio_176420-28907.jpg?semt=ais_hybrid&w=740',
      correo: 'juan.perez@email.com',
      telefono: '+1 (555) 987-6543',
    },
  ];

  const [paciente, setPaciente] = useState(pacientes[0]);

  const handleChangeAlergias = (value) => {
    setAlergias(value);
  };

  // Regex para validar presión arterial
  const [presion, setPresion] = useState('');
  const [error, setError] = useState(false);

  const validarPresion = (value) => {
    const regex = /^\d{2,3}\/\d{2,3}$/;
    setError(!regex.test(value));
    setPresion(value);
  };

  const [frecuencia, setFrecuencia] = useState('');
  const [errorFreq, setErrorFreq] = useState(false);

  const validarFrecuencia = (value) => {
    const regex = /^\d{2,3}$/;
    setErrorFreq(!regex.test(value));
    setFrecuencia(value);
  };

  const [temperatura, setTemperatura] = useState('');
  const [errorTemp, setErrorTemp] = useState(false);

  const validarTemperatura = (value) => {
    const regex = /^(3[0-9]|4[0-4])(\.\d)?$/;
    setErrorTemp(!regex.test(value));
    setTemperatura(value);
  };

  // Estado de errores
  const [errores, setErrores] = useState({
    alergias: false,
    edad: false,
    tipoSangre: false,
    peso: false,
    estatura: false,
  });
  
  const [erroresConsulta, setErroresConsulta] = useState({
    sintomas: false,
    diagnostico: false,
    tratamiento: false,
  });

  // Validar datos básicos
  const validarDatosBasicos = () => {
    const nuevosErrores = {};

    if (edad === null) nuevosErrores.edad = true;
    if (!tipoSangreSeleccionada) nuevosErrores.tipoSangre = true;
    if (peso === null) nuevosErrores.peso = true;
    if (estatura === null) nuevosErrores.estatura = true;

    const alergiasVacias = alergias.trim() === '';
    const regex = /^([A-Za-zÁÉÍÓÚáéíóúñÑ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúñÑ]+)*)(,\s*[A-Za-zÁÉÍÓÚáéíóúñÑ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúñÑ]+)*)*$/;
    const formatoValido = regex.test(alergias.trim());

    if (alergiasVacias || !formatoValido) nuevosErrores.alergias = true;

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      setPaciente(prev => ({
        ...prev,
        edad,
        tipoSangre: tipoSangreSeleccionada.name,
        peso,
        estatura,
        alergias,
      }));

      setDatosGuardados(true);
      return true;
    }
    return false;
  };

  // Validar consulta
  const validarConsulta = () => {
    const nuevosErrores = {
      sintomas: sintomas.trim() === '',
      diagnostico: diagnostico.trim() === '',
      tratamiento: tratamiento.trim() === '',
    };

    setErroresConsulta(nuevosErrores);

    const hayError = Object.values(nuevosErrores).some(error => error);
    return !hayError;
  };

  const handleGuardarConsulta = () => {
    if (validarConsulta()) {
      setMostrarPDF(true);
      return true;
    }
    return false;
  };

return (
  <div className="homeConsultaContainer">
      <HeaderMedico />

      <div className="contenido-pagina">

        <div className="consulta-header">
          <div className="consulta-header-left">
            <button className="volver-btn" onClick={() => navigate('/home-medico')}>
              <GoArrowLeft /> Volver
            </button>
            <div className="info-textos">
              <h2>Consulta médica</h2>
              <p>Atendiendo a {paciente.nombres} {paciente.apellidoP}</p>
            </div>
          </div>

          <p className="fechaAtendido">Domingo, 22 de junio de 2025</p>
          </div>

          {!datosGuardados && (
          <div className="datos-paciente">
            <div className="titulo-seccion">
              <h2 className="titulo-azul">
                <LuUserRound /> Primera Consulta - Datos Básicos del Paciente
              </h2>
            </div>
            <div className="form-grid">
              {/* Edad */}
              <div className="form-group">
                <p>Edad</p>
                <FloatLabel>
                  <InputNumber
                    id="edad"
                    value={edad}
                    onValueChange={(e) => setEdad(e.value)}
                    className={errores.edad ? 'p-invalid' : ''}
                  />
                </FloatLabel>
              </div>

              {/* Tipo de Sangre */}
              <div className="form-group">
                <p>Tipo de sangre</p>
                <Dropdown
                  value={tipoSangreSeleccionada}
                  onChange={(e) => setTipoSangreSeleccionada(e.value)}
                  options={tipoSangre}
                  optionLabel="name"
                  placeholder="Seleccionar"
                  className={`w-full md:w-14rem ${errores.tipoSangre ? 'p-invalid' : ''}`}
                />
              </div>

              {/* Peso */}
              <div className="form-group">
                <p>Peso</p>
                <FloatLabel>
                  <InputNumber
                    id="peso"
                    value={peso}
                    onValueChange={(e) => setPeso(e.value)}
                    className={errores.peso ? 'p-invalid' : ''}
                  />
                </FloatLabel>
              </div>

              {/* Estatura */}
              <div className="form-group">
                <p>Estatura</p>
                <FloatLabel>
                  <InputNumber
                    id="estatura"
                    value={estatura}
                    onValueChange={(e) => setEstatura(e.value)}
                    className={errores.estatura ? 'p-invalid' : ''}
                  />
                </FloatLabel>
              </div>

              {/* Alergias */}
              <div className="form-group alergias-group">
                <p>Alergias</p>
                <InputText
                  value={alergias}
                  onChange={(e) => handleChangeAlergias(e.target.value)}
                  placeholder="Ej: Penicilina, Mariscos (separar por comas)"
                  className={errores.alergias ? 'p-invalid' : ''}
                />
                {errores.alergias && (
                  <small className="mensaje-error">
                    Ingresa al menos una alergia, separadas por comas. Solo texto permitido.
                  </small>
                )}
              </div>
            </div>

            <div className="boton-guardar-container">
              <button className="boton-guardar" onClick={validarDatosBasicos}>
                <FiSave /> Guardar Datos Básicos
              </button>
            </div>
          </div>
         )}

          <div className="contenedorPacienteSignos">
            {/* Tarjeta de perfil del paciente */}
            {!datosGuardados ? (
              <div className="perfilMedicoPaciente">
                <img src={paciente.fotoURL} alt={`Foto de ${paciente.nombres}`} className="imgPacientePerfil" />
                <p className="nombreCompletoPaciente">
                  {paciente.nombres} {paciente.apellidoP} {paciente.apellidoM}
                </p>
                <hr />
                <p><FiUser /> {paciente.correo}</p>
                <p><MdOutlineLocalPhone /> {paciente.telefono}</p>
              </div>
            ) : (
              <div className="perfilCompletoPaciente">
                <div className="fotoNombre">
                  <img src={paciente.fotoURL} alt="Foto paciente" className="fotoPaciente" />
                  <h3>{paciente.nombres} {paciente.apellidoP} {paciente.apellidoM}</h3>
                  <p className="edadPaciente">{paciente.edad} años</p>
                </div>

                <div className="datosMedicos">
                  <h5>Datos Médicos</h5>
                  <div className="datos-grid">
                    <div className="dato">
                      <span className="icono rojo"><MdOutlineBloodtype /></span>
                      <span className="label">Tipo de Sangre</span>
                      <span className="valor">{paciente.tipoSangre}</span>
                    </div>
                    <div className="dato">
                      <span className="icono azul"><LiaWeightSolid /></span>
                      <span className="label">Peso</span>
                      <span className="valor">{paciente.peso} kg</span>
                    </div>
                    <div className="dato">
                      <span className="icono verde"><LuRuler /></span>
                      <span className="label">Estatura</span>
                      <span className="valor">{paciente.estatura} cm</span>
                    </div>
                    <div className="dato">
                      <span className="icono morado"><IoIosCalendar /></span>
                      <span className="label">Edad</span>
                      <span className="valor">{paciente.edad} años</span>
                    </div>
                  </div>
                </div>

                {paciente.alergias && (
                  <div className="alergiasPaciente">
                    <h5><IoWarningOutline /> Alergias</h5>
                    <div className="alergias-tags">
                      {paciente.alergias.split(',').map((alergia, index) => (
                        <span key={index} className="tag-alergia">{alergia.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="contactoPaciente">
                  <p><FiUser /> {paciente.correo}</p>
                  <p><MdOutlineLocalPhone /> {paciente.telefono}</p>
                </div>
              </div>
            )}


            {/* Contenedor derecho: Signos + Detalles */}
            <div style={{ flex: 1 }}>
              {/* Tarjeta de signos vitales */}
              <div className="signosVitalesPaciente">
                <h2><BsHeartPulse /> Signos vitales</h2>
                <div className="signos-grid">

                  <div className="campo-signo">
                    <p>Presión Arterial</p>
                    <InputText
                      placeholder="120/80"
                      value={presion}
                      onChange={(e) => validarPresion(e.target.value)}
                      className={error ? 'p-invalid' : ''}
                    />
                    {error && <small className="p-error">Formato inválido. Ej: 120/80</small>}
                  </div>

                  <div className="campo-signo">
                    <p>Frecuencia Cardiaca</p>
                    <InputText
                      placeholder="72 bpm"
                      value={frecuencia}
                      onChange={(e) => validarFrecuencia(e.target.value)}
                      className={errorFreq ? 'p-invalid' : ''}
                    />
                    {errorFreq && <small className="p-error">Ejemplo válido: 72, solo se aceptan numeros</small>}
                  </div>

                  <div className="campo-signo">
                    <p>Temperatura</p>
                    <InputText
                      placeholder="36.5"
                      value={temperatura}
                      onChange={(e) => validarTemperatura(e.target.value)}
                      className={errorTemp ? 'p-invalid' : ''}
                    />
                    {errorTemp && <small className="p-error">Ingrese un valor válido entre 30 y 44.9</small>}
                  </div>

                  <div className="campo-signo">
                    <p>Saturación O2</p>
                    <InputText placeholder="98%" 
                    value={saturacion}
                    onChange={(e) => setSaturacion(e.target.value)}/>
                  </div>

                </div>
              </div>

              {/* Tarjeta detalles de consulta debajo */}
              <div className="tarjetaDetallesConsulta">
                <h2><LuStethoscope /> Detalles de la consulta</h2>

                <div className="campoConsulta">
                  <p>Sintomatología</p>
                  <InputTextarea
                    placeholder="Describa los síntomas del paciente..."
                    autoResize
                    value={sintomas}
                    onChange={(e) => setSintomas(e.target.value)}
                    rows={5}
                    className={erroresConsulta.sintomas ? 'p-invalid' : ''}
                  />
                  {erroresConsulta.sintomas && <small className="p-error">Este campo es obligatorio</small>}
                </div>

                <div className="campoConsulta">
                  <p>Diagnóstico</p>
                  <InputTextarea
                    placeholder="Diagnóstico médico..."
                    autoResize
                    value={diagnostico}
                    onChange={(e) => setDiagnostico(e.target.value)}
                    rows={5}
                    className={erroresConsulta.diagnostico ? 'p-invalid' : ''}
                  />
                  {erroresConsulta.diagnostico && <small className="p-error">Este campo es obligatorio</small>}
                </div>

                <div className="campoConsulta">
                  <p>Tratamiento</p>
                  <InputTextarea
                    placeholder="Medicamentos y dosis..."
                    autoResize
                    value={tratamiento}
                    onChange={(e) => setTratamiento(e.target.value)}
                    rows={5}
                    className={erroresConsulta.tratamiento ? 'p-invalid' : ''}
                  />
                  {erroresConsulta.tratamiento && <small className="p-error">Este campo es obligatorio</small>}
                </div>

                <div className="campoConsulta">
                  <p>Recomendaciones</p>
                  <InputTextarea
                    placeholder="Recomendaciones para el paciente..."
                    autoResize
                    value={recomendaciones}
                    onChange={(e) => setRecomendaciones(e.target.value)}
                    rows={5}
                  />
                </div>

                <div className="campoConsulta">
                  <p>Notas adicionales</p>
                  <InputTextarea
                    placeholder="Observaciones adicionales..."
                    autoResize
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    rows={5}
                  />
                </div>

                <button className="btnGuardarConsulta" 
                    onClick={() => {
                    if (handleGuardarConsulta()) {
                      setMostrarPDF(true);
                    }
                  }}>
                  <GrDocumentText /> Guardar consulta
                </button>
                <Dialog
                  header="Vista previa de receta"
                  visible={mostrarPDF}
                  onHide={() => setMostrarPDF(false)}
                  style={{ width: '90vw' }}
                  modal
                  maximizable
                >
                  <div style={{ height: '80vh' }}>
                    <PDFViewer width="100%" height="100%">
                      <RecetaPDF
                        paciente={paciente}
                        presion={presion}
                        frecuencia={frecuencia}
                        temperatura={temperatura}
                        saturacion={saturacion}
                        diagnostico={diagnostico}
                        sintomas={sintomas}
                        tratamiento={tratamiento}
                        recomendaciones={recomendaciones}
                        notas={notas}
                      />
                    </PDFViewer>
                  </div>
                </Dialog>

              </div>

            <HistorialMedico />

         </div>
      </div>
    </div>
  </div>
);
}