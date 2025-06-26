/*
 * Descripción: Vista nueva contraseña
 * Fecha: 25 Junio de 2025
 * Programador: Elvia Medina
 */

import { confirmPasswordReset, getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../../styles/usuario/nueva-contrasena.css';

const MySwal = withReactContent(Swal);

const contrasenaSeguraReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

export default function NuevaContrasena() {
  const [searchParams] = useSearchParams();
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [oobCode, setOobCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('oobCode');
    if (code) {
      setOobCode(code);
    } else {
      MySwal.fire({
        icon: 'error',
        title: 'Código inválido',
        text: 'El enlace de recuperación no es válido o ha expirado.',
        confirmButtonColor: '#0A3B74',
      }).then(() => navigate('/login'));
    }
  }, []);

const manejarCambioContrasena = async () => {
  if (!nuevaContrasena || !confirmarContrasena) {
    await MySwal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Debes completar ambos campos de contraseña.',
      confirmButtonColor: '#0A3B74',
    });
    return;
  }

  if (nuevaContrasena !== confirmarContrasena) {
    await MySwal.fire({
      icon: 'warning',
      title: 'Las contraseñas no coinciden',
      confirmButtonColor: '#0A3B74',
    });
    return;
  }

  if (!contrasenaSeguraReg.test(nuevaContrasena)) {
    await MySwal.fire({
      icon: 'warning',
      title: 'Contraseña débil',
      text: 'Debe tener al menos 6 caracteres, incluyendo una mayúscula, una minúscula y un número.',
      confirmButtonColor: '#0A3B74',
    });
    return;
  }

  try {
    const auth = getAuth();
    await confirmPasswordReset(auth, oobCode, nuevaContrasena);

    await MySwal.fire({
      icon: 'success',
      title: 'Contraseña actualizada',
      text: 'Tu contraseña ha sido restablecida correctamente.',
      confirmButtonColor: '#0A3B74',
    });

    navigate('/login');
  } catch (error) {
    console.error('Error al confirmar contraseña:', error);
    await MySwal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo cambiar la contraseña. Intenta con un nuevo enlace.',
      confirmButtonColor: '#0A3B74',
    });
  }
};


  return (
    <div className="nueva-container">
      <div className="nueva-card p-fluid">
        <h2 className="nueva-titulo">Nueva contraseña</h2>
        <p>Ingresa tu nueva contraseña para restablecer el acceso.</p>

        <div className="nueva-input-group">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            className="nueva-input"
          />
        </div>

        <div className="nueva-input-group">
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            className="nueva-input"
          />
        </div>

        <button className="nueva-boton" onClick={manejarCambioContrasena}>
          Guardar contraseña
        </button>
      </div>
    </div>
  );
}
