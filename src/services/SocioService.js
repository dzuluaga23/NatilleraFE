const API_URL = 'http://natilleradecember.runasp.net/api/Socios';

export async function obtenerSocios() {
  const response = await fetch(`${API_URL}/ConsultarTodos`);
  if (!response.ok) throw new Error('Error al obtener socios');
  return await response.json();
}

export async function obtenerSocioXDocumento(documento) {
  const response = await fetch(`${API_URL}/ConsultarXDocumento?documento=${documento}`);
  if (!response.ok) throw new Error('Socio no encontrado');
  return await response.json();
}

export async function obtenerSociosActivos() {
  const response = await fetch("http://natilleradecember.runasp.net/api/Socios/ConsultarTodos");
  if (!response.ok) throw new Error("No se pudieron obtener los socios.");
  return await response.json();
}


export async function crearSocio(socio) {
  const response = await fetch(`${API_URL}/Insertar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(socio),
  });
  const data = await response.text();
  return data;
}

export async function eliminarSocioPorDocumento(documento) {
  const response = await fetch(`${API_URL}/Eliminar?documento=${documento}`, {
    method: 'DELETE',
  });
  const data = await response.text();
  return data;
}

export async function obtenerNumerosDisponibles() {
  const response = await fetch(`${API_URL}/NumerosDisponibles`);
  if (!response.ok) throw new Error('Error al obtener los números disponibles');
  return await response.json();
}

export async function obtenerSociosInactivos() {
  const response = await fetch(`${API_URL}/Inactivos`);
  if (!response.ok) throw new Error('Error al obtener socios inactivos');
  return await response.json();
}

export async function activarSocioPorDocumento(documento) {
  const response = await fetch(`${API_URL}/Activar?documento=${documento}`, {
    method: 'PUT'
  });

  const data = await response.text();
  return data;
}

const API_ROLES = 'http://natilleradecember.runasp.net/api/Roles';

export async function obtenerRoles() {
  const response = await fetch(`${API_ROLES}/ConsultarTodos`);
  if (!response.ok) throw new Error('Error al obtener roles');
  return await response.json();
}