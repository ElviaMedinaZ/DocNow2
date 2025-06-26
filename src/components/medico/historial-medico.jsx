/*
 * Descripción: Implementación de la vista de historial medica
 * Fecha: 23 Junio de 2025
 * Programador: Irais Reyes
 */

import { useState } from "react";
import { MdHistory } from "react-icons/md";
import '../../styles/medico/HistorialMedico.css';

export default function HistorialMedico() {
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
      historial: [
        {
          medico: 'Dr. Carlos Mendoza',
          especialidad: 'Medicina General',
          fecha: '1/1/2024',
          diagnostico: 'Gripe común',
          tratamiento: 'Paracetamol, reposo, hidratación',
          sintomas: 'Fiebre, dolor de garganta, congestión nasal',
          notas: 'Recuperación completa en 7 días'
        },
        {
          medico: 'Dr. Ana Rodríguez',
          especialidad: 'Dermatología',
          fecha: '9/12/2023',
          diagnostico: 'Dermatitis de contacto',
          tratamiento: 'Crema con corticoides, evitar alérgenos',
          sintomas: 'Erupción cutánea en brazos',
          notas: 'Mejoría notable en 2 semanas'
        }
      ]
    },
  ];

  const [paciente] = useState(pacientes[0]);

  return (
    <div className="tarjetaHistorial">
        <h2><MdHistory /> Historial médico</h2>

        {paciente.historial.map((registro, index) => (
            <div className="contenidoHistorial" key={index}>
            <div className="headerHistorial">
                <div className="infoDoctor">
                <h4 className="nombreDoctor">{registro.medico}</h4>
                <p className="especialidadDoctor">{registro.especialidad}</p>
                </div>
                <p className="fechaHistorial">{registro.fecha}</p>
            </div>

            <div className="gridHistorial">
                <div className="columnaHistorial">
                <p className="tituloCampo">Diagnóstico:</p>
                <p>{registro.diagnostico}</p>

                <p className="tituloCampo">Tratamiento:</p>
                <p>{registro.tratamiento}</p>
                </div>

                <div className="columnaHistorial">
                <p className="tituloCampo">Síntomas:</p>
                <p>{registro.sintomas}</p>

                <p className="tituloCampo">Notas:</p>
                <p>{registro.notas}</p>
                </div>
            </div>
            </div>
        ))}
    </div>
  );
}
