const API_URL = "http://localhost:5164/api/Banco";

export const getResumenGeneral = async () => {
  const res = await fetch(`${API_URL}/Resumen`);
  if (!res.ok) throw new Error("Error al obtener resumen general");
  return res.json();
};

export const getResumenPorMes = async (anio, mes) => {
  const res = await fetch(`${API_URL}/ResumenXMes?anio=${anio}&mes=${mes}`);
  if (!res.ok) throw new Error("Error al obtener resumen por mes");
  return res.json();
};

export const getBanco = async () => {
  const res = await fetch(`${API_URL}/ObtenerBanco`);
  if (!res.ok) throw new Error("Error al obtener estado del banco");
  return res.json();
};

export const actualizarBanco = async (banco) => {
  const res = await fetch(`${API_URL}/ActualizarBanco`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(banco),
  });
  if (!res.ok) throw new Error("Error al actualizar banco");
  return res.json();
};