import axios from "axios";

const USUARIOS_URL = "https://67d5096bd2c7857431ef30ed.mockapi.io/api/v1/Usuarios";
const CITAS_URL = "https://67d5096bd2c7857431ef30ed.mockapi.io/api/v1/citas";

export const obtenerUsuarios = async () => {
    try {
      const response = await axios.get(USUARIOS_URL);
    //   console.log("usuarios obtenidos", response.data);
      return response.data;

    } catch (error) {
      console.error("Error al obtenerr usuarios:", error);
      return error;
    }
  };

  export const obtenerCitasPorUsuario = async (UsuarioId) => {
    try {
      const response = await axios.get(CITAS_URL, {
        params: {
          UsuarioId: UsuarioId, 
        },
      });
      console.log("citas obtenidas", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener citas:", error);
      return error;
    }
  };