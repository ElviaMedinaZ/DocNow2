// utils/firebaseCitas.js
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase"; // ajusta según tu estructura

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
