// src/utils/firebasePacientes.js
import { collection, getDocs, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const calcularEdad = (fechaNacimiento) => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
};

export const cargarPacientesDesdeFirestore = async () => {
  const usuariosSnap = await getDocs(collection(db, 'usuarios'));
  const citasSnap = await getDocs(collection(db, 'citas'));

  // Mapeamos pacienteId -> fecha más reciente
  const ultimasVisitas = {};

  citasSnap.forEach(docSnap => {
    const data = docSnap.data();
    const { pacienteId, fecha } = data;
    if (!pacienteId || !fecha) return;

    if (!ultimasVisitas[pacienteId] || new Date(fecha) > new Date(ultimasVisitas[pacienteId])) {
      ultimasVisitas[pacienteId] = fecha;
    }
  });

  const pacientes = [];
  usuariosSnap.forEach(docSnap => {
    const data = docSnap.data();
    if (data.rol === 'Paciente') {
      const id = docSnap.id;
      pacientes.push({
        id,
        nombre: data.nombres || '',
        edad: data.fechaNacimiento ? calcularEdad(data.fechaNacimiento) : '',
        sexo: data.sexo || '',
        telefono: data.telefono || '',
        ultimaVisita: ultimasVisitas[id] || 'Sin citas',
        estado: data.estado || 'Activo',
        fotoPerfil: data.fotoPerfil || '', // ✅ Usando el campo correcto
        });
    }
  });

  return pacientes;
};
