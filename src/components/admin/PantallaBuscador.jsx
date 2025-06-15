/**
 * Descripción: Vista de buscador multitareas
 * Fecha: 14 Junio de 2025
 * Programador: Irais Reyes
 */

import React, { useState, useEffect } from "react";
import styles from "../../styles/usuario/Buscador.module.css";
import { InputText } from "primereact/inputtext";
import { SearchOutline } from 'react-ionicons'
import { Button } from "primereact/button";

const datosFalsos = [
  {
    id: "1",
    nombres: "Carlos",
    apellidoP: "Ramírez",
    rol: "Doctor",
    sexo: "M",
    fotoURL: "https://i.pravatar.cc/150?img=65",
  },
  {
    id: "2",
    nombres: "María",
    apellidoP: "Gómez",
    rol: "Paciente",
    sexo: "F",
    fotoURL: "https://img.freepik.com/foto-gratis/doctor-holding-portapapeles-mirando-camara_23-2148285743.jpg?semt=ais_hybrid&w=740",
  },
  {
    id: "3",
    nombres: "Lucía",
    apellidoP: "Hernández",
    rol: "Doctor",
    sexo: "F",
    fotoURL: "https://i.pravatar.cc/150?img=05",
  },
    {
    id: "4",
    nombres: "David",
    apellidoP: "Montoya",
    rol: "Doctor",
    sexo: "M",
    fotoURL: "https://i.pravatar.cc/150?img=08",
  },
];

export default function PantallaBuscador({ tipo = 1 }) {
  const [items, setItems] = useState([]);
  const [itemsFiltrados, setItemsFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const filtrados =
      tipo === 1
        ? datosFalsos.filter((d) => d.rol === "Doctor")
        : datosFalsos.filter((d) => d.rol === "Paciente");
    setItems(filtrados);
    setItemsFiltrados(filtrados);
  }, [tipo]);

  const filtrarPorNombre = (texto) => {
    setBusqueda(texto);
    if (texto.trim().length < 3) {
      setItemsFiltrados(items);
      return;
    }
    const textoMin = texto.toLowerCase();
    const filtrados = items.filter((item) =>
      item.nombres.toLowerCase().startsWith(textoMin)
    );
    setItemsFiltrados(filtrados);
  };

  const renderItem = (item) => {
    const datos = {
      nombres: item.nombres || "Nombre no disponible",
      apellidoP: item.apellidoP || "Apellido no disponible",
      fotoURL: item.fotoURL || null,
    };

    const prefix = item.rol === "Doctor" ? (item.sexo === "F" ? "Dra." : "Dr.") : "";
    const fullName = `${prefix} ${datos.nombres} ${datos.apellidoP}`;

    return (
      <div key={item.id} className={styles.TarjetaBuscador}>
  <div className={styles.infoGrupo}>
    <img
      src={datos.fotoURL || "https://via.placeholder.com/48"}
      alt="avatar"
      className={styles.avatar}
    />
    <div className={styles.Info}>
      <h4 className={styles.Nombre}>{fullName}</h4>
      <p
        className={styles.citasInfo}
        onClick={() => console.log("Ver citas de", fullName)}
        style={{ cursor: 'pointer'}}
      >
        ver citas
      </p>
    </div>
  </div>
  <div className={styles.botonesLista}>
    <button className={styles.btnEditar}>Editar</button>
    <button className={styles.botEliminar}>Eliminar</button>
  </div>
</div>
    );
  };

  return (
    <div className={styles.BuscadorContainer}>
      <h2 className={styles.TituloBuscador}>{tipo === 1 ? "Lista de Doctores" : "Lista de Pacientes"}</h2>

        <span className={styles.inputIconContainer}>
          <InputText
            className={styles.inputBuscador}
            placeholder="Buscar"
            value={busqueda}
            onChange={(e) => filtrarPorNombre(e.target.value)}
          />
          <SearchOutline
            color={'#0a3b74'}
            className={styles.iconoBuscadorDerecha}
          />
        </span>



      <div className={styles.Resultados}>
        {itemsFiltrados.map((item) => renderItem(item))}
      </div>
    </div>
  );
}
