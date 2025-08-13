import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarPago } from '../services/PagoService';
import { obtenerSocios } from '../services/SocioService';
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Alert
} from 'react-bootstrap';

const RegistrarPago = () => {
  const navigate = useNavigate();
  const [socios, setSocios] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [formData, setFormData] = useState({
    idSocio: '',
    rifa: '',
    polla: '',
    ahorro: '',
    fechaPago: ''
  });

  useEffect(() => {
    obtenerSocios()
      .then(setSocios)
      .catch((err) => console.error('Error al cargar socios:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await registrarPago(formData);
      setMensaje(respuesta);

      if (respuesta.toLowerCase().includes('correctamente')) {
        setTimeout(() => {
          navigate('/ahorros');
        }, 1500);
      }
    } catch (error) {
      console.error('Error al registrar el pago:', error);
      setMensaje('Ocurrió un error al registrar el pago.');
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="p-4 shadow" style={{ width: '100%', maxWidth: '700px', borderRadius: '1rem' }}>
        <Row className="mb-4 align-items-center">
          <Col xs="auto">
            <Link to="/ahorros">
              <Button variant="outline-dark">← Regresar</Button>
            </Link>
          </Col>
          <Col>
            <h3 className="mb-0 fw-bold">Registrar Pago</h3>
          </Col>
        </Row>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Socio</Form.Label>
            <Form.Select
              name="idSocio"
              value={formData.idSocio}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un socio</option>
              {socios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Rifa</Form.Label>
            <Form.Control
              type="number"
              name="rifa"
              value={formData.rifa}
              onChange={handleChange}
              step="0.01"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Polla</Form.Label>
            <Form.Control
              type="number"
              name="polla"
              value={formData.polla}
              onChange={handleChange}
              step="0.01"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Ahorro</Form.Label>
            <Form.Control
              type="number"
              name="ahorro"
              value={formData.ahorro}
              onChange={handleChange}
              step="0.01"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Fecha de Pago</Form.Label>
            <Form.Control
              type="date"
              name="fechaPago"
              value={formData.fechaPago}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <div className="text-end">
            <Button variant="success" type="submit">
              Registrar Pago
            </Button>
          </div>

          {mensaje && (
            <Alert className="mt-4 text-center" variant="info">
              {mensaje}
            </Alert>
          )}
        </Form>
      </Card>
    </Container>
  );
};

export default RegistrarPago;
