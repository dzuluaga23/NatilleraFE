import { Link } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const opciones = [
  {
    to: "/socios",
    icon: "🤝",
    title: "Socios",
    desc: "Administra los miembros de la natillera, registra nuevos socios y consulta su estado.",
    gradient: "linear-gradient(135deg, #4dd0e1 0%, #00838f 100%)",
  },
  {
    to: "/ahorros",
    icon: "💵",
    title: "Ahorros",
    desc: "Registra y consulta los pagos mensuales de ahorro de cada socio.",
    gradient: "linear-gradient(135deg, #ffd54f 0%, #ff8f00 100%)",
  },
  {
    to: "/prestamos",
    icon: "📄",
    title: "Préstamos",
    desc: "Lleva el control de los préstamos, sus intereses y abonos realizados.",
    gradient: "linear-gradient(135deg, #66bb6a 0%, #2e7d32 100%)",
  },
  {
    to: "/polla",
    icon: "🎲",
    title: "Polla",
    desc: "Organiza y registra las pollas del año con los aportes de cada socio.",
    gradient: "linear-gradient(135deg, #42a5f5 0%, #1565c0 100%)",
  },
  {
    to: "/banco",
    icon: "🏦",
    title: "Banco",
    desc: "Consulta el resumen financiero general y el estado actual del banco. (Protegido)",
    gradient: "linear-gradient(135deg, #7e57c2 0%, #4527a0 100%)",
  },
];

function App() {
  return (
    <div className="home-page">
      <div className="home-hero text-center">
        <span className="home-badge">✨ Gestión Natillera 2025</span>
        <h1 className="home-title">
          💰 Natillera <span className="home-year">2025</span>
        </h1>
        <p className="home-subtitle">
          Tu centro de control financiero: ahorros, préstamos, pollas y banco en un solo lugar.
        </p>
      </div>

      <div className="home-grid">
        {opciones.map((op) => (
          <Link
            key={op.to}
            to={op.to}
            className="home-card"
            style={{ "--card-gradient": op.gradient }}
          >
            <div className="home-card-icon">{op.icon}</div>
            <div className="home-card-body">
              <h3 className="home-card-title">{op.title}</h3>
              <p className="home-card-desc">{op.desc}</p>
              <span className="home-card-cta">Entrar →</span>
            </div>
          </Link>
        ))}
      </div>

      <footer className="home-footer">
        Natillera 2025 · Hecho con ❤️ para la comunidad
      </footer>
    </div>
  );
}

export default App;
