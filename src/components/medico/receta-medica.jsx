/**
 * Descripción: Implementación de la receta médica en pdf
 * Fecha: 24 Junio de 2025
 * Programador: Irais Reyes
 */

import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from '@react-pdf/renderer';
import logo from '../../assets/logo.png';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: '#333',
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  textoMarca: {
    flexDirection: 'column',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0a3b74',
  },
  subtitulo: {
    fontSize: 12,
    color: '#555',
  },
  infoDerecha: {
    textAlign: 'right',
  },
  tituloEncabezado: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  seccion: {
    marginTop: 12,
  },
  gridPaciente: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  gridVitales: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  marginTop: 8,
  gap: 8,
  },

  columnaVital: {
    width: '24%', 
    minWidth: '24%',
  },
  columna: {
    width: '48%',
    marginBottom: 8,
  },
  etiqueta: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dato: {
    marginBottom: 6,
  },
  tagAlergia: {
    backgroundColor: '#f44336',
    color: 'white',
    padding: 4,
    borderRadius: 12,
    fontWeight: 'bold',
    width: 'auto',
  },
  tituloSeccion: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1a1a1a',
  },
  cajaResultado: {
    padding: 10,
    borderLeftWidth: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  diagnostico: {
    borderLeftColor: '#fcd34d',
    backgroundColor: '#fef9c3',
  },
  sintoma: {
    borderLeftColor: '#fca5a5',
    backgroundColor: '#fee2e2',
  },
  tratamiento: {
    borderLeftColor: '#86efac',
    backgroundColor: '#dcfce7',
  },
  recomendacion: {
    borderLeftColor: '#93c5fd',
    backgroundColor: '#dbeafe',
  },
  notas: {
    borderLeftColor: '#c4b5fd',
    backgroundColor: '#ede9fe',
  },
  seccionMedico: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#e6f0ff',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  firma: {
    textAlign: 'right',
    fontSize: 12,
  },
  pie: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

const RecetaPDF = ({
  paciente,
  presion,
  frecuencia,
  temperatura,
  saturacion,
  diagnostico,
  sintomas,
  tratamiento,
  recomendaciones,
  notas,
  fecha = "24 de junio de 2025",
}) => (
  
 <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.encabezado}>
        <View style={styles.logoContainer}>
          <Image src={logo} style={styles.logo} />
          <View style={styles.textoMarca}>
            <Text style={styles.titulo}>DocNow</Text>
            <Text style={styles.subtitulo}>Sistema Médico Integral</Text>
          </View>
        </View>
        <View style={styles.infoDerecha}>
          <Text style={styles.tituloEncabezado}>RECETA MÉDICA</Text>
          <Text>No. RX-811052</Text>
          <Text>{fecha}</Text>
        </View>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}> Información del Paciente</Text>
        <View style={styles.gridPaciente}>
          <View style={styles.columna}>
            <Text style={styles.etiqueta}>Nombre completo:</Text>
            <Text style={styles.dato}>{paciente.nombres} {paciente.apellidoP} {paciente.apellidoM}</Text>

            <Text style={styles.etiqueta}>Tipo de sangre:</Text>
            <Text style={styles.dato}>{paciente.tipoSangre}</Text>

            <Text style={styles.etiqueta}>Estatura:</Text>
            <Text style={styles.dato}>{paciente.estatura} cm</Text>

            <Text style={styles.etiqueta}>Alergias:</Text>
            <Text style={styles.tagAlergia}>{paciente.alergias}</Text>
          </View>

          <View style={styles.columna}>
            <Text style={styles.etiqueta}>Edad:</Text>
            <Text style={styles.dato}>{paciente.edad}</Text>

            <Text style={styles.etiqueta}>Peso:</Text>
            <Text style={styles.dato}>{paciente.peso}</Text>

            <Text style={styles.etiqueta}>Teléfono:</Text>
            <Text style={styles.dato}>{paciente.telefono}</Text>
          </View>
        </View>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}> Signos Vitales</Text>
        <View style={styles.gridVitales}>
          <View style={styles.columnaVital}>
            <Text style={styles.etiqueta}>Presión arterial:</Text>
            <Text style={styles.dato}>{presion || 'No registrada'}</Text>
          </View>
          <View style={styles.columnaVital}>
            <Text style={styles.etiqueta}>Frecuencia cardiaca:</Text>
            <Text style={styles.dato}>{frecuencia || 'No registrada'}</Text>
          </View>
          <View style={styles.columnaVital}>
            <Text style={styles.etiqueta}>Temperatura:</Text>
            <Text style={styles.dato}>{temperatura || 'No registrada'}</Text>
          </View>
          <View style={styles.columnaVital}>
            <Text style={styles.etiqueta}>Saturación O2:</Text>
            <Text style={styles.dato}>{saturacion || 'No registrada'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}> Sintomatología</Text>
        <View style={[styles.cajaResultado, styles.sintoma]}>
          <Text>{sintomas || 'No especificado'}</Text>
        </View>

        <Text style={styles.tituloSeccion}> Diagnóstico</Text>
        <View style={[styles.cajaResultado, styles.diagnostico]}>
          <Text>{diagnostico || 'No especificado'}</Text>
        </View>

        <Text style={styles.tituloSeccion}> Tratamiento</Text>
        <View style={[styles.cajaResultado, styles.tratamiento]}>
          <Text>{tratamiento || 'No especificado'}</Text>
        </View>

        <Text style={styles.tituloSeccion}> Recomendaciones</Text>
        <View style={[styles.cajaResultado, styles.recomendacion]}>
          <Text>{recomendaciones || 'No especificado'}</Text>
        </View>

        <Text style={styles.tituloSeccion}> Notas Adicionales</Text>
        <View style={[styles.cajaResultado, styles.notas]}>
          <Text>{notas || 'No hay notas adicionales.'}</Text>
        </View>
      </View>

      <View style={styles.seccionMedico}>
        <View>
          <Text style={styles.etiqueta}>Dr. María González</Text>
          <Text>Cardiología</Text>
          <Text> +1 (555) 123-4567</Text>
          <Text> Consultorio 205, Hospital Central</Text>
        </View>
        <View style={styles.firma}>
          <Text>_________________________</Text>
          <Text>Firma del Médico</Text>
          <Text>Cédula Profesional: 12345678</Text>
        </View>
      </View>

      <View style={styles.pie}>
        <Text>
          Esta receta médica es válida por 30 días a partir de la fecha de emisión.
        </Text>
        <Text>
          Para cualquier consulta, contacte al médico tratante o al hospital.
        </Text>
        <Text>Generado el {fecha}</Text>
      </View>
    </Page>
  </Document>
);

export default RecetaPDF;