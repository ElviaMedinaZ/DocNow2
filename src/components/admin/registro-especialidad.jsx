import { useEffect, useState } from 'react';

export default function RegistroEspecialidad({ modo, datosIniciales, onSave, onClose }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (datosIniciales) {
      setNombre(datosIniciales.nombre || '');
      setDescripcion(datosIniciales.descripcion || '');
    }
  }, [datosIniciales]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: datosIniciales?.id || Date.now(),
      nombre,
      descripcion,
      estado: datosIniciales?.estado || 'Activo',
    };
    onSave(payload, modo);
  };

  return (
    <form onSubmit={handleSubmit} className="form-especialidad">
      <h3>{modo === 'editar' ? 'Editar Especialidad' : 'Nueva Especialidad'}</h3>

      <label>
        Especialidad:
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </label>

      <label>
        Descripción:
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
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
