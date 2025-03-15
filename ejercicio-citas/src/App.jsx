import React, { useState, useEffect } from "react";
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
          const citasObtenidas = await obtenerCitasPorUsuario(usuarioSeleccionado);
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

  const horarios = Array.from({ length: 11 }, (_, i) => `${i + 9}:00`);

  return (
    <div className="agenda-container">
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

      <h1>
        Agenda de {usuarios.find((u) => u.id === usuarioSeleccionado)?.nombre}
      </h1>

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
          {citas.map((cita) => {
            const columna = diasSemana.indexOf(cita.fecha.trim()) + 1;
            const fila = horarios.indexOf(cita.hora.trim()) + 1;
            return (
              <div
                key={cita.id}
                className="cita"
                style={{
                  gridColumn: columna,
                  gridRow: fila,
                }}
              >
                <p>{cita.actividad}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;