import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registrarPolla, consultarPollas } from "../services/PollaService";
import { Button } from "react-bootstrap";

export default function Polla() {
  const [mes, setMes] = useState("");
  const [numero, setNumero] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [pollas, setPollas] = useState([]);
  const [mesesOcupados, setMesesOcupados] = useState([]);
  const navigate = useNavigate();

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  useEffect(() => {
    cargarPollas();
  }, []);

  const cargarPollas = async () => {
    try {
      const data = await consultarPollas();
      setPollas(data);

      const ocupados = data.map((p) => p.mes);
      setMesesOcupados(ocupados);
    } catch (error) {
      setMensaje("❌ Error al consultar pollas");
    }
  };

  const handleRegistrar = async (e) => {
    e.preventDefault();

    if (!mes || !numero) {
      setMensaje("⚠️ Debes seleccionar el mes y un número.");
      return;
    }

    try {
      const result = await registrarPolla(mes, numero);
      setMensaje(result);
      setMes(""); 
      setNumero("");
      cargarPollas();
    } catch (error) {
      setMensaje("❌ Error al registrar la polla");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/">
          <Button variant="outline-dark">← Regresar</Button>
        </Link>
        <h2 className="m-0 flex-grow-1 text-center">Registro de Polla Mensual</h2>
        <div style={{ width: "100px" }}></div> 
      </div>

      <form className="card p-3 shadow" onSubmit={handleRegistrar}>
        <div className="mb-3">
          <label className="form-label">Mes</label>
          <select
            className="form-select"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          >
            <option value="">Seleccione un mes...</option>
            {meses.map((m, index) => (
              <option
                key={index}
                value={m}
                disabled={mesesOcupados.includes(m)}
              >
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Número (00 - 99)</label>
          <input
            type="number"
            className="form-control"
            min="0"
            max="99"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-2">
          Registrar
        </button>
      </form>

      {mensaje && (
        <div className="alert alert-info mt-3 text-center">{mensaje}</div>
      )}

      {pollas.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-3">Histórico de Pollas</h4>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Mes</th>
                <th>Número</th>
                <th>Ganador</th>
              </tr>
            </thead>
            <tbody>
              {pollas.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.mes}</td>
                  <td>{p.numero}</td>
                  <td>{p.estado ? "✅ Sí" : "❌ No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
