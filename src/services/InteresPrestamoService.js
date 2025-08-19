const API_URL = "http://localhost:5164/api/InteresPrestamo";

export const registrarInteres = async (interes) => {
  try {
    const response = await fetch(`${API_URL}/Crear`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(interes),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al registrar el interés");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const obtenerInteresesPorPrestamo = async (idPrestamo) => {
  try {
    const response = await fetch(`${API_URL}/ObtenerPorPrestamo?idPrestamo=${idPrestamo}`);
    if (!response.ok) throw new Error("Error al obtener los intereses");
    return await response.json();
  } catch (error) {
    throw error;
  }
};
