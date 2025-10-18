import { Routes, Route } from "react-router-dom";
import Splash from "./pages/registro/Splash.jsx";
import LoginPage from "./pages/registro/LoginPage.jsx";
import RegistroPage from "./pages/registro/RegistroPage.jsx";
import AdminEstacionamientos from "./pages/estacionamiento/AdminEstacionamientos.jsx";
import MapaUsuario from "./pages/mapa/MapaUsuario.jsx";
import RecuperarContrasenaPage from "./pages/registro/RecuperarContrasenaPage.jsx";
import ResetearContrasenaPage from "./pages/registro/ResetearContrasenaPage.jsx";
import CrearEstacionamientos from "./pages/estacionamiento/CrearEstacionamientos.jsx";
import EditarEstacionamientos from "./pages/estacionamiento/EditarEstacionamientos.jsx";
import AdminCocheras from "./pages/cochera/AdminCocheras.jsx";
import ReservaCochera from "./pages/reservas/ReservaCochera.jsx";
import MisReservas from "./pages/reservas/MisReservas.jsx";
import MisVehiculos from "./pages/vehiculos/MisVehiculos.jsx";
import ChatSoporte from "./pages/chat_soporte/chat.jsx";


const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/recuperar" element={<RecuperarContrasenaPage />} />
      <Route path="/resetear" element={<ResetearContrasenaPage />} />
      <Route path="/mapa" element={<MapaUsuario />} />
      <Route path="/reservacochera" element={<ReservaCochera usuario={usuario} />} />
      <Route path="/misreservas" element={<MisReservas usuario={usuario} />} />
      <Route path="/misvehiculos" element={<MisVehiculos usuario={usuario} />} />
      <Route path="/admin/estacionamientos" element={<AdminEstacionamientos />} />
      <Route path="/admin/estacionamientos/crear" element={<CrearEstacionamientos />} />
      <Route path="/admin/estacionamientos" element={<AdminEstacionamientos />} />
      <Route path="/admin/estacionamientos/editar/:_id" element={<EditarEstacionamientos />} />
      <Route path="/admin/cocheras" element={<AdminCocheras />} />
      <Route path="/admin/chatsoporte" element={<ChatSoporte />} />
      <Route path="/chatsoporte" element={<ChatSoporte usuario={usuario} />} />

    </Routes>
  );
}
