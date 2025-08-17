const API_URL = 'http://localhost:5164/api/Pagos'; 

export async function registrarPago(pago) {
  const response = await fetch(`${API_URL}/Registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pago),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al registrar el pago.");
  }

  return await response.text();
}


export const obtenerPagosDetalladosPorMes = async (mes, anio) => {
  const res = await fetch(`/detallado/${mes}/${anio}`);
  return await res.json();
};

export const actualizarPago = async (pago) => {
  const res = await fetch(`${API_URL}/Actualizar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pago)
  });

  const data = await res.text(); 

  if (!res.ok) {
    throw new Error(data); 
  }

  return data; 
};


export const obtenerPagosPorMes = async (mes, anio) => {
  const res = await fetch(`${API_URL}/DetalladosXMes?mes=${mes}&anio=${anio}`);
  if (!res.ok) throw new Error("Error al obtener los pagos del mes.");
  return res.json();
};


export async function obtenerPagosPorDocumento(documento) {
  const response = await fetch(`${API_URL}/PorDocumento?documento=${documento}`);
  if (!response.ok) throw new Error("No se pudieron obtener los pagos.");
  return await response.json();
}

export const obtenerResumenPagosPorMes = async (mes, anio) => {
  const res = await fetch(`${API_URL}/PorMes?mes=${mes}&anio=${anio}`);
  if (!res.ok) throw new Error("Error al obtener el resumen de pagos.");
  return res.json();
};
