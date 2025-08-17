import { Row, Col, Button } from "react-bootstrap";

export default function BuscarPorMes({ mesSeleccionado, onBuscarMes }) {
  return (
    <Row className="mb-3 justify-content-center">
      {[...Array(12)].map((_, i) => (
        <Col xs="auto" key={i}>
          <Button
            variant={mesSeleccionado === i + 1 ? "dark" : "outline-dark"}
            onClick={() => onBuscarMes(i + 1)}
          >
            {new Date(0, i)
              .toLocaleString("es", { month: "long" })
              .toUpperCase()}
          </Button>
        </Col>
      ))}
    </Row>
  );
}
