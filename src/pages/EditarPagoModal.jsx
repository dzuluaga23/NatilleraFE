import { Modal, Form, Button } from "react-bootstrap";

export default function EditarPagoModal({
  show,
  onHide,
  pagoAEditar,
  setPagoAEditar,
  onGuardar
}) {
  const meses = [
    { numero: 1, nombre: "Enero" },
    { numero: 2, nombre: "Febrero" },
    { numero: 3, nombre: "Marzo" },
    { numero: 4, nombre: "Abril" },
    { numero: 5, nombre: "Mayo" },
    { numero: 6, nombre: "Junio" },
    { numero: 7, nombre: "Julio" },
    { numero: 8, nombre: "Agosto" },
    { numero: 9, nombre: "Septiembre" },
    { numero: 10, nombre: "Octubre" },
    { numero: 11, nombre: "Noviembre" },
    { numero: 12, nombre: "Diciembre" }
  ];

  console.log(pagoAEditar);


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

            <Form.Group className="mb-3">
              <Form.Label>Corresponde al mes:</Form.Label>
              <Form.Select
                value={pagoAEditar.mesPago ? String(pagoAEditar.mesPago) : ""}
                onChange={(e) =>
                  setPagoAEditar({
                    ...pagoAEditar,
                    mesPago: parseInt(e.target.value, 10),
                  })
                }
              >
                <option value="">Seleccione un mes</option>
                {meses.map((mes) => (
                  <option key={mes.numero} value={String(mes.numero)}>
                    {mes.nombre}
                  </option>
                ))}
              </Form.Select>
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
