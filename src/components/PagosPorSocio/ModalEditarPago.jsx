import { Modal, Form, Button } from "react-bootstrap";

function ModalEditarPago({ show, pago, onClose, onGuardar }) {
  if (!pago) return null;

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Pago</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Ahorro</Form.Label>
            <Form.Control
              type="number"
              value={pago.ahorro}
              onChange={(e) => pago.ahorro = e.target.value}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Polla</Form.Label>
            <Form.Control
              type="number"
              value={pago.polla}
              onChange={(e) => pago.polla = e.target.value}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Rifa</Form.Label>
            <Form.Control
              type="number"
              value={pago.rifa}
              onChange={(e) => pago.rifa = e.target.value}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de Pago</Form.Label>
            <Form.Control
              type="date"
              value={pago.fechaPago}
              onChange={(e) => pago.fechaPago = e.target.value}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={onGuardar}>Guardar Cambios</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalEditarPago;
