// utils/firebaseCitas.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const obtenerCitasPaciente = async (pacienteId) => {
  const ref = collection(db, 'citas');
  const snapshot = await getDocs(ref);

  const citas = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.pacienteId === pacienteId) {
      citas.push({
        id: doc.id,
        ...data,
      });
    }
  });

  return citas;
};
