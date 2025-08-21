import React, { useState, useEffect } from "react";
import {
  obtenerPrestamos,
  registrarPrestamo,
  obtenerPrestamosPorSocio,
} from "../services/prestamoService";
import {
  obtenerAbonosPorPrestamo,
  registrarAbono,
} from "../services/abonoService";
import {
  obtenerInteresesPorPrestamo,
  registrarInteres,
} from "../services/InteresPrestamoService";
import { obtenerSocios } from "../services/socioService";
import { Link } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

function Prestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [socios, setSocios] = useState([]);
  const [valor, setValor] = useState("");
  const [fecha, setFecha] = useState("");
  const [idSocio, setIdSocio] = useState("");
  const [idSocioConsulta, setIdSocioConsulta] = useState("");

  const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);

  const [abonos, setAbonos] = useState([]);
  const [valorAbono, setValorAbono] = useState("");
  const [fechaAbono, setFechaAbono] = useState("");
  const [errorAbono, setErrorAbono] = useState("");
  const [loadingAbono, setLoadingAbono] = useState(false);
  const [showModalAbono, setShowModalAbono] = useState(false);

  const [intereses, setIntereses] = useState([]);
  const [valorInteres, setValorInteres] = useState("");
  const [fechaInteres, setFechaInteres] = useState("");
  const [errorInteres, setErrorInteres] = useState("");
  const [loadingInteres, setLoadingInteres] = useState(false);
  const [showModalInteres, setShowModalInteres] = useState(false);

  useEffect(() => {
    cargarPrestamos();
    cargarSocios();
  }, []);

  const cargarPrestamos = async () => {
    try {
      const data = await obtenerPrestamos();
      setPrestamos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarSocios = async () => {
    try {
      const data = await obtenerSocios();
      setSocios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      await registrarPrestamo({
        valor: parseFloat(valor),
        idSocio: parseInt(idSocio),
        fecha: fecha,
      });
      await cargarPrestamos();
      setValor("");
      setFecha("");
      setIdSocio("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleConsultaSocio = async () => {
    try {
      const data = await obtenerPrestamosPorSocio(idSocioConsulta);
      setPrestamos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const abrirModalAbono = async (prestamo) => {
    try {
      setPrestamoSeleccionado(prestamo);
      setErrorAbono("");
      setValorAbono("");
      setFechaAbono("");

      const dataAbonos = await obtenerAbonosPorPrestamo(prestamo.id);
      setAbonos(dataAbonos);

      setShowModalAbono(true);
    } catch (error) {
      console.error(error);
    }
  };

  const abrirModalInteres = async (prestamo) => {
    try {
      setPrestamoSeleccionado(prestamo);
      setErrorInteres("");
      setValorInteres("");
      setFechaInteres("");

      const dataIntereses = await obtenerInteresesPorPrestamo(prestamo.id);
      setIntereses(dataIntereses);

      setShowModalInteres(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegistrarAbono = async (e) => {
    e.preventDefault();
    setErrorAbono("");
    setLoadingAbono(true);
    try {
      await registrarAbono({
        idPrestamo: prestamoSeleccionado.id,
        valor: parseFloat(valorAbono),
        fecha: fechaAbono,
      });
      const data = await obtenerAbonosPorPrestamo(prestamoSeleccionado.id);
      setAbonos(data);
      setValorAbono("");
      setFechaAbono("");
      await cargarPrestamos();
      setShowModalAbono(false);
    } catch (error) {
      console.error(error);
      setErrorAbono(error?.message || "Ocurrió un error al registrar el abono");
    } finally {
      setLoadingAbono(false);
    }
  };

  const handleRegistrarInteres = async (e) => {
    e.preventDefault();
    setErrorInteres("");
    setLoadingInteres(true);
    try {
      await registrarInteres({
        idPrestamo: prestamoSeleccionado.id,
        valor: parseFloat(valorInteres),
        fecha: fechaInteres,
      });
      const data = await obtenerInteresesPorPrestamo(prestamoSeleccionado.id);
      setIntereses(data);
      setValorInteres("");
      setFechaInteres("");
      await cargarPrestamos();
      setShowModalInteres(false);
    } catch (error) {
      console.error(error);
      setErrorInteres(error?.message || "Ocurrió un error al registrar el interés");
    } finally {
      setLoadingInteres(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/">
          <Button variant="outline-dark">← Regresar</Button>
        </Link>
        <h2 className="m-0 flex-grow-1 text-center">Gestión de Préstamos</h2>
        <div style={{ width: "100px" }}></div>
      </div>

      {/* Registrar Préstamo */}
      <div className="card p-3 mb-4">
        <h4>Registrar Préstamo</h4>
        <form onSubmit={handleRegistrar}>
          <div className="mb-3">
            <label className="form-label">Valor</label>
            <input
              type="number"
              className="form-control"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Socio</label>
            <select
              className="form-select"
              value={idSocio}
              onChange={(e) => setIdSocio(e.target.value)}
              required
            >
              <option value="">Seleccione un socio</option>
              {socios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            Registrar
          </button>
        </form>
      </div>

      <div className="card p-3 mb-4">
        <h4>Consultar Préstamos por Socio</h4>
        <div className="d-flex">
          <select
            className="form-select me-2"
            value={idSocioConsulta}
            onChange={(e) => setIdSocioConsulta(e.target.value)}
          >
            <option value="">Seleccione un socio</option>
            {socios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
          <button className="btn btn-success" onClick={handleConsultaSocio}>
            Consultar
          </button>
        </div>
      </div>

      <div className="card p-3">
        <h4>Listado de Préstamos</h4>
        <div style={{ maxHeight: "205px", overflowY: "auto" }}>
          <table className="table table-striped mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Socio</th>
                <th>Valor</th>
                <th>Fecha</th>
                <th>Fecha Corte</th>
                <th>Total Intereses</th>
                <th>Total Abonos</th>
                <th>Saldo Pendiente</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {prestamos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombreSocio}</td>
                  <td>{p.valor}</td>
                  <td>{p.fecha}</td>
                  <td>{p.fechaCorte}</td>
                  <td>{p.totalIntereses}</td>
                  <td>{p.totalAbonos}</td>
                  <td>{p.saldoPendiente}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => abrirModalAbono(p)}
                    >
                      Registrar Abono
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => abrirModalInteres(p)}
                    >
                      Registrar Interés
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModalAbono} onHide={() => setShowModalAbono(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Registrar Abono</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {prestamoSeleccionado && (
            <>
              <p><b>Socio:</b> {prestamoSeleccionado.nombreSocio}</p>
              <p><b>Saldo Pendiente:</b> {prestamoSeleccionado.saldoPendiente}</p>

              <form onSubmit={handleRegistrarAbono} className="mb-3">
                <div className="d-flex mb-2">
                  <input
                    type="number"
                    className="form-control me-2"
                    placeholder="Valor del abono"
                    value={valorAbono}
                    onChange={(e) => setValorAbono(e.target.value)}
                    required
                  />
                  <input
                    type="date"
                    className="form-control me-2"
                    value={fechaAbono}
                    onChange={(e) => setFechaAbono(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary" disabled={loadingAbono}>
                    {loadingAbono ? "Procesando..." : "Abonar"}
                  </button>
                </div>
                {errorAbono && <div className="alert alert-danger mt-2">{errorAbono}</div>}
              </form>

              <h5>Historial de Abonos</h5>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Valor</th>
                    <th>Valor Restante</th>
                  </tr>
                </thead>
                <tbody>
                  {abonos.map((a) => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.fecha}</td>
                      <td>{a.valor}</td>
                      <td>{a.valorRestante}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showModalInteres} onHide={() => setShowModalInteres(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Registrar Interés</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {prestamoSeleccionado && (
            <>
              <p><b>Socio:</b> {prestamoSeleccionado.nombreSocio}</p>
              <p><b>Saldo Pendiente:</b> {prestamoSeleccionado.saldoPendiente}</p>

              <form onSubmit={handleRegistrarInteres} className="mb-3">
                <div className="d-flex mb-2">
                  <input
                    type="number"
                    className="form-control me-2"
                    placeholder="Valor del interés"
                    value={valorInteres}
                    onChange={(e) => setValorInteres(e.target.value)}
                    required
                  />
                  <input
                    type="date"
                    className="form-control me-2"
                    value={fechaInteres}
                    onChange={(e) => setFechaInteres(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-warning" disabled={loadingInteres}>
                    {loadingInteres ? "Procesando..." : "Agregar Interés"}
                  </button>
                </div>
                {errorInteres && <div className="alert alert-danger mt-2">{errorInteres}</div>}
              </form>

              <h5>Historial de Intereses</h5>
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {intereses.map((i) => (
                    <tr key={i.id}>
                      <td>{i.id}</td>
                      <td>{i.fecha}</td>
                      <td>{i.valor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Prestamos;
