import { Table } from "react-bootstrap";

export default function TablaPagosMensuales({
  mesSeleccionado,
  pagosMensuales,
  intereses,
  totalesMes,
  iniciarEdicion,
  abrirModalInteres
}) {
  const nombreMes = mesSeleccionado
    ? new Date(0, mesSeleccionado - 1)
        .toLocaleString("es", { month: "long" })
        .toUpperCase()
    : "";

  return (
    <div className="mt-4">
      <h4 className="text-center mb-3">Pagos del mes de {nombreMes}</h4>

      <Table bordered hover className="text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>Socio</th>
            <th>Documento</th>
            <th>Ahorro</th>
            <th>Polla</th>
            <th>Rifa</th>
            <th>Interés</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pagosMensuales.map((p, i) => (
            <tr key={i}>
              <td>{p.nombre}</td>
              <td>{p.documento}</td>
              <td>${Number(p.ahorro).toFixed(2)}</td>
              <td>${Number(p.polla).toFixed(2)}</td>
              <td>${Number(p.rifa).toFixed(2)}</td>
              <td>
                {intereses[p.idPago]
                  ? `$${Number(intereses[p.idPago].valorTotal).toFixed(2)}`
                  : "$0.00"}
              </td>
              <td>{p.fechaPago?.split("T")[0] ?? ""}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => iniciarEdicion(p)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-info btn-sm ms-2"
                  onClick={() => abrirModalInteres(p)}
                >
                  Intereses
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="table-secondary">
          <tr>
            <th colSpan={2}>Totales:</th>
            <th>${totalesMes?.ahorro?.toFixed(2) || "0.00"}</th>
            <th>${totalesMes?.polla?.toFixed(2) || "0.00"}</th>
            <th>${totalesMes?.rifa?.toFixed(2) || "0.00"}</th>
            <th>${totalesMes?.interes?.toFixed(2) || "0.00"}</th>
            <th colSpan={2}></th>
          </tr>
        </tfoot>
      </Table>
    </div>
  );
}
