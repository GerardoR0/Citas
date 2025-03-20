import axios from "axios";

// API de mockapi.io

const USUARIOS_URL = "https://67d5096bd2c7857431ef30ed.mockapi.io/api/v1/Usuarios";
const CITAS_URL = "https://67d5096bd2c7857431ef30ed.mockapi.io/api/v1/citas";

export default {
  obtenerUsuarios() {
    return axios.get(USUARIOS_URL);
  },

  obtenerCitas(UsuarioId) {
    return axios.get(`${CITAS_URL}?UsuarioId=${UsuarioId}`);
  },

  agregarCita(cita) {
    return axios.post(CITAS_URL, cita);
  },

  // actualizarCita(cita) {
  //   return axios.put(`${CITAS_URL}/${cita.id}`, cita)
  //     .then((res) => {
  //       console.log("Respuesta de actualización:", res);
  //       return res;
  //     })
  //     .catch((err) => {
  //       console.error("Error al actualizar cita:", err.response);
  //       return err;
  //     });
  // },

  // eliminarCita(id) {
  //   return axios.delete(`${CITAS_URL}/${id}`)
  //     .then((res) => {
  //       console.log("Respuesta de eliminación:", res);
  //       return res;
  //     })
  //     .catch((err) => {
  //       console.error("Error al eliminar cita:", err.response);
  //       return err;
  //     });
  // },
};