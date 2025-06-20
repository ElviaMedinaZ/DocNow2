import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import '../../styles/medico/Home-medico.css';                      // opcional

export default function HomeMedico() {
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (e) {
      console.error('Error al cerrar sesión', e);
    }
  };

  return (
    <div className="home-medico-container">
      <header className="home-header">
        <h2>DocNow — Panel Médico</h2>

        <button className="logout-btn" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </header>

      <main className="home-main">
        <h1>Iniciaste sesión como <span className="rol">Médico</span></h1>
      </main>
    </div>
  );
}
