/**
 * Descripción: Formulario para registrar o editar un  servicio médico.
 * Fecha: 23 Junio de 2025
 * Programador: Elvia Medina
 */

import { useEffect, useState } from 'react';
export default function RegistroServicio({ modo, datosIniciales, onSave, onClose }) {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    if (datosIniciales) {
      setNombre(datosIniciales.nombre || '');
      setCategoria(datosIniciales.categoria || '');
      setPrecio(datosIniciales.precio || '');
    }
  }, [datosIniciales]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim() || !categoria.trim() || !precio) {
      return alert('Todos los campos son obligatorios');
    }

    const payload = {
      id: datosIniciales?.id || Date.now(),
      nombre,
      categoria,
      precio: parseFloat(precio),
      estado: datosIniciales?.estado || 'Activo',
    };

    onSave(payload, modo);
  };

  return (
    <form onSubmit={handleSubmit} className="form-servicio">
      <h3>{modo === 'editar' ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>

      <label>
        Nombre del Servicio:
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </label>

      <label>
        Categoría:
        <input
          type="text"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        />
      </label>

      <label>
        Precio (MXN):
        <input
          type="number"
          min="0"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
      </label>

      <div className="form-botones">
        <button type="submit" className="btn-guardar">Guardar</button>
        <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
      </div>
    </form>
  );
}
