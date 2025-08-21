import { Row, Col, Button } from "react-bootstrap";

export default function BuscarPorMes({ mesSeleccionado, onBuscarMes }) {
  const meses = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("es", { month: "long" }).toUpperCase()
  );

  return (
    <>
      <h2 className="mb-3 text-center">Consultar Pagos por Mes:</h2>
      <Row className="justify-content-center g-2 flex-wrap">
        {meses.map((mes, i) => (
          <Col xs="auto" key={i}>
            <Button
              variant={mesSeleccionado === i + 1 ? "dark" : "outline-dark"}
              onClick={() => onBuscarMes(i + 1)}
            >
              {mes}
            </Button>
          </Col>
        ))}
      </Row>
    </>
  );
}
