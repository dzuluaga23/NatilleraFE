import { Link } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="container text-center py-5">
      <h1 className="mb-5 fw-bold dashboard-title">💰 Natillera 2025</h1>

      <div className="row g-3 justify-content-center">
        <DashboardButton to="/socios" color="#4dd0e1" icon="🤝" title="SOCIOS" />
        <DashboardButton to="/ahorros" color="#ffca28" icon="💵" title="AHORROS" />
        <DashboardButton to="/prestamos" color="#66bb6a" icon="📄" title="PRÉSTAMOS" />
        <DashboardButton to="/polla" color="#29b6f6" icon="🎲" title="POLLA" />
        <DashboardButton to="/banco" color="#42a5f5" icon="🏦" title="BANCO" />
      </div>
    </div>
  );
}

const DashboardButton = ({ to, color, icon, title }) => (
  <div className="col-12 col-sm-6 col-md-4">
    <Link to={to} className="dashboard-btn" style={{ background: color }}>
      <span className="dashboard-icon">{icon}</span> {title}
    </Link>
  </div>
);

export default App;
