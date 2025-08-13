import { useEffect, useState } from "react";
import {
  obtenerPagosPorDocumento,
  obtenerPagosPorMes,
  actualizarPago
} from "../services/PagoService";
import { obtenerSocios } from "../services/SocioService";
import { obtenerInteresPorIdPago, registrarInteresPago } from "../services/InteresPagoService";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Row,
  Col,
  Table,
  Alert,
  Form,
  Modal
} from "react-bootstrap";

function PagosPorSocio() {
  const [socios, setSocios] = useState([]);
  const [documento, setDocumento] = useState("");
  const [pagos, setPagos] = useState(null);
  const [pagosMensuales, setPagosMensuales] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState(null);
  const [error, setError] = useState("");

  const [pagoAEditar, setPagoAEditar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  const [mostrarModalInteres, setMostrarModalInteres] = useState(false);
  const [interesForm, setInteresForm] = useState({
    dias: "",
    valorTotal: "",
    idPago: null
  });
  const [errorInteres, setErrorInteres] = useState("");

  // Nuevo estado para el switch
  const [dividirPollaPorMes, setDividirPollaPorMes] = useState({});


  const [numerosGanadores, setNumerosGanadores] = useState({});
  const [mesGanador, setMesGanador] = useState(null);
  const [numeroGanadorTemp, setNumeroGanadorTemp] = useState("");
  const [mostrarModalGanador, setMostrarModalGanador] = useState(false);
  const navigate = useNavigate();


  // NUEVO - cargar datos de localStorage
  useEffect(() => {
    const guardados = localStorage.getItem("numerosGanadores");
    if (guardados) {
      setNumerosGanadores(JSON.parse(guardados));
    }
  }, []);

  // NUEVO - abrir modal
  const abrirModalGanador = (mes) => {
    setMesGanador(mes);
    setNumeroGanadorTemp(numerosGanadores[mes] || "");
    setMostrarModalGanador(true);
  };

  // NUEVO - guardar número en localStorage
  const guardarNumeroGanador = () => {
    const nuevos = { ...numerosGanadores, [mesGanador]: numeroGanadorTemp };
    setNumerosGanadores(nuevos);
    localStorage.setItem("numerosGanadores", JSON.stringify(nuevos));
    setMostrarModalGanador(false);
  };

  useEffect(() => {
    const cargarSocios = async () => {
      try {
        const data = await obtenerSocios();
        setSocios(data);
      } catch (err) {
        console.error("Error al cargar socios:", err);
      }
    };

    cargarSocios();
  }, []);

  const buscarPagos = async () => {
    if (!documento) {
      setError("Debe seleccionar un socio.");
      return;
    }

    try {
      const data = await obtenerPagosPorDocumento(documento);
      setPagos(data);
      setPagosMensuales([]);
      setError("");
    } catch (err) {
      setPagos(null);
      setError("No se encontraron pagos para el documento.");
    }
  };

  const buscarPagosDelMes = async (mes) => {
    const anio = new Date().getFullYear();
    setMesSeleccionado(mes);
    setPagos(null);
    setDocumento("");
    setError("");

    try {
      const data = await obtenerPagosPorMes(mes, anio);

      const pagosConIntereses = await Promise.all(
        data.map(async (p) => {
          const pagoId = p.idPago ?? p.IdPago ?? p.id;
          if (!pagoId) {
            console.warn("Pago sin idPago válido:", p);
            return { ...p, intereses: 0 };
          }
          try {
            const interesesData = await obtenerInteresPorIdPago(pagoId);
            const valorIntereses =
              Array.isArray(interesesData) && interesesData.length > 0
                ? interesesData.reduce((acc, curr) => acc + (curr.valorTotal || 0), 0)
                : (interesesData?.valorTotal ?? 0);
            return { ...p, intereses: valorIntereses };
          } catch (err) {
            console.error(`Error obteniendo intereses para pago ${pagoId}:`, err);
            return { ...p, intereses: 0 };
          }
        })
      );

      setPagosMensuales(pagosConIntereses);
    } catch (err) {
      console.error("Error al obtener pagos del mes:", err);
      setError("No se encontraron pagos para ese mes.");
    }
  };

  const iniciarEdicion = (pago) => {
    setPagoAEditar({
      id: pago.idPago,
      ahorro: pago.ahorro,
      polla: pago.polla,
      rifa: pago.rifa,
      fechaPago: pago.fechaPago.split("T")[0]
    });
    setMostrarModal(true);
  };

  const guardarCambios = async () => {
    const dto = {
      idPago: pagoAEditar.id,
      ahorro: parseFloat(pagoAEditar.ahorro),
      polla: parseFloat(pagoAEditar.polla),
      rifa: parseFloat(pagoAEditar.rifa),
      fechaPago: pagoAEditar.fechaPago
    };

    try {
      const mensaje = await actualizarPago(dto);
      setMensajeExito(mensaje);
      setMostrarModal(false);
      await buscarPagosDelMes(mesSeleccionado);
    } catch (err) {
      setError(err.message);
    }
  };

  const abrirModalInteres = (pago) => {
    const pagoId = pago.idPago ?? pago.IdPago ?? pago.id ?? null;
    setErrorInteres("");
    setInteresForm({
      dias: "",
      valorTotal: "",
      idPago: pagoId
    });
    setMostrarModalInteres(true);
  };

  const cerrarModalInteres = () => {
    setMostrarModalInteres(false);
    setErrorInteres("");
    setInteresForm({ dias: "", valorTotal: "", idPago: null });
  };

  const handleChangeInteres = (e) => {
    const { name, value } = e.target;
    let nuevoValorTotal = interesForm.valorTotal;

    if (name === "dias") {
      const diasNum = parseInt(value, 10);
      if (!isNaN(diasNum) && diasNum > 0) {
        nuevoValorTotal = diasNum <= 3 ? 5000 : 5000 + (diasNum - 3) * 1000;
      } else {
        nuevoValorTotal = "";
      }
    }

    setInteresForm((prev) => ({
      ...prev,
      [name]: value,
      valorTotal: nuevoValorTotal
    }));
  };

  const guardarInteres = async () => {
    if (!interesForm.idPago) {
      setErrorInteres("Pago inválido. No se encontró idPago.");
      return;
    }
    const diasNum = parseInt(interesForm.dias, 10);
    if (isNaN(diasNum) || diasNum <= 0) {
      setErrorInteres("Ingrese una cantidad de días válida (> 0).");
      return;
    }

    try {
      const dto = {
        IdPago: interesForm.idPago,
        Dias: diasNum,
        ValorTotal: interesForm.valorTotal
      };

      await registrarInteresPago(dto);
      setMensajeExito("Interés registrado correctamente.");
      cerrarModalInteres();

      if (mesSeleccionado) {
        await buscarPagosDelMes(mesSeleccionado);
      } else if (pagos) {
        await buscarPagos();
      }
    } catch (err) {
      console.error("Error registrando interés:", err);
      setErrorInteres("Error al registrar el interés. Revisa la consola.");
    }
  };

  return (
    <Container className="mt-5">
      {/* Cabecera */}
      <Row className="mb-4 align-items-center">
        <Col xs="auto">
          <Link to="/">
            <Button variant="outline-dark">← Regresar</Button>
          </Link>
        </Col>
        <Col>
          <h2 className="mb-0 text-center text-md-start">
            Consultar Pagos por Socio
          </h2>
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={() => navigate("/ahorros/registrar")}>
            + Registrar Pago
          </Button>
        </Col>
      </Row>

      {/* Buscar por socio */}
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
        <Button variant="primary" onClick={buscarPagos}>
          Buscar
        </Button>
      </Form>

      {/* Botones de meses con número ganador */}
      <Row className="mb-3 justify-content-center">
        {[...Array(12)].map((_, i) => {
          const mes = i + 1;
          return (
            <Col xs="auto" key={i} className="text-center">
              <Button
                variant={mesSeleccionado === mes ? "dark" : "outline-dark"}
                onClick={() => buscarPagosDelMes(mes)}
              >
                {new Date(0, i).toLocaleString("es", { month: "long" }).toUpperCase()}
              </Button>
              <div className="mt-1">
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => abrirModalGanador(mes)}
                >
                  Nº ganador
                </Button>
                {numerosGanadores[mes] && (
                  <div className="small mt-1 text-success">
                    {numerosGanadores[mes]}
                  </div>
                )}
              </div>
            </Col>
          );
        })}
      </Row>

      {/* Modal Nº ganador */}
      <Modal show={mostrarModalGanador} onHide={() => setMostrarModalGanador(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Registrar Nº ganador - {mesGanador && new Date(0, mesGanador - 1).toLocaleString("es", { month: "long" })}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Número ganador</Form.Label>
              <Form.Control
                type="text"
                value={numeroGanadorTemp}
                onChange={(e) => setNumeroGanadorTemp(e.target.value)}
                placeholder="Ej: 1234"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalGanador(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarNumeroGanador}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Botones de meses
      <Row className="mb-3 justify-content-center">
        {[...Array(12)].map((_, i) => (
          <Col xs="auto" key={i}>
            <Button
              variant={mesSeleccionado === i + 1 ? "dark" : "outline-dark"}
              onClick={() => buscarPagosDelMes(i + 1)}
            >
              {new Date(0, i).toLocaleString("es", { month: "long" }).toUpperCase()}
            </Button>
          </Col>
        ))}
      </Row> */}

      {/* Mensajes */}
      {error && <Alert variant="danger">{error}</Alert>}
      {mensajeExito && <Alert variant="success">{mensajeExito}</Alert>}

      {/* Tabla por socio */}
      {pagos && (
        <div>
          <h5>Socio: {pagos.nombre}</h5>
          <p><strong>Documento:</strong> {pagos.documento}</p>
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
                  <td>${p.ahorro.toFixed(2)}</td>
                  <td>${p.polla.toFixed(2)}</td>
                  <td>${p.rifa.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="table-secondary">
              <tr>
                <th>Totales:</th>
                <th>${pagos.totalAhorro.toFixed(2)}</th>
                <th>${pagos.totalPolla.toFixed(2)}</th>
                <th>${pagos.totalRifa.toFixed(2)}</th>
              </tr>
            </tfoot>
          </Table>
        </div>
      )}

      <Form.Check
        type="switch"
        id={`switch-dividir-polla-${mesSeleccionado}`}
        label="Dividir total de la polla a la mitad"
        checked={!!dividirPollaPorMes[mesSeleccionado]}
        onChange={() => setDividirPollaPorMes(prev => ({
          ...prev,
          [mesSeleccionado]: !prev[mesSeleccionado]
        }))}
      />


      {/* Tabla mensual */}
      {pagosMensuales.length > 0 && (
        <div className="mt-4">
          <h4 className="text-center mb-3">
            Pagos del mes de {new Date(0, mesSeleccionado - 1).toLocaleString("es", { month: "long" }).toUpperCase()}
          </h4>
          {(() => {
            const totalAhorro = pagosMensuales.reduce((acc, p) => acc + (p.ahorro || 0), 0);
            let totalPolla = pagosMensuales.reduce((acc, p) => acc + (p.polla || 0), 0);


            const totalRifa = pagosMensuales.reduce((acc, p) => acc + (p.rifa || 0), 0);
            const totalIntereses = pagosMensuales.reduce((acc, p) => acc + (p.intereses || 0), 0);

            return (
              <Table bordered hover className="text-center align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Socio</th>
                    <th>Documento</th>
                    <th>Ahorro</th>
                    <th>Polla</th>
                    <th>Rifa</th>
                    <th>Intereses</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pagosMensuales.map((p, i) => (
                    <tr key={i}>
                      <td>{p.nombre}</td>
                      <td>{p.documento}</td>
                      <td>${p.ahorro.toFixed(2)}</td>
                      <td>${p.polla.toFixed(2)}</td>
                      <td>${p.rifa.toFixed(2)}</td>
                      <td>${p.intereses?.toFixed(2) || "0.00"}</td>
                      <td>{p.fechaPago.split("T")[0]}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => iniciarEdicion(p)}>
                          Editar
                        </Button>
                        <Button
                          variant="info"
                          size="sm"
                          className="ms-2"
                          onClick={() => abrirModalInteres(p)}
                        >
                          Intereses
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-secondary">
                  <tr>
                    <th colSpan={2}>Totales:</th>
                    <th>${totalAhorro.toFixed(2)}</th>
                    <th>${totalPolla.toFixed(2)}</th>
                    <th>${totalRifa.toFixed(2)}</th>
                    <th>${totalIntereses.toFixed(2)}</th>
                    <th colSpan={2}></th>
                  </tr>

                  {dividirPollaPorMes[mesSeleccionado] && (
                    <tr>
                      <th colSpan={2}>Polla / 2:</th>
                      <th></th>
                      <th>${(totalPolla / 2).toFixed(2)}</th>
                      <th colSpan={4}></th>
                    </tr>
                  )}
                </tfoot>

              </Table>
            );
          })()}
        </div>
      )}

      {/* Modal editar pago */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
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
                  onChange={(e) => setPagoAEditar({ ...pagoAEditar, ahorro: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Polla</Form.Label>
                <Form.Control
                  type="number"
                  value={pagoAEditar.polla}
                  onChange={(e) => setPagoAEditar({ ...pagoAEditar, polla: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Rifa</Form.Label>
                <Form.Control
                  type="number"
                  value={pagoAEditar.rifa}
                  onChange={(e) => setPagoAEditar({ ...pagoAEditar, rifa: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Pago</Form.Label>
                <Form.Control
                  type="date"
                  value={pagoAEditar.fechaPago}
                  onChange={(e) => setPagoAEditar({ ...pagoAEditar, fechaPago: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarCambios}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal interés */}
      <Modal show={mostrarModalInteres} onHide={cerrarModalInteres}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar Interés</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorInteres && <Alert variant="danger">{errorInteres}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Días</Form.Label>
              <Form.Control
                type="number"
                name="dias"
                value={interesForm.dias}
                onChange={handleChangeInteres}
                placeholder="Número de días"
                min={1}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Valor Total Calculado</Form.Label>
              <Form.Control
                type="text"
                value={interesForm.valorTotal ? `$${interesForm.valorTotal}` : ""}
                readOnly
              />
            </Form.Group>

            <Form.Text className="text-muted">
              Pago: {interesForm.idPago ?? "—"}
            </Form.Text>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModalInteres}>
            Cancelar
          </Button>
          <Button variant="success" onClick={guardarInteres}>
            Registrar Interés
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default PagosPorSocio;
