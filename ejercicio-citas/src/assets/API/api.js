import axios from "axios";

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
  }
};