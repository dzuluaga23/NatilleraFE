const API_URL = "https://natilleradecember.runasp.net/api/InteresPago";


export const obtenerInteresPorIdPago = async (idPago) => {
  const response = await fetch(`${API_URL}/ObtenerXId?idPago=${idPago}`);
  if (!response.ok) {
    return null;
  }
  return await response.json();
};

export const registrarInteresPago = async (dto) => {
  const response = await fetch(`${API_URL}/Registrar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    throw new Error("Error al registrar el interés");
  }

  return await response.json();
};
