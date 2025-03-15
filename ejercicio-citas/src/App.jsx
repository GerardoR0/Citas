import React, { useState, useEffect, use } from "react";
import { obtenerUsuarios, obtenerCitasPorUsuario } from "./assets/API/axios";
import "./App.css";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const usuariosObtenidos = await obtenerUsuarios();
        setUsuarios(usuariosObtenidos);
        if (usuariosObtenidos.length > 0) {
          setUsuarioSeleccionado(usuariosObtenidos[0].id);
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    obtenerUsuario();
  }, []);

  useEffect(() => {
    const obtenerCitas = async () => {
      if (usuarioSeleccionado) {
        try {
          const citasObtenidas = await obtenerCitasPorUsuario(
            usuarioSeleccionado
          );
          setCitas(citasObtenidas);
        } catch (error) {
          console.error("Error al obtener citas:", error);
        }
      }
    };
    obtenerCitas();
  }, [usuarioSeleccionado]);

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const horarios = Array.from({ length: 12 }, (_, i) => `${i + 7}:00`);

  return (
    <div className="agenda-container">
      {/* Selector de persona */}
      <div className="selector-persona">
        <label>Seleccionar persona: </label>
        <select
          value={usuarioSeleccionado}
          onChange={(e) => setUsuarioSeleccionado(e.target.value)}
        >
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Mostrar el nombre de la persona seleccionada */}
      <h1>
        Agenda de {usuarios.find((u) => u.id === usuarioSeleccionado)?.nombre}
      </h1>

      {/* Formulario para agregar una nueva cita */}
      {/* <div className="formulario">
        <h2>Agregar Nueva Cita</h2>
        <input
          type="date"
          value={nuevaCita.fecha}
          onChange={(e) =>
            setNuevaCita({ ...nuevaCita, fecha: e.target.value })
          }
        />
        <input
          type="time"
          value={nuevaCita.hora}
          onChange={(e) => setNuevaCita({ ...nuevaCita, hora: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevaCita.descripcion}
          onChange={(e) =>
            setNuevaCita({ ...nuevaCita, descripcion: e.target.value })
          }
        />
        <button onClick={handleAgregarCita}>Agregar Cita</button>
      </div> */}

      {/* Tabla de agenda semanal */}
      <div className="agenda-semanal">
        <div className="dias-semana">
          {diasSemana.map((dia) => (
            <div key={dia} className="dia">
              {dia}
            </div>
          ))}
        </div>
        <div className="horarios">
          {horarios.map((hora) => (
            <div key={hora} className="hora">
              {hora}
            </div>
          ))}
        </div>
        <div className="citas">
          {citas.map((cita) => (
            <div
              key={cita.id}
              className="cita"
              style={{
                gridColumn: diasSemana.indexOf(cita.fecha) + 1,
                gridRow: horarios.indexOf(cita.hora) + 2,
              }}
            >
              <p>{cita.descripcion}</p>
              {/* <button onClick={() => handleEliminarCita(cita.id)}>
                Eliminar
              </button> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
