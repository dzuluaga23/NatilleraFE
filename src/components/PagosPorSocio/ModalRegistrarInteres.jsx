import { Modal, Form, Button, Alert } from "react-bootstrap";

function ModalRegistrarInteres({ show, error, form, onClose, onChange, onGuardar }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Registrar Interés</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Días</Form.Label>
            <Form.Control
              type="number"
              name="dias"
              value={form.dias}
              onChange={onChange}
              placeholder="Número de días"
              min={1}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Valor Total Calculado</Form.Label>
            <Form.Control
              type="text"
              value={form.valorTotal ? `$${form.valorTotal}` : ""}
              readOnly
            />
          </Form.Group>
          <Form.Text className="text-muted">Pago: {form.idPago ?? "—"}</Form.Text>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="success" onClick={onGuardar}>Registrar Interés</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalRegistrarInteres;
