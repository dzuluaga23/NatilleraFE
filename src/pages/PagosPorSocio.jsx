import { useEffect, useState } from "react";
import {
  obtenerPagosPorDocumento,
  actualizarPago,
  obtenerResumenPagosPorMes
} from "../services/PagoService";
import { obtenerSocios } from "../services/SocioService";
import {
  obtenerInteresPorIdPago,
  registrarInteresPago
} from "../services/InteresPagoService";
import { Container, Alert } from "react-bootstrap";

import HeaderSection from "./HeaderSection";
import BuscarPorSocio from "./BuscarPorSocio";
import BuscarPorMes from "./BuscarPorMes";
import TablaPagosSocio from "./TablaPagosSocio";
import TablaPagosMensuales from "./TablaPagosMensuales";
import EditarPagoModal from "./EditarPagoModal";
import RegistrarInteresModal from "./RegistrarInteresModal";

export default function PagosPorSocio() {
  const [socios, setSocios] = useState([]);
  const [documento, setDocumento] = useState("");
  const [pagos, setPagos] = useState(null);

  const [pagosMensuales, setPagosMensuales] = useState([]);
  const [totalesMes, setTotalesMes] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState(null);

  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const [pagoAEditar, setPagoAEditar] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [intereses, setIntereses] = useState({});
  const [mostrarModalInteres, setMostrarModalInteres] = useState(false);
  const [interesForm, setInteresForm] = useState({
    dias: "",
    valorTotal: "",
    idPago: null
  });
  const [errorInteres, setErrorInteres] = useState("");

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

  useEffect(() => {
    if (pagosMensuales.length === 0) return;

    const fetchIntereses = async () => {
      const interesesMap = {};
      let sumaIntereses = 0;

      await Promise.all(
        pagosMensuales.map(async (p) => {
          try {
            const interes = await obtenerInteresPorIdPago(p.idPago);
            if (interes && interes.length > 0) {
              interesesMap[p.idPago] = interes[0];
              sumaIntereses += Number(interes[0].valorTotal) || 0;
            }
          } catch {
          }
        })
      );

      setIntereses(interesesMap);
      setTotalesMes((prev) => ({
        ...(prev || { ahorro: 0, polla: 0, rifa: 0 }),
        interes: sumaIntereses
      }));
    };

    fetchIntereses();
  }, [pagosMensuales]);

  const buscarPagos = async () => {
    if (!documento) {
      setError("Debe seleccionar un socio.");
      return;
    }
    try {
      const data = await obtenerPagosPorDocumento(documento);
      setPagos(data);
      setPagosMensuales([]);
      setTotalesMes(null);
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
    setMensajeExito("");

    try {
      const resumen = await obtenerResumenPagosPorMes(mes, anio);
      setPagosMensuales(resumen.socios || []);
      setTotalesMes({
        ahorro: resumen.totalAhorro,
        polla: resumen.totalPolla,
        rifa: resumen.totalRifa
      });
    } catch (err) {
      console.error("Error al obtener pagos del mes:", err);
      setError("No se pudieron cargar los pagos del mes.");
    }
  };

  const iniciarEdicion = (pago) => {
    setPagoAEditar({
      id: pago.idPago,
      ahorro: pago.ahorro,
      polla: pago.polla,
      rifa: pago.rifa,
      fechaPago: (pago.fechaPago || "").split("T")[0]
    });
    setMostrarModal(true);
  };

  const guardarCambios = async () => {
    if (!pagoAEditar) return;

    const dto = {
      idPago: pagoAEditar.id,
      ahorro: parseFloat(pagoAEditar.ahorro),
      polla: parseFloat(pagoAEditar.polla),
      rifa: parseFloat(pagoAEditar.rifa),
      fechaPago: pagoAEditar.fechaPago
    };

    try {
      const mensaje = await actualizarPago(dto);
      setMensajeExito(mensaje || "Pago actualizado correctamente.");
      setMostrarModal(false);
      if (mesSeleccionado) {
        await buscarPagosDelMes(mesSeleccionado);
      } else if (documento) {
        await buscarPagos();
      }
    } catch (err) {
      setError(err?.message || "Error al actualizar el pago.");
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
      } else if (documento) {
        await buscarPagos();
      }
    } catch (err) {
      console.error("Error registrando interés:", err);
      setErrorInteres("Error al registrar el interés. Revisa la consola.");
    }
  };

  return (
    <Container className="mt-5">
      <HeaderSection />

      <BuscarPorSocio
        socios={socios}
        documento={documento}
        setDocumento={setDocumento}
        onBuscar={buscarPagos}
      />

      <BuscarPorMes
        mesSeleccionado={mesSeleccionado}
        onBuscarMes={buscarPagosDelMes}
      />

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {mensajeExito && <Alert variant="success" className="mt-3">{mensajeExito}</Alert>}

      {pagos && <TablaPagosSocio pagos={pagos} />}

      {pagosMensuales.length > 0 && (
        <TablaPagosMensuales
          mesSeleccionado={mesSeleccionado}
          pagosMensuales={pagosMensuales}
          intereses={intereses}
          totalesMes={totalesMes}
          iniciarEdicion={iniciarEdicion}
          abrirModalInteres={abrirModalInteres}
        />
      )}

      <EditarPagoModal
        show={mostrarModal}
        pagoAEditar={pagoAEditar}
        setPagoAEditar={setPagoAEditar}
        onHide={() => setMostrarModal(false)}
        onGuardar={guardarCambios} 
      />

      <RegistrarInteresModal
        show={mostrarModalInteres}
        interesForm={interesForm}
        errorInteres={errorInteres}
        onChange={handleChangeInteres}
        onGuardar={guardarInteres}
        onHide={cerrarModalInteres}
      />
    </Container>
  );
}
