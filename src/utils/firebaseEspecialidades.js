// src/utils/firebaseEspecialidades.js

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const obtenerEspecialidades = async () => {
  try {
    const ref = collection(db, 'Especialidades');
    const querySnapshot = await getDocs(ref);

    const especialidades = querySnapshot.docs.map((doc) => ({
      label: doc.id,   // o puedes usar: doc.data().Especialidad
      value: doc.id
    }));

    return especialidades;
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    return [];
  }
};
