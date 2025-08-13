import { Row, Col, Button } from "react-bootstrap";

function BotonesMeses({ mesSeleccionado, onSeleccionMes }) {
  return (
    <Row className="mb-3 justify-content-center">
      {[...Array(12)].map((_, i) => (
        <Col xs="auto" key={i}>
          <Button
            variant={mesSeleccionado === i + 1 ? "dark" : "outline-dark"}
            onClick={() => onSeleccionMes(i + 1)}
          >
            {new Date(0, i).toLocaleString("es", { month: "long" }).toUpperCase()}
          </Button>
        </Col>
      ))}
    </Row>
  );
}

export default BotonesMeses;
