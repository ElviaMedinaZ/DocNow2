/*
 * Descripción: Implementacion de la vista recuperar contrasena
 * Fecha: 11 Junio de 2025
 * Programador: Elvia Medina
 */
import emailjs from '@emailjs/browser';
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

const SERVICE_ID = 'service_65rd83l';
const TEMPLATE_ID = 'template_wuod5gm';
const PUBLIC_KEY = '8J117Gf1Z6t3c785m';
const correoReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RecuperarContrasena() {
  const [correo, setCorreo] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

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
      // Verificar si el correo está registrado en Firestore
      const usuariosRef = collection(db, 'usuarios');
      const q = query(usuariosRef, where('email', '==', correo));
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

      // Generar código
      const codigo = Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem('codigoRecuperacion', codigo.toString());
      localStorage.setItem('correoRecuperacion', correo);

      const templateParams = {
        email: correo,
        passcode: codigo,
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);

      await MySwal.fire({
        icon: 'success',
        title: 'Código enviado',
        text: `Revisa tu correo para continuar con el proceso.`,
        confirmButtonColor: '#0A3B74',
      });

      navigate('/verificar-codigo');
    } catch (err) {
      console.error('Error al enviar código:', err);
      await MySwal.fire({
        icon: 'error',
        title: 'Error al enviar',
        text: 'No se pudo enviar el código. Intenta más tarde.',
        confirmButtonColor: '#0A3B74',
      });
    }
  };

  return (
    <div className="recuperar-container">
      <div className="recuperar-card p-fluid">
        <h2 className="recuperar-titulo">Recuperar contraseña</h2>
        <p>Ingresa tu correo y te enviaremos un código de verificación.</p>

        <InputText
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className={`recuperar-input ${error ? 'p-invalid' : ''}`}
          maxLength={40}
        />

        <Button
          label="Enviar código"
          onClick={manejarEnvio}
          className="recuperar-boton"
        />
      </div>
    </div>
  );
}
