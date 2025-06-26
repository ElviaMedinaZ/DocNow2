/*
 * Descripción: Componente de administración para gestionar pacientes.
 * Fecha: 23 Junio de 2025
 * Programador: Elvia Medina
 */

import { useEffect, useRef, useState } from 'react';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../../styles/admin/admin-base.css';
import RegistroPaciente from '../paciente/registro-paciente';
import GenericTable from './tabla-generica';
import { cargarPacientesDesdeFirestore } from '../../utils/firebasePaciente';
import {updateDoc, doc, getDoc ,deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';



export default function PacientesAdmin() {
  const [pacs, setPacs] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenu] = useState(null);
  const [modalAbierto, setModal] = useState(false);
  const [pacEdit, setEdit] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const cargar = async () => {
      const datos = await cargarPacientesDesdeFirestore();
      setPacs(datos);
    };
    cargar();
  }, []);


  const toggleMenu = (id) => setMenu((prev) => (prev === id ? null : id));
  const cerrarModal = () => { setModal(false); setEdit(null); setMenu(null); };

  const eliminar = async (id) => {
  const reg = pacs.find((p) => p.id === id);
    if (!reg) return;

    const confirm = await Swal.fire({
      title: '¿Eliminar paciente?',
      text: `Se eliminará a ${reg.nombre}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b52020',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteDoc(doc(db, 'usuarios', id));

        setPacs((prev) => prev.filter((p) => p.id !== id));

        Swal.fire({
          title: 'Eliminado',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Error al eliminar paciente:', error);
        Swal.fire('Error', 'No se pudo eliminar el paciente de Firebase.', 'error');
      }
    }
  };


  const toggleEstado = async (id) => {
  const paciente = pacs.find((p) => p.id === id);
  if (!paciente) {
    return Swal.fire({ title: 'Paciente no encontrado', icon: 'error' });
  }

  const nuevo = paciente.estado === 'Activo' ? 'Inactivo' : 'Activo';

  const confirm = await Swal.fire({
    title: `¿Cambiar estado a ${nuevo}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, cambiar',
    cancelButtonText: 'Cancelar',
  });

  if (confirm.isConfirmed) {
    try {
      await updateDoc(doc(db, 'usuarios', id), { estado: nuevo });

      setPacs((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado: nuevo } : p))
      );

      Swal.fire('Estado actualizado', `El paciente ahora está ${nuevo}.`, 'success');
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      Swal.fire('Error', 'No se pudo actualizar el estado en Firebase.', 'error');
    }
  }
};

  const abrirNuevo = () => { setEdit(null); setModal(true); };
  const abrirEditar = async (row) => {
  try {
    const docRef = doc(db, 'usuarios', row.id);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const datos = snap.data();

      setEdit({
        id: row.id,
        nombres: datos.nombres || '',
        apellidoP: datos.apellidoP || '',
        apellidoM: datos.apellidoM || '',
        curp: datos.curp || '',
        sexo: datos.sexo || '',
        fechaNacimiento: datos.fechaNacimiento || '',
        estadoCivil: datos.estadoCivil || '',
        correoElectronico: datos.email || datos.correoElectronico || '',
        telefono: datos.telefono || '',
        rol: datos.rol || 'Paciente',
        fotoPerfil: datos.fotoPerfil || datos.fotoUrl || '',
      });

      setModal(true);
    } else {
      Swal.fire('Error', 'No se encontró el paciente en Firestore.', 'error');
    }
  } catch (err) {
    console.error('Error al cargar paciente:', err);
    Swal.fire('Error', 'Hubo un problema al cargar los datos.', 'error');
  }
};

  const onSave = (payload, modo) => {
    setPacs((prev) =>
      modo === 'editar'
        ? prev.map((p) => (p.id === payload.id ? payload : p))
        : [...prev, { ...payload, id: Date.now() }]
    );
    cerrarModal();
  };

  const filtrados = pacs.filter((p) =>
    `${p.nombre} ${p.telefono} ${p.sexo} ${p.estado}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const columns = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Edad', accessor: (p) => `${p.edad} años` },
    { header: 'Sexo', accessor: 'sexo' },
    { header: 'Teléfono', accessor: 'telefono' },
    { header: 'Última Visita', accessor: 'ultimaVisita' },
    {
      header: 'Estado',
      accessor: (p) => (
        <span className={`estado-tag ${p.estado === 'Activo' ? 'activo' : 'inactivo'}`}>
          {p.estado}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: (row) => (
        <div className="acciones-wrapper">
          <button className="btn-acciones" onClick={() => toggleMenu(row.id)}>
            <FaEllipsisV />
          </button>
          {menuAbierto === row.id && (
            <div className="menu-acciones" ref={menuRef}>
              <button onClick={() => console.log(`Ver historial de ${row.nombre}`)}>Ver historial</button>
              <button onClick={() => abrirEditar(row)}>Editar</button>
              <button onClick={() => console.log(`Agendar cita para ${row.nombre}`)}>Agendar cita</button>
              <button onClick={() => toggleEstado(row.id)}>
                {row.estado === 'Activo' ? 'Inactivar' : 'Activar'}
              </button>
              <button className="eliminar" onClick={() => eliminar(row.id)}>Eliminar</button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="admin-pacientes-container">
      <div className="admin-pacientes-header">
        <h2>Gestión de Pacientes</h2>
        <button className="btn-agregar" onClick={abrirNuevo}>
          <FaPlus /> Agregar Paciente
        </button>
      </div>

      <div className="buscador-pacientes">
        <FaSearch />
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono, sexo o estado..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <GenericTable
        columns={columns}
        data={filtrados}
        emptyMsg="Sin resultados"
        footer={`Mostrando ${filtrados.length} de ${pacs.length} pacientes`}
      />

      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar-modal" onClick={cerrarModal}>×</button>
            <RegistroPaciente
              modo={pacEdit ? 'editar' : 'crear'}
              datosIniciales={pacEdit}
              onSave={onSave}
              onClose={cerrarModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
