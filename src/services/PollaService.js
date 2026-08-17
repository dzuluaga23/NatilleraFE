const API_BASE = "https://natilleradecember.runasp.net/api/Pollas";

export const registrarPolla = async (mes, numero) => {
  const response = await fetch(`${API_BASE}/Registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mes, numero: parseInt(numero) })
  });
  return await response.text();
};

export const consultarPollas = async () => {
  const response = await fetch(`${API_BASE}/ConsultarTodos`);
  return await response.json();
};
