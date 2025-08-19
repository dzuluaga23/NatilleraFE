import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Socios from './pages/Socios';
import AgregarSocio from './pages/AgregarSocio';
import SociosInactivos from './pages/SociosInactivos';
import RegistrarPago from './pages/RegistrarPago';
import PagosPorSocio from './pages/PagosPorSocio';
import Polla from './pages/Polla';
import Prestamos from './pages/Prestamos';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/socios" element={<Socios />} />
      <Route path="/socios/agregar" element={<AgregarSocio />} />
      <Route path="/socios/inactivos" element={<SociosInactivos />} />
      <Route path="/ahorros" element={<PagosPorSocio />} />
      <Route path="/ahorros/registrar" element={<RegistrarPago />} />
      <Route path="/polla" element={<Polla />} />
      <Route path="/prestamos" element={<Prestamos />} />

    </Routes>
  </BrowserRouter>
);
