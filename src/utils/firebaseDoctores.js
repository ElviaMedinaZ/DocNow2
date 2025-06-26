import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Cargar doctores desde Firestore con conteo único de pacientes y datos por defecto.
 */
export const cargarDoctoresDesdeFirestore = async () => {
  const snapshot = await getDocs(collection(db, 'usuarios'));
  const citasSnap = await getDocs(collection(db, 'citas'));

  // Mapa de doctorId -> Set de pacientes únicos
  const pacientesPorDoctor = {};
  citasSnap.forEach(doc => {
    const { doctorId, pacienteId } = doc.data();
    if (!pacientesPorDoctor[doctorId]) pacientesPorDoctor[doctorId] = new Set();
    pacientesPorDoctor[doctorId].add(pacienteId);
  });

  const doctores = [];
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    if (data.rol === 'Doctor') {
      doctores.push({
        id: docSnap.id,
        nombre: data.nombres || 'Sin nombre',
        especialidad: data.especialidad || null,
        estado: data.estado || 'Activo',
        servicios: (data.Servicios || '').split(',').map(s => s.trim()).filter(Boolean),
        turno: data.turnoHora || 'Matutino',
        consultorio: data.consultorio?.toString() || '1A',
        pacientes: pacientesPorDoctor[docSnap.id]?.size || 0
      });
    }
  });

  return doctores;
};

/**
 * Actualizar cualquier campo de un doctor.
 */
export const actualizarDoctor = async (id, campos) => {
  try {
    const ref = doc(db, 'usuarios', id);
    await updateDoc(ref, campos);
  } catch (e) {
    console.error('Error actualizando doctor:', e);
  }
};

/**
 * Obtener lista de servicios disponibles desde Firestore.
 */
export const obtenerServiciosDesdeFirestore = async () => {
  const ref = collection(db, 'Servicios');
  const snapshot = await getDocs(ref);
  const servicios = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.Servicio) {
      servicios.push(data.Servicio);
    }
  });
  return servicios;
};

/**
 * Actualizar lista de servicios de un doctor (como string separado por coma).
 */
export const actualizarServiciosDoctor = async (doctorId, nuevosServicios) => {
  try {
    const docRef = doc(db, 'usuarios', doctorId);
    await updateDoc(docRef, {
      Servicios: nuevosServicios.join(',') // Guarda como string
    });
  } catch (error) {
    console.error('Error actualizando servicios del doctor:', error);
  }
};
