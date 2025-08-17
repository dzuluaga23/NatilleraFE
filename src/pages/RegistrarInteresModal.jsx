import { Modal, Form, Button, Alert } from "react-bootstrap";

export default function RegistrarInteresModal({
  show,
  onHide,
  interesForm,
  errorInteres,
  onChange,
  onGuardar
}) {
  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Interés</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errorInteres && <Alert variant="danger">{errorInteres}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Días</Form.Label>
            <Form.Control
              type="number"
              name="dias"
              value={interesForm.dias}
              onChange={onChange}
              placeholder="Número de días"
              min={1}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Valor Total Calculado</Form.Label>
            <Form.Control
              type="text"
              value={
                interesForm.valorTotal ? `$${interesForm.valorTotal}` : ""
              }
              readOnly
            />
          </Form.Group>

          <Form.Text className="text-muted">
            Pago: {interesForm.idPago ?? "—"}
          </Form.Text>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="success" onClick={onGuardar}>
          Registrar Interés
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
