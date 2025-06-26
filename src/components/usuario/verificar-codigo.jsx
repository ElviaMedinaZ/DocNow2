/*
 * Descripción: ,Implementacion de la vista verificar codigo
 * Fecha: 25 Junio de 2025
 * Programador: Elvia Medina
 */

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/usuario/recuperar-contrasena.css';

export default function VerificarCodigo() {
  const [codigoIngresado, setCodigoIngresado] = useState('');
  const [correo, setCorreo] = useState('');
  const [codigoCorrecto, setCodigoCorrecto] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const correoLS = localStorage.getItem('correoRecuperacion');
    const codigoLS = localStorage.getItem('codigoRecuperacion');

    if (!correoLS || !codigoLS) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Debes volver a solicitar el código.',
        confirmButtonColor: '#0A3B74',
      }).then(() => navigate('/recuperar-contrasena'));
      return;
    }

    setCorreo(correoLS);
    setCodigoCorrecto(codigoLS);
  }, [navigate]);

  const manejarVerificacion = async () => {
    if (codigoIngresado === codigoCorrecto) {
      localStorage.removeItem('codigoRecuperacion');

      await Swal.fire({
        icon: 'success',
        title: 'Código verificado',
        text: 'Puedes crear una nueva contraseña.',
        confirmButtonColor: '#0A3B74',
      });

      navigate('/nueva-contrasena');
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Código incorrecto',
        text: 'El código ingresado no es válido.',
        confirmButtonColor: '#0A3B74',
      });
    }
  };

  return (
    <div className="recuperar-container">
      <div className="recuperar-card p-fluid">
        <h2 className="recuperar-titulo">Verificar código</h2>
        <p>Ingresa el código que enviamos a <strong>{correo}</strong>.</p>

        <InputText
          value={codigoIngresado}
          onChange={(e) => setCodigoIngresado(e.target.value)}
          maxLength={6}
          placeholder="Código de verificación"
          className="recuperar-input"
        />

        <Button
          label="Verificar"
          onClick={manejarVerificacion}
          className="recuperar-boton"
        />
      </div>
    </div>
  );
}
