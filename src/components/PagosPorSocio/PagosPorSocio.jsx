import { useEffect, useState } from "react";
import { obtenerPagosPorDocumento, obtenerPagosPorMes, actualizarPago } from "../../services/PagoService";
import { obtenerSocios } from "../../services/SocioService";
import { obtenerInteresPorIdPago, registrarInteresPago } from "../../services/InteresPagoService";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";

import BuscarSocioForm from "./BuscarSocioForm";
import BotonesMeses from "./BotonesMeses";
import TablaPagosSocio from "./TablaPagosSocio";
import TablaPagosMensuales from "./TablaPagosMensuales";
import ModalEditarPago from "./ModalEditarPago";
import ModalRegistrarInteres from "./ModalRegistrarInteres";

function PagosPorSocio() {
  const [socios, setSocios] = useState([]);
  const [documento, setDocumento] = useState("");
  const [pagos, setPagos] = useState(null);
  const [pagosMensuales, setPagosMensuales] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState(null);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const [pagoAEditar, setPagoAEditar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [mostrarModalInteres, setMostrarModalInteres] = useState(false);
  const [interesForm, setInteresForm] = useState({ dias: "", valorTotal: "", idPago: null });
  const [errorInteres, setErrorInteres] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    obtenerSocios().then(setSocios).catch(err => console.error("Error al cargar socios:", err));
  }, []);

  const buscarPagos = async () => {
    if (!documento) return setError("Debe seleccionar un socio.");
    try {
      const data = await obtenerPagosPorDocumento(documento);
      setPagos(data);
      setPagosMensuales([]);
      setError("");
    } catch {
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
          if (!pagoId) return { ...p, intereses: 0 };
          try {
            const interesesData = await obtenerInteresPorIdPago(pagoId);
            const valorIntereses =
              Array.isArray(interesesData) && interesesData.length > 0
                ? interesesData.reduce((acc, curr) => acc + (curr.valorTotal || 0), 0)
                : (interesesData?.valorTotal ?? 0);
            return { ...p, intereses: valorIntereses };
          } catch {
            return { ...p, intereses: 0 };
          }
        })
      );
      setPagosMensuales(pagosConIntereses);
    } catch {
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
    setInteresForm({ dias: "", valorTotal: "", idPago: pagoId });
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
      nuevoValorTotal = (!isNaN(diasNum) && diasNum > 0)
        ? (diasNum <= 3 ? 5000 : 5000 + (diasNum - 3) * 1000)
        : "";
    }
    setInteresForm(prev => ({ ...prev, [name]: value, valorTotal: nuevoValorTotal }));
  };

  const guardarInteres = async () => {
    if (!interesForm.idPago) return setErrorInteres("Pago inválido. No se encontró idPago.");
    const diasNum = parseInt(interesForm.dias, 10);
    if (isNaN(diasNum) || diasNum <= 0) return setErrorInteres("Ingrese una cantidad de días válida (> 0).");
    try {
      const dto = { IdPago: interesForm.idPago, Dias: diasNum, ValorTotal: interesForm.valorTotal };
      await registrarInteresPago(dto);
      setMensajeExito("Interés registrado correctamente.");
      cerrarModalInteres();
      if (mesSeleccionado) await buscarPagosDelMes(mesSeleccionado);
      else if (pagos) await buscarPagos();
    } catch {
      setErrorInteres("Error al registrar el interés.");
    }
  };

  return (
    <Container className="mt-5">
      {/* Cabecera */}
      <Row className="mb-4 align-items-center">
        <Col xs="auto">
          <Link to="/"><Button variant="outline-dark">← Regresar</Button></Link>
        </Col>
        <Col><h2 className="mb-0 text-center text-md-start">Consultar Pagos por Socio</h2></Col>
        <Col className="text-end">
          <Button variant="success" onClick={() => navigate("/ahorros/registrar")}>+ Registrar Pago</Button>
        </Col>
      </Row>

      {/* Buscar socio */}
      <BuscarSocioForm socios={socios} documento={documento} setDocumento={setDocumento} buscarPagos={buscarPagos} />

      {/* Botones meses */}
      <BotonesMeses mesSeleccionado={mesSeleccionado} onSeleccionMes={buscarPagosDelMes} />

      {/* Mensajes */}
      {error && <Alert variant="danger">{error}</Alert>}
      {mensajeExito && <Alert variant="success">{mensajeExito}</Alert>}

      {/* Tablas */}
      {pagos && <TablaPagosSocio pagos={pagos} />}
      {pagosMensuales.length > 0 && (
        <TablaPagosMensuales
          pagosMensuales={pagosMensuales}
          mesSeleccionado={mesSeleccionado}
          onEditar={iniciarEdicion}
          onInteres={abrirModalInteres}
        />
      )}

      {/* Modales */}
      <ModalEditarPago show={mostrarModal} pago={pagoAEditar} onClose={() => setMostrarModal(false)} onGuardar={guardarCambios} />
      <ModalRegistrarInteres
        show={mostrarModalInteres}
        error={errorInteres}
        form={interesForm}
        onClose={cerrarModalInteres}
        onChange={handleChangeInteres}
        onGuardar={guardarInteres}
      />
    </Container>
  );
}

export default PagosPorSocio;
