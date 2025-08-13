import React, { useState, useEffect } from "react";

export default function RegistroGanadorPolla() {
  const [numeroGanador, setNumeroGanador] = useState("");
  const [numerosDisponibles, setNumerosDisponibles] = useState([]);
  const [socios, setSocios] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar datos al iniciar
  useEffect(() => {
    fetchNumerosDisponibles();
    fetchSocios();
  }, []);

  const fetchNumerosDisponibles = async () => {
    try {
      const res = await fetch("http://localhost:5164/api/Socios/NumerosDisponibles");
      if (!res.ok) throw new Error("Error al obtener números disponibles");
      const data = await res.json();
      setNumerosDisponibles(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSocios = async () => {
    try {
      const res = await fetch("http://localhost:5164/api/Socios/ConsultarTodos");
      if (!res.ok) throw new Error("Error al obtener socios");
      const data = await res.json();
      setSocios(data);
    } catch (error) {
      console.error(error);
    }
  };

  const registrarGanador = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResultado(null);

    const socioGanador = socios.find(
      (s) => s.numero?.toString().padStart(2, "0") === numeroGanador
    );

    try {
      // Llamada al backend para guardar el ganador
      const res = await fetch("http://localhost:5164/api/Polla/RegistrarGanador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numeroGanador: numeroGanador,
          socioId: socioGanador ? socioGanador.id : null,
          fecha: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error("Error al registrar ganador");

      setResultado({
        exito: socioGanador ? true : false,
        mensaje: socioGanador
          ? `🎉 El ganador es ${socioGanador.nombre} con el número ${numeroGanador}`
          : `❌ No hubo ganador con el número ${numeroGanador}`
      });

      fetchNumerosDisponibles(); // refrescar lista
    } catch (error) {
      console.error(error);
      setResultado({
        exito: false,
        mensaje: "Error al registrar el ganador en el sistema."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>🏆 Registrar Ganador de la Polla</h2>
      <form onSubmit={registrarGanador}>
        <label>
          Número ganador:
          <input
            type="number"
            min="0"
            max="99"
            value={numeroGanador}
            onChange={(e) =>
              setNumeroGanador(e.target.value.padStart(2, "0"))
            }
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Verificando..." : "Registrar ganador"}
        </button>
      </form>

      {resultado && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: resultado.exito ? "#d4edda" : "#f8d7da",
            borderRadius: "5px"
          }}
        >
          {resultado.mensaje}
        </div>
      )}

      <hr />
      <h4>Números disponibles</h4>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "5px",
          fontSize: "14px"
        }}
      >
        {numerosDisponibles.length > 0 ? (
          numerosDisponibles.map((num) => (
            <span
              key={num}
              style={{
                background: "#eee",
                padding: "4px 6px",
                borderRadius: "4px"
              }}
            >
              {num}
            </span>
          ))
        ) : (
          <span>Cargando...</span>
        )}
      </div>
    </div>
  );
}
