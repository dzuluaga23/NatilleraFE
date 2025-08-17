import { Table } from "react-bootstrap";

export default function TablaPagosSocio({ pagos }) {
  return (
    <div>
      <h5>Socio: {pagos.nombre}</h5>
      <p>
        <strong>Documento:</strong> {pagos.documento}
      </p>

      <Table bordered hover className="text-center align-middle mt-3">
        <thead className="table-dark">
          <tr>
            <th>Fecha de Pago</th>
            <th>Ahorro</th>
            <th>Polla</th>
            <th>Rifa</th>
          </tr>
        </thead>
        <tbody>
          {pagos.pagos.map((p, i) => (
            <tr key={i}>
              <td>{p.fechaPago}</td>
              <td>${Number(p.ahorro).toFixed(2)}</td>
              <td>${Number(p.polla).toFixed(2)}</td>
              <td>${Number(p.rifa).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="table-secondary">
          <tr>
            <th>Totales:</th>
            <th>${Number(pagos.totalAhorro).toFixed(2)}</th>
            <th>${Number(pagos.totalPolla).toFixed(2)}</th>
            <th>${Number(pagos.totalRifa).toFixed(2)}</th>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
