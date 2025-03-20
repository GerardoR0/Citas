import moment from "moment";
import Swal from 'sweetalert2';
import api from "./assets/API/api";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function App() {
  const [users, setUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [events, setEvent] = useState([]);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());

  // Obtener Usuarios
  useEffect(() => {
    api.obtenerUsuarios()
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        Swal.fire({
          title: "Error al cargar usuarios",
          text: "Por favor, intenta más tarde.",
          icon: "error",
          confirmButtonText: "Ok",
        });
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
          if (err.response && err.response.status === 404) {
            Swal.fire({
              title: "No hay citas para este usuario",
              text: "Debes de crear una para poder visualizarlas.",
              icon: "warning",
              confirmButtonText: "Ok",
            });
          } else {
            Swal.fire({
              title: "Error al cargar citas",
              text: "Por favor, intenta más tarde.",
              icon: "error",
              confirmButtonText: "Ok",
            });
          }
        });
    } else {
      setEvent([]);
    }
  }, [selectedUser]);

  // Función para abrir el SweetAlert2 con el formulario
  const openSweetAlertForm = () => {
    Swal.fire({
      title: "Crear Cita",
      html:
        `<input id="title" class="swal2-input" placeholder="Título de la Cita" required>` +
        `<input id="start" type="datetime-local" class="swal2-input" required>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Agregar Cita",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const title = Swal.getPopup().querySelector("#title").value;
        const start = Swal.getPopup().querySelector("#start").value;

        if (!title || !start) {
          Swal.showValidationMessage("Por favor, completa todos los campos.");
          return false;
        }

        return { title, start };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { title, start } = result.value;
        const startDate = new Date(start);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); 

        const nuevaCita = {
          title,
          start: startDate,
          end: endDate,
        };

        setEvent([...events, nuevaCita]);

        api.agregarCita({ ...nuevaCita, UsuarioId: selectedUser.id })
          .then(() => {
            Swal.fire({
              title: "Cita agregada correctamente",
              text: "La cita ha sido agendada exitosamente.",
              icon: "success",
              confirmButtonText: "Ok",
            });
          })
          .catch(() => {
            Swal.fire({
              title: "Error al agregar cita",
              text: "Hubo un error al agregar la cita, intente nuevamente.",
              icon: "error",
              confirmButtonText: "Ok",
            });
          });
      }
    });
  };

  //Función para editar un evento
  const handleEditEvent = (event) => {
    Swal.fire({
      title: "Editar Cita",
      html:
        `<input id="title" class="swal2-input" placeholder="Título de la Cita" value="${event.title}" required>` +
        `<input id="start" type="datetime-local" class="swal2-input" value="${moment(event.start).format("YYYY-MM-DDTHH:mm")}" required>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const title = Swal.getPopup().querySelector("#title").value;
        const start = Swal.getPopup().querySelector("#start").value;
  
        if (!title || !start) {
          Swal.showValidationMessage("Por favor, completa todos los campos.");
          return false;
        }
  
        return { title, start };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { title, start } = result.value;
        const updatedEvent = {
          ...event,
          title,
          start: new Date(start),
          end: new Date(new Date(start).getTime() + 60 * 60 * 1000), 
        };

        const updatedEvents = events.map((ev) =>
          ev === event ? updatedEvent : ev
        );
        setEvent(updatedEvents)

        Swal.fire({
          title: "Cita editada correctamente",
          text: "La cita ha sido editada exitosamente.",
          icon: "success",
          confirmButtonText: "Ok"
        })

        // api.actualizarCita(updatedEvent) // Envía el evento actualizado
        //   .then(() => {
        //     Swal.fire({
        //       title: "Cita actualizada",
        //       text: "La cita ha sido actualizada exitosamente.",
        //       icon: "success",
        //       confirmButtonText: "Ok"
        //     });
        //   })
        //   .catch(() => {
        //     Swal.fire({
        //       title: "Error al actualizar la cita",
        //       text: "Hubo un error al actualizar la cita, intente nuevamente.",
        //       icon: "error",
        //       confirmButtonText: "Ok",
        //     });
        //   });
      }
    });
  };

   // Función para eliminar un evento
   const handleDeleteEvent = (event) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedEvents = events.filter((ev) => ev !== event);
        setEvent(updatedEvents);

        Swal.fire({
          title: "Cita eliminada correctamente",
          text: "La cita ha sido eliminada exitosamente.",
          icon: "success",
          confirmButtonText: "Ok",
        })

        // Enviar la eliminación al backend (opcional)
      //   api.eliminarCita(event.id)
      //     .then((res) => {
      //       Swal.fire({
      //         title: "Cita eliminada",
      //         text: "La cita ha sido eliminada exitosamente.",
      //         icon: "success",
      //         confirmButtonText: "Ok",
      //       });
      //     })
      //     .catch((err) => {
      //       Swal.fire({
      //         title: "Error al eliminar la cita",
      //         text: "Hubo un error al eliminar la cita, intente nuevamente.",
      //         icon: "error",
      //         confirmButtonText: "Ok",
      //       });
      //     });
      }
    });
  };


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

      <button className="btnOpenModal" onClick={openSweetAlertForm}>
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
        views={["month", "week", "day", "agenda"]}
        defaultView="month"
        style={{ height: 500, margin: "50px", backgroundColor: "white", color: "black" }}
        onSelectEvent={(event) =>{
          Swal.fire({
            title: "Opciones de Cita",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Editar",
            denyButtonText: "Eliminar",
            cancelButtonText: "Cerrar",
          }).then((result) => {
            if (result.isConfirmed) {
              handleEditEvent(event);
            } 
            else if (result.isDenied) {
              handleDeleteEvent(event); 
            }
          })
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
                <button
                  className={view === "agenda" ? "rbc-active" : ""}
                  onClick={() => props.onView("agenda")}
                >
                  Agenda
                </button>
              </div>
            </div>
          ),
        }}
      />
    </div>
  );
}

export default App;