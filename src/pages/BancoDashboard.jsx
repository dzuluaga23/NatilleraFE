import React, { useEffect, useState } from "react";
import { getBanco, actualizarBanco, getResumenGeneral, getResumenPorMes } from "../services/bancoService";
import { Link } from "react-router-dom";
import { Button, Col, Row } from "react-bootstrap";

const meses = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];

const BancoDashboard = () => {
    const [resumen, setResumen] = useState(null);
    const [banco, setBanco] = useState(null);
    const [formBanco, setFormBanco] = useState({ efectivo: "", cuenta: "", ahorro: "" });
    const [resumenesMes, setResumenesMes] = useState([]);
    const [mostrarMensual, setMostrarMensual] = useState(false);

    useEffect(() => {
        loadResumen();
        loadBanco();
        loadResumenMensual(new Date().getFullYear());
    }, []);

    const loadResumen = async () => {
        try {
            const data = await getResumenGeneral();
            setResumen(data);
        } catch (error) {
            console.error("Error al cargar resumen:", error);
        }
    };

    const loadBanco = async () => {
        try {
            const data = await getBanco();
            setBanco(data);
            setFormBanco({
                efectivo: data.efectivo?.toString() || "",
                cuenta: data.cuenta?.toString() || "",
                ahorro: data.ahorro?.toString() || "",
            });
        } catch (error) {
            console.error("Error al cargar banco:", error);
        }
    };

    const loadResumenMensual = async (anio) => {
        try {
            const data = [];
            for (let mes = 1; mes <= 12; mes++) {
                const resumen = await getResumenPorMes(anio, mes);
                data.push({
                    mes: meses[mes - 1],
                    ahorro: resumen.totalAhorros || 0,
                    pollas: resumen.totalPollas || 0,
                    rifas: resumen.totalRifas || 0,
                });
            }
            setResumenesMes(data);
        } catch (error) {
            console.error("Error al cargar resumen mensual:", error);
        }
    };

    const [mensajeBanco, setMensajeBanco] = useState(null); // ➤ Estado para mensajes

    const handleUpdateBanco = async () => {
        try {
            const payload = {
                efectivo: formBanco.efectivo === "" ? 0 : Number(formBanco.efectivo),
                cuenta: formBanco.cuenta === "" ? 0 : Number(formBanco.cuenta),
                ahorro: formBanco.ahorro === "" ? 0 : Number(formBanco.ahorro),
            };

            const updated = await actualizarBanco(payload);
            setBanco(updated);

            setFormBanco({
                efectivo: updated.efectivo?.toString() || "",
                cuenta: updated.cuenta?.toString() || "",
                ahorro: updated.ahorro?.toString() || "",
            });

            setMensajeBanco({ tipo: "success", texto: "Banco actualizado correctamente ✅" });

            setTimeout(() => setMensajeBanco(null), 3000);
        } catch (error) {
            console.error("Error al actualizar banco:", error);

            setMensajeBanco({ tipo: "danger", texto: "Error al actualizar banco ❌" });
            setTimeout(() => setMensajeBanco(null), 3000);
        }
    };


    const totalAhorro = resumenesMes.reduce((acc, r) => acc + r.ahorro, 0);
    const totalPollas = resumenesMes.reduce((acc, r) => acc + r.pollas, 0);
    const totalRifas = resumenesMes.reduce((acc, r) => acc + r.rifas, 0);

    return (
        <div className="container my-5">
            <Row className="mb-4 align-items-center">

                <Col xs="auto">
                    <Link to="/">
                        <Button variant="outline-dark">← Regresar</Button>
                    </Link>
                </Col>

                <Col>
                    <h2 className="mb-0 text-center text-md-start">🏦 Banco - Natillera 2025</h2>
                </Col>
                {resumen && (
                    <Col>
                        <h2 className="fw-bold text-primary">
                            📅 TOTAL HOY: ${resumen.totalHoy.toLocaleString()}
                        </h2>
                    </Col>
                )}
            </Row>

            <div className="row">
                <div className="col-md-8">
                    {resumen && (
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-primary text-white fw-bold">
                                📊 Resumen General
                            </div>
                            <div className="card-body p-0">
                                <table className="table table-bordered mb-0 text-center">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Abonos</th>
                                            <th>Saldo Restante</th>
                                            <th>Interés Pagos</th>
                                            <th>Interés Préstamos</th>
                                            <th>Rifas</th>
                                            <th>Pollas</th>
                                            <th>Ahorros</th>
                                            <th>Préstamos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>${resumen.totalAbonosPrestamos.toLocaleString()}</td>
                                            <td>${resumen.totalSaldoRestantePrestamos.toLocaleString()}</td>
                                            <td>${resumen.totalInteresPagos.toLocaleString()}</td>
                                            <td>${resumen.totalInteresPrestamos.toLocaleString()}</td>
                                            <td>${resumen.totalRifas.toLocaleString()}</td>
                                            <td>${resumen.totalPollas.toLocaleString()}</td>
                                            <td>${resumen.totalAhorros.toLocaleString()}</td>
                                            <td>${resumen.totalPrestamos.toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="p-3 d-flex justify-content-between">
                                    <h5 className="fw-bold text-danger">
                                        🔴 TOTAL GENERAL: ${resumen.granTotal.toLocaleString()}
                                    </h5>

                                    <h5 className="fw-bold text-success">
                                        💰 GANANCIAS: ${resumen.totalGanancias.toLocaleString()}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-warning fw-bold">
                            💵 Estado del Banco
                        </div>
                        <div className="card-body">
                            <table className="table table-bordered text-center mb-4">
                                <thead className="table-light">
                                    <tr>
                                        <th>Efectivo</th>
                                        <th>Cuenta</th>
                                        <th>Otro</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>${Number(banco?.efectivo || 0).toLocaleString()}</td>
                                        <td>${Number(banco?.cuenta || 0).toLocaleString()}</td>
                                        <td>${Number(banco?.ahorro || 0).toLocaleString()}</td>
                                        <td className="fw-bold">
                                            ${(
                                                Number(banco?.efectivo || 0) +
                                                Number(banco?.cuenta || 0) +
                                                Number(banco?.ahorro || 0)
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <h6 className="fw-bold mb-3">✏️ Actualizar montos</h6>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label">Efectivo</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formBanco.efectivo}
                                        onChange={(e) => setFormBanco({ ...formBanco, efectivo: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Cuenta</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formBanco.cuenta}
                                        onChange={(e) => setFormBanco({ ...formBanco, cuenta: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label">Otro</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formBanco.ahorro}
                                        onChange={(e) => setFormBanco({ ...formBanco, ahorro: e.target.value })}
                                    />
                                </div>
                            </div>

                            {mensajeBanco && (
                                <div className={`alert alert-${mensajeBanco.tipo} text-center mt-3 mb-0`} role="alert">
                                    {mensajeBanco.texto}
                                </div>
                            )}

                            <button className="btn btn-success mt-4 w-100 fw-bold" onClick={handleUpdateBanco}>
                                Actualizar Banco
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <button
                        className="btn btn-outline-info fw-bold mb-3 w-100"
                        onClick={() => setMostrarMensual(!mostrarMensual)}
                    >
                        {mostrarMensual ? "Ocultar Resumen por Mes" : " Mostrar Resumen por Mes"}
                    </button>

                    {mostrarMensual && (
                        <div className="card shadow-sm">
                            <div className="card-header bg-info text-white fw-bold">
                                Resumen por Mes
                            </div>
                            <div className="card-body p-0">
                                <table className="table table-sm table-bordered text-center mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Mes</th>
                                            <th>Ahorro</th>
                                            <th>Pollas</th>
                                            <th>Rifas</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resumenesMes.map((r, idx) => (
                                            <tr key={idx}>
                                                <td>{r.mes}</td>
                                                <td>${r.ahorro.toLocaleString()}</td>
                                                <td>${r.pollas.toLocaleString()}</td>
                                                <td>${r.rifas.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                        <tr className="fw-bold table-primary">
                                            <td>TOTAL</td>
                                            <td>${totalAhorro.toLocaleString()}</td>
                                            <td>${totalPollas.toLocaleString()}</td>
                                            <td>${totalRifas.toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BancoDashboard;
