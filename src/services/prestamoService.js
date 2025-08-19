const API_URL = "http://localhost:5164/api/Prestamos";

export const obtenerPrestamos = async () => {
  const res = await fetch(`${API_URL}/ObtenerTodos`);
  if (!res.ok) throw new Error("Error al obtener préstamos");
  return await res.json();
};

export const registrarPrestamo = async (prestamo) => {
  const res = await fetch(`${API_URL}/Registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prestamo),
  });
  if (!res.ok) throw new Error("Error al registrar préstamo");
  return await res.json();
};

export const obtenerPrestamosPorSocio = async (idSocio) => {
  const res = await fetch(`${API_URL}/ObtenerXId?idSocio=${idSocio}`);
  if (!res.ok) throw new Error("Error al consultar préstamos del socio");
  return await res.json();
};
