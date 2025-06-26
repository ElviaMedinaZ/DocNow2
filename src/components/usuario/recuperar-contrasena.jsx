/*
 * Descripción: Implementación de recuperación de contraseña con Firebase Auth
 * Fecha: 11 Junio de 2025
 * Programador: Elvia Medina
 */

import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { db } from '../../lib/firebase';
import '../../styles/usuario/recuperar-contrasena.css';

const MySwal = withReactContent(Swal);
const correoReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RecuperarContrasena() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState(false);

  const manejarEnvio = async () => {
    setError(false);

    if (!correo || !correoReg.test(correo)) {
      setError(true);
      await MySwal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Ingresa un correo electrónico válido.',
        confirmButtonColor: '#0A3B74',
      });
      return;
    }

    try {
      // Verificar si el correo existe en Firestore (opcional)
      const usuariosRef = collection(db, 'usuarios');
      const q = query(usuariosRef, where('correoElectronico', '==', correo));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await MySwal.fire({
          icon: 'error',
          title: 'Correo no registrado',
          text: 'Este correo no pertenece a ningún usuario.',
          confirmButtonColor: '#0A3B74',
        });
        return;
      }

      // Configurar el enlace personalizado
      const auth = getAuth();
      const actionCodeSettings = {
        url: 'https://doc-now2.vercel.app/nueva-contrasena',
        handleCodeInApp: true,
      };

      await sendPasswordResetEmail(auth, correo, actionCodeSettings);

      await MySwal.fire({
        icon: 'success',
        title: 'Correo enviado',
        text: 'Te hemos enviado un enlace para restablecer tu contraseña.',
        confirmButtonColor: '#0A3B74',
      });

      setCorreo('');
      navigate('/login');
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
      await MySwal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el correo. Intenta más tarde.',
        confirmButtonColor: '#0A3B74',
      });
    }
  };

  return (
    <div className="recuperar-container">
      <div className="recuperar-card p-fluid">
        <h2 className="recuperar-titulo">Recuperar contraseña</h2>
        <p>Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>

        <InputText
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className={`recuperar-input ${error ? 'p-invalid' : ''}`}
          maxLength={40}
        />

        <Button
          label="Enviar enlace"
          onClick={manejarEnvio}
          className="recuperar-boton"
        />
      </div>
    </div>
  );
}
