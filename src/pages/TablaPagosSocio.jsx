import { Table } from "react-bootstrap";

export default function TablaPagosSocio({ pagos }) {
  const meses = [
    "",
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

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
            <th>Corresponde al mes</th>
            <th>Ahorro</th>
            <th>Polla</th>
            <th>Rifa</th>
          </tr>
        </thead>
        <tbody>
          {pagos.pagos.map((p, i) => (
            <tr key={i}>
              <td>{p.fechaPago}</td>
              <td>{meses[p.mesPago]}</td>
              <td>${Number(p.ahorro).toLocaleString()}</td>
              <td>${Number(p.polla).toLocaleString()}</td>
              <td>${Number(p.rifa).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="table-secondary">
          <tr>
            <th>Totales:</th>
            <th></th>
            <th>${Number(pagos.totalAhorro).toLocaleString()}</th>
            <th>${Number(pagos.totalPolla).toLocaleString()}</th>
            <th>${Number(pagos.totalRifa).toLocaleString()}</th>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
