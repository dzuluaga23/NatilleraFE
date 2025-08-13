import React, { useEffect, useState } from 'react';
import {
  obtenerSocios,
  eliminarSocioPorDocumento
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
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Socios = () => {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarSocios();
  }, []);

  const cargarSocios = async () => {
    try {
      const data = await obtenerSocios();
      setSocios(data);
      setError('');
    } catch (err) {
      setError('Error al cargar los socios.');
    } finally {
      setLoading(false);
    }
  };

  const eliminarSocio = async (documento) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar socio?',
      text: `¿Estás seguro de eliminar al socio con documento ${documento}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d'
    });

    if (!confirm.isConfirmed) return;

    try {
      const respuesta = await eliminarSocioPorDocumento(documento);
      const errores = ['error', 'no encontrado'];
      const esError = errores.some(e =>
        respuesta.toLowerCase().includes(e)
      );

      if (esError) {
        Swal.fire('Error', respuesta, 'error');
      } else {
        Swal.fire('Eliminado', respuesta, 'success');
        await cargarSocios();
      }
    } catch {
      Swal.fire('Error', 'No se pudo eliminar el socio.', 'error');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4 align-items-center">
        <Col xs="auto">
          <Link to="/">
            <Button variant="outline-dark">← Regresar</Button>
          </Link>
        </Col>

        <Col>
          <h2 className="mb-0 text-center text-md-start">Lista de Socios Activos</h2>
        </Col>

        <Col className="text-end">
          <Link to="agregar">
            <Button variant="success" className="me-2">
              + Agregar Socio
            </Button>
          </Link>
          <Link to="inactivos">
            <Button variant="secondary">Ver Inactivos</Button>
          </Link>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Documento</th>
                <th>Nombre</th>
                <th>Número</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {socios.map((socio) => (
                <tr key={socio.documento}>
                  <td>{socio.documento}</td>
                  <td>{socio.nombre}</td>
                  <td>{socio.numero}</td>
                  <td>{socio.rol}</td>
                  <td>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => eliminarSocio(socio.documento)}
                    >
                       Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default Socios;
