import React, { useState, useEffect } from 'react';
import {
  crearSocio,
  obtenerRoles,
  obtenerNumerosDisponibles
} from '../services/SocioService';
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Card
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AgregarSocio = () => {
  const [form, setForm] = useState({
    documento: '',
    nombre: '',
    numero: '',
    clave: '',
    idRol: ''
  });

  const [roles, setRoles] = useState([]);
  const [numerosDisponibles, setNumerosDisponibles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarRoles();
    cargarNumeros();
  }, []);

  const cargarRoles = async () => {
    try {
      const data = await obtenerRoles();
      setRoles(data);
    } catch (err) {
      Swal.fire('Error', 'No se pudieron cargar los roles', 'error');
    }
  };

  const cargarNumeros = async () => {
    try {
      const data = await obtenerNumerosDisponibles();
      setNumerosDisponibles(data);
    } catch (err) {
      Swal.fire('Error', 'No se pudieron cargar los números disponibles', 'error');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await crearSocio({
        documento: parseInt(form.documento),
        nombre: form.nombre,
        numero: form.numero,
        clave: form.clave,
        idRol: parseInt(form.idRol)
      });

      const erroresPosibles = [
        'error',
        'ya existe',
        'obligatorio',
        'no existe',
        'debe',
        'incorrecto'
      ];

      const esError = erroresPosibles.some((palabra) =>
        respuesta.toLowerCase().includes(palabra)
      );

      if (esError) {
        Swal.fire({
          icon: 'error',
          title: 'Error al crear socio',
          text: respuesta,
          confirmButtonColor: '#d33'
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Socio creado!',
          text: respuesta,
          confirmButtonColor: '#3085d6'
        }).then(() => navigate('/socios'));
      }
    } catch (err) {
      Swal.fire('Error', 'Hubo un problema en la comunicación con el servidor', 'error');
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="p-4 shadow" style={{ width: '100%', maxWidth: '700px', borderRadius: '1rem' }}>
        <Row className="mb-4 align-items-center">
          <Col xs="auto">
            <Link to="/socios">
              <Button variant="outline-dark">← Regresar</Button>
            </Link>
          </Col>
          <Col>
            <h3 className="mb-0 fw-bold">Nuevo Socio</h3>
          </Col>
        </Row>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Documento</Form.Label>
            <Form.Control
              type="number"
              name="documento"
              value={form.documento}
              onChange={handleChange}
              placeholder="Ingrese el documento"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ingrese el nombre completo"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Número disponible</Form.Label>
            <Form.Select
              name="numero"
              value={form.numero}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un número</option>
              {numerosDisponibles.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Clave</Form.Label>
            <Form.Control
              type="password"
              name="clave"
              value={form.clave}
              onChange={handleChange}
              placeholder="Cree una contraseña"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Rol</Form.Label>
            <Form.Select
              name="idRol"
              value={form.idRol}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un rol</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="text-end">
            <Button variant="success" type="submit">
              Guardar Socio
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AgregarSocio;
