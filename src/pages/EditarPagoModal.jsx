import { Modal, Form, Button } from "react-bootstrap";

export default function EditarPagoModal({
  show,
  onHide,
  pagoAEditar,
  setPagoAEditar,
  onGuardar
}) {
  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Pago</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {pagoAEditar && (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ahorro</Form.Label>
              <Form.Control
                type="number"
                value={pagoAEditar.ahorro}
                onChange={(e) =>
                  setPagoAEditar({ ...pagoAEditar, ahorro: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Polla</Form.Label>
              <Form.Control
                type="number"
                value={pagoAEditar.polla}
                onChange={(e) =>
                  setPagoAEditar({ ...pagoAEditar, polla: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rifa</Form.Label>
              <Form.Control
                type="number"
                value={pagoAEditar.rifa}
                onChange={(e) =>
                  setPagoAEditar({ ...pagoAEditar, rifa: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha de Pago</Form.Label>
              <Form.Control
                type="date"
                value={pagoAEditar.fechaPago || ""}
                onChange={(e) =>
                  setPagoAEditar({ ...pagoAEditar, fechaPago: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onGuardar}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
