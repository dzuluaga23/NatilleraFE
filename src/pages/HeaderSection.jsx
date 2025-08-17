import { Link, useNavigate } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";

export default function HeaderSection() {
  const navigate = useNavigate();

  return (
    <Row className="mb-4 align-items-center">
      <Col xs="auto">
        <Link to="/">
          <Button variant="outline-dark">← Regresar</Button>
        </Link>
      </Col>
      <Col>
        <h2 className="mb-0 text-center text-md-start">
          Consultar Pagos por Socio
        </h2>
      </Col>
      <Col className="text-end">
        <Button
          variant="success"
          onClick={() => navigate("/ahorros/registrar")}
        >
          + Registrar Pago
        </Button>
      </Col>
    </Row>
  );
}