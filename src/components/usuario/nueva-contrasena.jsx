/*
 * Descripción: Vista nueva contrasena
 * Fecha: 25 Junio de 2025
 * Programador: Elvia Medina
 */

import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/usuario/nueva-contrasena.css';

export default function NuevaContrasena() {
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const correo = localStorage.getItem('correoRecuperacion');
    if (!correo) {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso inválido',
        text: 'Primero debes verificar tu código.',
        confirmButtonColor: '#0A3B74',
      }).then(() => navigate('/recuperar-contrasena'));
    }
  }, [navigate]);

  const manejarCambio = async () => {
    if (nuevaContrasena !== confirmar) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        confirmButtonColor: '#0A3B74'
      });
      return;
    }

    await Swal.fire({
      icon: 'success',
      title: 'Contraseña actualizada',
      text: 'Tu contraseña ha sido restablecida.',
      confirmButtonColor: '#0A3B74'
    });

    localStorage.removeItem('correoRecuperacion');

    navigate('/login');
  };

  return (
    <div className="nueva-container">
      <div className="nueva-card">
        <h2 className="nueva-titulo">Nueva contraseña</h2>
           <img
          src="https://sso-men.test.espinlabs.com.ar/frontend/images/recuperar-new.png"
          alt="Candado"
          className="nueva-imagen"
        />

        <div className="nueva-input-group">
          <Password
            placeholder="Nueva contraseña"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            toggleMask
            feedback={false}
            className="nueva-input"
          />
        </div>

        <div className="nueva-input-group">
          <Password
            placeholder="Confirmar contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            toggleMask
            feedback={false}
            className="nueva-input"
          />
        </div>

        <Button
          label="Guardar"
          onClick={manejarCambio}
          className="nueva-boton"
        />
      </div>
    </div>
  );
}
