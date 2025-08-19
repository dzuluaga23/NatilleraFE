const API_URL = "http://localhost:5164/api/Abonos";

export const registrarAbono = async (abono) => {
  const res = await fetch(`${API_URL}/Registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(abono),
  });

  if (!res.ok) {
    let msg = "Error al registrar abono";
    try {
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await res.json();
        msg =
          data?.message ||
          data?.detail ||
          data?.title ||
          data?.error ||
          JSON.stringify(data);
      } else {
        msg = await res.text();
      }
    } catch {
    }
    throw new Error(msg);
  }

  return await res.json();
};

export const obtenerAbonosPorPrestamo = async (idPrestamo) => {
  const res = await fetch(`${API_URL}/ObtenerXId/${idPrestamo}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.mensaje || "Error al obtener abonos del préstamo");
  }
  return await res.json();
};
