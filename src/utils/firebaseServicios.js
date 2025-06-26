// src/utils/firebaseServicios.js

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Ajusta si tu ruta es diferente

export const obtenerServicios = async () => {
  try {
    const serviciosRef = collection(db, 'Servicios');
    const querySnapshot = await getDocs(serviciosRef);

    const servicios = querySnapshot.docs.map((docSnap, index) => {
      const data = docSnap.data();
      return {
        id: index + 1,
        nombre: docSnap.id.replace(/_/g, ' '),
        img: data.FotoUrl || '',
        precio: data.Precio || null,
        tipo: data.Servicio || '',
      };
    });

    return servicios;
  } catch (error) {
    console.error('Error obteniendo servicios:', error);
    return [];
  }
};
