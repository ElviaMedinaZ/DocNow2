/**
 * Descripción: Vista de dashboard de Administrador
 * Fecha: 22 Junio de 2025
 * Programador: Elvia Medina
 */

import { useEffect, useState } from 'react';
import {
  FaCalendarCheck,
  FaStethoscope,
  FaUserInjured,
  FaUserMd,
} from 'react-icons/fa';

import styles from '../../styles/admin/admin-dashboard.module.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';


export default function AdminDashboard() {
  
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        // Total Pacientes
        const pacientesSnap = await getDocs(query(collection(db, 'usuarios'), where('rol', '==', 'Paciente')));
        const totalPacientes = pacientesSnap.size;

        // Total Doctores
        const doctoresSnap = await getDocs(query(collection(db, 'usuarios'), where('rol', '==', 'Doctor')));
        const totalDoctores = doctoresSnap.size;

        // Total Citas
        const citasSnap = await getDocs(collection(db, 'citas'));
        const totalCitas = citasSnap.size;

        // Total Especialidades
        const especialidadesSnap = await getDocs(collection(db, 'Especialidades'));
        const totalEspecialidades = especialidadesSnap.size;

        setStats([
          {
            id: 1,
            label: 'Total Pacientes',
            value: totalPacientes,
            subtitle: '',
            icon: <FaUserInjured />,
          },
          {
            id: 2,
            label: 'Total Doctores',
            value: totalDoctores,
            subtitle: '',
            icon: <FaUserMd />,
          },
          {
            id: 3,
            label: 'Citas Totales',
            value: totalCitas,
            subtitle: '',
            icon: <FaCalendarCheck />,
          },
          {
            id: 4,
            label: 'Especialidades',
            value: totalEspecialidades,
            subtitle: '',
            icon: <FaStethoscope />,
          },
        ]);
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      }
    };

    cargarEstadisticas();
  }, []);



  /* Datos demo */
  const [citasMensuales, setCitasMensuales] = useState([
    { mes: 'Ene', total: 65 },
    { mes: 'Feb', total: 78 },
    { mes: 'Mar', total: 92 },
    { mes: 'Abr', total: 88 },
    { mes: 'May', total: 105 },
    { mes: 'Jun', total: 128 },
  ]);

  const [especialidades, setEspecialidades] = useState([
    { nombre: 'Cardiología', total: 161, color: '#2d8cf0' },
    { nombre: 'Dermatología', total: 145, color: '#00c1a2' },
    { nombre: 'Pediatría', total: 102, color: '#e0b700' },
    { nombre: 'Neurología', total: 93, color: '#8c54ff' },
    { nombre: 'Ginecología', total: 79, color: '#ff4cc1' },
  ]);

  /* Demo: incrementa números cada 10 s */
  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      const curr = now.toLocaleString('es-ES', { month: 'short' }).slice(0, 3);

      // Citas por mes
      setCitasMensuales(prev =>
        prev.map(c =>
          c.mes.toLowerCase() === curr.toLowerCase()
            ? { ...c, total: c.total + 1 }
            : c
        )
      );

      // Especialidades
      setEspecialidades(prev => {
        const i = Math.floor(Math.random() * prev.length);
        return prev.map((e, idx) => (idx === i ? { ...e, total: e.total + 1 } : e));
      });
    }, 10_000);

    return () => clearInterval(id);
  }, []);

  /*Actividades recientes */
  const actividad = [
    {
      id: 1,
      texto: 'Nueva cita agendada con Dr. Juan Pérez',
      tiempo: 'Hace 5 min',
      tipo: 'success',
    },
    {
      id: 2,
      texto: 'Nuevo paciente registrado: Laura Sánchez',
      tiempo: 'Hace 15 min',
      tipo: 'info',
    },
    {
      id: 3,
      texto: 'Cita cancelada por Miguel Torres',
      tiempo: 'Hace 1 h',
      tipo: 'warning',
    },
  ];

  /*Render */
  return (
    <>
      {/* ---- Tarjetas resumen ---- */}
      <section className={styles.stats}>
        {stats.map(s => (
          <div className={styles.statCard} key={s.id}>
            <div className={styles.statIcon}>{s.icon}</div>
            <div>
              <p className={styles.statLabel}>{s.label}</p>
              <h3 className={styles.statValue}>{s.value}</h3>
              <span className={styles.statSubtitle}>{s.subtitle}</span>
            </div>
          </div>
        ))}
      </section>

      {/*Paneles principales */}
      <section className={styles.grid}>
        {/* Citas por mes */}
        <div className={styles.panel}>
          <h4>Citas por Mes</h4>
          <p className={styles.panelSub}>Evolución mensual de citas médicas</p>

          {citasMensuales.map(c => {
            const max = Math.max(...citasMensuales.map(m => m.total));
            const width = (c.total / max) * 100;

            return (
              <div className={styles.barRow} key={c.mes}>
                <span className={styles.barLabel}>{c.mes}</span>

                <div className={styles.barBg}>
                  <div
                    className={`${styles.barFill} ${styles.citasFill}`}
                    style={{ width: `${width}%` }}
                  />
                </div>

                <span className={styles.barValue}>{c.total}</span>
              </div>
            );
          })}
        </div>

        {/* Especialidades más solicitadas */}
        <div className={styles.panel}>
          <h4>Especialidades Más Solicitadas</h4>
          <p className={styles.panelSub}>Ranking de especialidades por demanda</p>

          {especialidades.map(e => {
            const max = Math.max(...especialidades.map(t => t.total));
            const width = (e.total / max) * 100;

            return (
              <div className={styles.barRow} key={e.nombre}>
                <span className={styles.barLabel}>{e.nombre}</span>

                <div className={styles.barBg}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${width}%`, background: e.color }}
                  />
                </div>

                <span className={styles.barValue}>{e.total}</span>
              </div>
            );
          })}
        </div>

        {/* Actividad reciente */}
        <div className={`${styles.panel} ${styles.full}`}>
          <h4>Actividad Reciente</h4>
          <p className={styles.panelSub}>Últimas acciones en el sistema</p>

          <ul className={styles.activityList}>
            {actividad.map(a => (
              <li key={a.id} className={styles[a.tipo]}>
                <span className={styles.bullet} />
                <div className={styles.text}>
                  {a.texto}
                  <br />
                  <small>{a.tiempo}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
