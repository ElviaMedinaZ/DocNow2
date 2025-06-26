/*
 * Descripción: Componente de administración de doctores.
 * Fecha: 22 Junio de 2025
 * Programador: Elvia Medina
 */

import { useEffect, useRef, useState } from 'react';
import { FaEllipsisV, FaPlus, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../../styles/admin/admin-base.css';
import '../../styles/admin/doctores-admin.css';
import RegistroWeb from '../medico/registro-medico';
import GenericTable from './tabla-generica';
import {
  cargarDoctoresDesdeFirestore,
  actualizarDoctor,
  obtenerServiciosDesdeFirestore,
  actualizarServiciosDoctor,
  obtenerDoctorPorId
} from '../../utils/firebaseDoctores';


export default function DoctoresAdmin() {
  const [doctores, setDoctores] = useState([]);
  const [catalogoServicios, setCatalogoServicios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenu] = useState(null);
  const [modalAbierto, setModal] = useState(false);
  const [doctorEditando, setEditando] = useState(null);
  
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const cargar = async () => {
      const [doctoresFirestore, servicios] = await Promise.all([
        cargarDoctoresDesdeFirestore(),
        obtenerServiciosDesdeFirestore()
      ]);
      setDoctores(doctoresFirestore);
      setCatalogoServicios(servicios);
    };
    cargar();
  }, []);

  const toggleMenu = (id) => setMenu((prev) => (prev === id ? null : id));
  const cerrarModal = () => { setModal(false); setEditando(null); setMenu(null); };

  const eliminar = (id) => {
    const doctor = doctores.find((d) => d.id === id);
    Swal.fire({
      title: '¿Eliminar doctor?',
      text: `Se eliminará a ${doctor?.nombre}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b52020',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((r) => {
      if (r.isConfirmed) {
        setDoctores((prev) => prev.filter((d) => d.id !== id));
        Swal.fire({ title: 'Eliminado', icon: 'success', timer: 1500, showConfirmButton: false });
      }
    });
  };

  const toggleEstado = async (id) => {
    const d = doctores.find((dx) => dx.id === id);
    const nuevo = d.estado === 'Activo' ? 'Inactivo' : 'Activo';
    const r = await Swal.fire({
      title: `¿Cambiar estado a ${nuevo}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    });
    if (r.isConfirmed) {
      await actualizarDoctor(id, { estado: nuevo });
      setDoctores((prev) => prev.map((dx) => (dx.id === id ? { ...dx, estado: nuevo } : dx)));
    }
  };

  const toggleTurno = async (id) => {
    const d = doctores.find((dx) => dx.id === id);
    const nuevoTurno = d.turno === 'Matutino' ? 'Vespertino' : 'Matutino';
    const r = await Swal.fire({
      title: `¿Cambiar turno a ${nuevoTurno}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    });
    if (r.isConfirmed) {
      await actualizarDoctor(id, { turnoHora: nuevoTurno });
      setDoctores((prev) => prev.map((dx) => (dx.id === id ? { ...dx, turno: nuevoTurno } : dx)));
    }
  };

  const cambiarConsultorio = (id) => {
    const d = doctores.find((dx) => dx.id === id);
    const consultorios = [];
    for (let i = 1; i <= 10; i++) {
      for (let j = 'A'.charCodeAt(0); j <= 'D'.charCodeAt(0); j++) {
        consultorios.push(`${i}${String.fromCharCode(j)}`);
      }
    }
    Swal.fire({
      title: 'Seleccionar Consultorio',
      input: 'select',
      inputOptions: consultorios.reduce((acc, c) => { acc[c] = c; return acc; }, {}),
      inputPlaceholder: 'Seleccione un consultorio',
      showCancelButton: true,
      inputValue: d.consultorio,
    }).then(async (r) => {
      if (r.isConfirmed) {
        await actualizarDoctor(id, { consultorio: r.value });
        setDoctores((prev) => prev.map((dx) => (dx.id === id ? { ...dx, consultorio: r.value } : dx)));
      }
    });
  };

  const gestionarServicios = (id) => {
    const doctor = doctores.find((d) => d.id === id);
    const htmlChecks = catalogoServicios.map(
      (svc, i) =>
        `<div style="text-align:left;margin:4px 0">
           <input type="checkbox" id="svc_${i}" ${doctor.servicios.includes(svc) ? 'checked' : ''}>
           <label for="svc_${i}" style="margin-left:6px">${svc}</label>
         </div>`
    ).join('');
    Swal.fire({
      title: `Servicios de ${doctor.nombre}`,
      html: htmlChecks,
      focusConfirm: false,
      width: 400,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      preConfirm: () => {
        return catalogoServicios.filter((_, i) => document.getElementById(`svc_${i}`).checked);
      },
    }).then(async (r) => {
      if (r.isConfirmed) {
        await actualizarServiciosDoctor(id, r.value);
        setDoctores((prev) => prev.map((d) => (d.id === id ? { ...d, servicios: r.value } : d)));
      }
    });
  };

 
  const abrirEditar = async (row) => {
  const datosActualizados = await obtenerDoctorPorId(row.id);
  if (datosActualizados) {
    setEditando(datosActualizados);
    setModal(true);
  } else {
    Swal.fire('Error', 'No se pudo cargar la información del doctor.', 'error');
  }
};

  const abrirNuevo = () => {
  setEditando(null);
  setModal(true);
};


  const onSave = async (payload, modo) => {
    if (modo === 'editar') {
      await actualizarDoctor(payload.id, payload);
      setDoctores((prev) => prev.map((d) => (d.id === payload.id ? payload : d)));
    } else {
      const nuevo = { ...payload, id: Date.now(), servicios: [], turno: 'Matutino', consultorio: '1A' };
      await actualizarDoctor(nuevo.id, nuevo);
      setDoctores((prev) => [...prev, nuevo]);
    }
    cerrarModal();
  };

  const filtrados = doctores.filter((d) =>
    `${d.nombre} ${d.especialidad} ${d.estado}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const columns = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Especialidad', accessor: 'especialidad' },
    { header: 'Pacientes', accessor: 'pacientes' },
    {
      header: 'Servicios',
      accessor: (d) => <span>{d.servicios.length}</span>,
    },
    {
      header: 'Estado',
      accessor: (d) => (
        <span className={`estado-tag ${d.estado === 'Activo' ? 'activo' : 'inactivo'}`}>
          {d.estado}
        </span>
      ),
    },
    {
      header: 'Turno',
      accessor: (d) => (
        <span className={`turno-tag ${d.turno === 'Matutino' ? 'matutino' : 'vespertino'}`}>
          {d.turno}
        </span>
      ),
    },
    {
      header: 'Consultorio',
      accessor: (d) => d.consultorio,
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
              <button onClick={() => abrirEditar(row)}>Editar</button>
              <button onClick={() => gestionarServicios(row.id)}>Servicios</button>
              <button onClick={() => toggleEstado(row.id)}>
                {row.estado === 'Activo' ? 'Inactivar' : 'Activar'}
              </button>
              <button onClick={() => toggleTurno(row.id)}>Cambiar Turno</button>
              <button onClick={() => cambiarConsultorio(row.id)}>Cambiar Consultorio</button>
              <button className="eliminar" onClick={() => eliminar(row.id)}>Eliminar</button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="admin-doctores-container">
      <div className="admin-doctores-header">
        <h2>Gestión de Doctores</h2>
        <button className="btn-agregar" onClick={abrirNuevo}>
          <FaPlus /> Agregar Doctor
        </button>
      </div>

      <div className="busqueda-doctores">
        <FaSearch />
        <input
          type="text"
          placeholder="Buscar por nombre, especialidad o estado..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <GenericTable
        columns={columns}
        data={filtrados}
        emptyMsg="Sin resultados"
        footer={`Mostrando ${filtrados.length} de ${doctores.length} doctores`}
      />

      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar-modal" onClick={cerrarModal}>×</button>
            {typeof RegistroWeb === 'function' ? (
              <RegistroWeb
                modo={doctorEditando ? 'editar' : 'crear'}
                datosIniciales={doctorEditando}
                onSave={onSave}
                onClose={cerrarModal}
              />
            ) : (
              <div>Error: Componente RegistroWeb no cargado</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

