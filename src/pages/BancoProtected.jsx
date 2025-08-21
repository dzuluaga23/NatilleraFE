import { useState } from "react";
import { Link } from "react-router-dom";
import BancoDashboard from "./BancoDashboard";

export default function BancoProtected() {
  const [autorizado, setAutorizado] = useState(false);
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const CLAVE_CORRECTA = "4321";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (clave === CLAVE_CORRECTA) {
      setAutorizado(true);
    } else {
      setError("❌ Clave incorrecta");
      setClave("");
    }
  };

  if (autorizado) {
    return <BancoDashboard />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "15px" }}
      >
        <div className="text-center mb-4">
          <span style={{ fontSize: "3rem" }}>🔐</span>
          <h3 className="mt-2 fw-bold">Acceso Restringido</h3>
          <p className="text-muted">Ingrese la clave para acceder al banco</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="Ingrese la clave"
              className="form-control text-center"
              style={{ borderRadius: "10px" }}
            />
          </div>
          {error && (
            <p className="text-danger text-center fw-bold mb-3">{error}</p>
          )}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold mb-2"
            style={{ borderRadius: "10px" }}
          >
            Entrar
          </button>
          <Link
            to="/"
            className="btn btn-outline-secondary w-100 fw-bold"
            style={{ borderRadius: "10px" }}
          >
            ← Regresar
          </Link>
        </form>
      </div>
    </div>
  );
}
