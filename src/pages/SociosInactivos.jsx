import React, { useEffect, useState } from 'react';
import {
  obtenerSociosInactivos,
  activarSocioPorDocumento
} from '../services/SocioService';
import {
  Button,
  Table,
  Container,
  Row,
  Col,
  Spinner,
  Alert
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../App.css'; // Asegúrate de que el CSS esté en esta ruta

const SociosInactivos = () => {
  const [socios, setSocios] = useState([]);
  const [switches, setSwitches] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarSocios();
  }, []);

  const cargarSocios = async () => {
    try {
      const data = await obtenerSociosInactivos();
      setSocios(data);
      const switchesIniciales = {};
      data.forEach((s) => (switchesIniciales[s.documento] = false));
      setSwitches(switchesIniciales);
      setError('');
    } catch (err) {
      setError('Error al cargar los socios inactivos.');
    } finally {
      setLoading(false);
    }
  };

  const activarSocio = async (documento) => {
    const confirm = await Swal.fire({
      title: '¿Activar socio?',
      text: `¿Estás seguro de activar el socio ${documento}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    });

    if (!confirm.isConfirmed) return;

    try {
      const respuesta = await activarSocioPorDocumento(documento);
      const errores = ['error', 'no encontrado', 'ya está activo'];
      const esError = errores.some((e) => respuesta.toLowerCase().includes(e));

      if (esError) {
        Swal.fire('Error', respuesta, 'error');
      } else {
        setSwitches((prev) => ({ ...prev, [documento]: true }));
        Swal.fire({
          icon: 'success',
          title: 'Socio activado correctamente',
          text: respuesta,
          confirmButtonColor: '#3085d6'
        }).then(() => navigate('/socios'));
      }
    } catch {
      Swal.fire('Error', 'No se pudo activar el socio.', 'error');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-3 align-items-center">
        <Col xs="auto">
          <Link to="/socios">
            <Button variant="outline-dark">← Regresar</Button>
          </Link>
        </Col>
        <Col>
          <h2 className="mb-0">Socios Inactivos</h2>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : socios.length === 0 ? (
        <Alert variant="info">No hay socios inactivos.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Número</th>
              <th>Rol</th>
              <th>Activo</th>
            </tr>
          </thead>
          <tbody>
            {socios.map((socio) => (
              <tr key={socio.documento}>
                <td>{socio.documento}</td>
                <td>{socio.nombre}</td>
                <td>{socio.numero}</td>
                <td>{socio.rol}</td>
                <td className="text-center">
                  <div className="switch-wrapper">
                    <label className="custom-toggle">
                      <input
                        type="checkbox"
                        checked={switches[socio.documento] || false}
                        onChange={() => activarSocio(socio.documento)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default SociosInactivos;
