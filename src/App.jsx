import { Link } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="container text-center my-5">
      <h1 className="mb-5 fw-bold text-primary">💰 Natillera 2025</h1>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <Link to="/socios" className="btn btn-info btn-lg w-100 shadow rounded-pill fw-bold">
            🤝 SOCIOS
          </Link>
        </div>

        <div className="col-12 col-md-6">
          <Link to="/ahorros" className="btn btn-warning btn-lg w-100 shadow rounded-pill fw-bold">
            💵 AHORROS
          </Link>
        </div>

        <div className="col-12 col-md-6">
          <Link to="/prestamos" className="btn btn-success btn-lg w-100 shadow rounded-pill fw-bold">
            📄 PRÉSTAMOS
          </Link>
        </div>

        <div className="col-12 col-md-6">
          <Link to="/banco" className="btn btn-primary btn-lg w-100 shadow rounded-pill fw-bold">
            🏦 BANCO
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
