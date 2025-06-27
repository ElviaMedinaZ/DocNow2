// utils/firebaseCitas.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { addDoc, Timestamp } from "firebase/firestore";


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

export const guardarCita = async (datosCita) => {
  if (!datosCita.nombre || !datosCita.fecha || !datosCita.hora) {
    throw new Error("Faltan datos obligatorios");
  }

  const nuevaCita = {
    ...datosCita,
    fechaCreacion: Timestamp.now(),
  };

  try {
    const docRef = await addDoc(collection(db, "citas"), nuevaCita);
    return docRef.id;
  } catch (error) {
    console.error("Error al guardar la cita:", error);
    throw new Error("Error al guardar la cita");
  }
};