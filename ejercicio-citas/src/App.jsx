import moment from "moment";
import Modal from "react-modal";
import api from "./assets/API/api";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

// Estilos del Modal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    padding: "20px",
    color: "#333", // Más suave que negro puro
    background: "#f3f3f3",
    borderRadius: "10px", // Más redondeado
    overflow: "hidden",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
    zIndex: "1000",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo opaco detrás del modal
    zIndex: "999",
  },
};

// Configura el elemento raíz para react-modal (en tu archivo index.js)
Modal.setAppElement("#root");

function App() {
  const [users, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [events, setEvent] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
  });

  // Obtener Usuarios
  useEffect(() => {
    api.obtenerUsuarios()
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log("Error al cargar usuarios:", err.message);
      });
  }, []);

  // Obtener Citas por Usuarios
  useEffect(() => {
    if (selectedUser) {
      api.obtenerCitas(selectedUser.id)
        .then((res) => {
          const formatoEvents = res.data.map(citas => ({
            title: citas.title,
            start: new Date(citas.start),
            end: new Date(new Date(citas.end)),
          }));
          setEvent(formatoEvents);
        })
        .catch((err) => {
          console.log("Error al obtener citas:", err.message);
        });
    } else {
      setEvent([]);
    }
  }, [selectedUser]);

  // Abrir modal para crear evento
  const openModal = () => {
    setModalIsOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setModalIsOpen(false);
    setNewEvent({
      title: "",
      start: "",
    });
  };

  // Manejo de formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  // Manejo del envio de formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const startDate = new Date(newEvent.start);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Suma 1 hora

    const nuevaCita = {
      title: newEvent.title,
      start: startDate,
      end: endDate,
    };

    setEvent([...events, nuevaCita]);
    closeModal();

    api.agregarCita({ ...nuevaCita, UsuarioId: selectedUser.id })
      .then((res) => {
        console.log("Cita agregada correctamente", res.data);
      })
      .catch((err) => {
        console.log("Error al agregar cita:", err.message);
      });
  };

  // Estado para la vista actual
  const [view, setView] = useState("month");

  // Estado para la fecha actual
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <h1 className="textSelect">Agenda de {selectedUser ? selectedUser.nombre : "Seleccione un Usuario"}</h1>
      <select className="selectUser"
        onChange={(e) => {
          const userId = e.target.value;
          const user = users.find((u) => u.id === userId);
          setSelectedUser(user);
        }}
        defaultValue=""
      >
        <option value="">Selecciona una persona</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.nombre}
          </option>
        ))}
      </select>

      <button className="btnOpenModal" onClick={openModal}>
        Crear Cita
      </button>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={(newView) => setView(newView)}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        views={["month", "week", "day"]}
        defaultView="month"
        style={{ height: 500, margin: "50px", backgroundColor: "white", color: "black"}}
        messages={{
          next: "Siguiente",
          previous: "Anterior",
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
        }}
        components={{
          toolbar: (props) => (
            <div className="rbc-toolbar">
              <div className="rbc-btn-group">
                <button onClick={() => props.onNavigate("PREV")}>Anterior</button>
                <button onClick={() => props.onNavigate("TODAY")}>Hoy</button>
                <button onClick={() => props.onNavigate("NEXT")}>Siguiente</button>
              </div>

              <div className="rbc-toolbar-label">{props.label}</div>

              <div className="rbc-btn-group">
                <button
                  className={view === "month" ? "rbc-active" : ""}
                  onClick={() => props.onView("month")}
                >
                  Mes
                </button>
                <button
                  className={view === "week" ? "rbc-active" : ""}
                  onClick={() => props.onView("week")}
                >
                  Semana
                </button>
                <button
                  className={view === "day" ? "rbc-active" : ""}
                  onClick={() => props.onView("day")}
                >
                  Día
                </button>
              </div>
            </div>
          ),
        }}
      />

      {/* Modal para crear cita */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal} // Usa onRequestClose en lugar de onClose
        style={customStyles}
        contentLabel="Crear Cita"
      >
        <h2 className="textModal">Crear Cita</h2>
        <form onSubmit={handleSubmit}>
          <div className="labelStyleModal">
            <label>Titulo de la Cita</label>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="labelStyleModal">
            <label>Fecha y Hora de la Cita</label>
            <input
              type="datetime-local"
              name="start"
              value={newEvent.start}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="btnModal">         
          <button type="submit">Agregar Cita</button>
          <button type="button" onClick={closeModal}>
            Cancelar
          </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default App;