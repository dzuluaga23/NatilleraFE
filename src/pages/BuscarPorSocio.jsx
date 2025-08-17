import { Form, Button } from "react-bootstrap";

export default function BuscarPorSocio({
  socios,
  documento,
  setDocumento,
  onBuscar
}) {
  return (
    <Form className="d-flex mb-3">
      <Form.Select
        className="me-2"
        value={documento}
        onChange={(e) => setDocumento(e.target.value)}
      >
        <option value="">Seleccione un socio</option>
        {socios.map((s) => (
          <option key={s.documento} value={s.documento}>
            {s.nombre} - {s.documento}
          </option>
        ))}
      </Form.Select>
      <Button variant="primary" onClick={onBuscar}>
        Buscar
      </Button>
    </Form>
  );
}
