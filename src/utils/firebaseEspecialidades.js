// src/utils/firebaseEspecialidades.js

import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'; // <-- agrega deleteDoc


import { db } from '../lib/firebase';

export const obtenerEspecialidades = async () => {
  try {
    const ref = collection(db, 'Especialidades');
    const querySnapshot = await getDocs(ref);

    const especialidades = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      label: data.Especialidad || doc.id,
      value: doc.id,
      descripcion: data.descripcion || 'Sin descripción',
      Estado: data.Estado || 'Activo',
      FotoUrl: data.FotoUrl || ''
    };
  });


    return especialidades;
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    return [];
  }
};

export const guardarEspecialidadEnFirebase = async (especialidad) => {
  try {
    await setDoc(doc(db, 'Especialidades', especialidad.nombre), {
      Especialidad: especialidad.nombre,
      descripcion: especialidad.descripcion || 'Sin descripción',
      Estado: especialidad.estado || 'Activo',
      FotoUrl: especialidad.fotoUrl?.trim() || '',
    });
  } catch (error) {
    console.error('Error al guardar especialidad:', error);
    throw error;
  }
};

export const eliminarEspecialidadDeFirebase = async (id) => {
  try {
    const ref = doc(db, 'Especialidades', id);
    await deleteDoc(ref);
  } catch (error) {
    console.error('Error al eliminar especialidad:', error);
    throw error;
  }
};
