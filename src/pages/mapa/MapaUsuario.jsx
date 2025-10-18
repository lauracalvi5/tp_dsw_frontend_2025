import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Header from "../../components/Header/Header.jsx";
import "../../styles/mapa_css/mapa.css";


const parkingIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const userIcon = new L.DivIcon({
  html: `<div class="user-location"></div>`,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});


async function geocodeDireccion(direccion) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data && data.length > 0) {
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  }
  return null;
}

export default function MapaUsuario() {
  const [estacionamientos, setEstacionamientos] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [maxDistanciaKm, setMaxDistanciaKm] = useState("");
  const [direccionFiltro, setDireccionFiltro] = useState(""); 
  const [precioMax, setPrecioMax] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [modalEst, setModalEst] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('¿Seguro que quieres cerrar sesión?')) {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.error("Error al obtener ubicación:", err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  
  useEffect(() => {
    if (direccionFiltro.trim() === "") return;
    (async () => {
      const coords = await geocodeDireccion(direccionFiltro);
      if (coords) setUserLocation(coords);
    })();
  }, [direccionFiltro]);

 
  useEffect(() => {
  let url = "http://localhost:3000/estacionamientos-disponibles?";
  if (userLocation) url += `lat=${userLocation.lat}&lng=${userLocation.lng}&`;
  if (maxDistanciaKm) url += `maxDistanciaKm=${maxDistanciaKm}&`;
  if (precioMin) url += `precioMin=${precioMin}&`;
  if (precioMax) url += `precioMax=${precioMax}&`;
  if (direccionFiltro) url += `direccion=${encodeURIComponent(direccionFiltro)}&`; 
  console.log("Consultando estacionamientos con URL:", url);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log("Estacionamientos recibidos:", data);
      setEstacionamientos(data);
    })
    .catch((err) => console.error("Error al cargar estacionamientos:", err));
}, [userLocation, maxDistanciaKm, direccionFiltro, precioMin, precioMax]);

  function estaAbierto(est) {
    if (!est || !est.horarioApertura || !est.horarioCierre) return true;
    if (!est.horarioApertura.includes(":") || !est.horarioCierre.includes(":")) return true;
    const ahora = new Date();
    const horaActual = ahora.getHours();
    const minutoActual = ahora.getMinutes();
    const [aperturaHora, aperturaMin] = est.horarioApertura.split(":").map(Number);
    const [cierreHora, cierreMin] = est.horarioCierre.split(":").map(Number);
    if (
      isNaN(aperturaHora) || isNaN(aperturaMin) ||
      isNaN(cierreHora) || isNaN(cierreMin)
    ) return true;

    if (aperturaHora === cierreHora && aperturaMin === cierreMin) return true;

    const minutosActual = horaActual * 60 + minutoActual;
    const minutosApertura = aperturaHora * 60 + aperturaMin;
    const minutosCierre = cierreHora * 60 + cierreMin;
    if (minutosApertura <= minutosCierre) {
      return minutosActual >= minutosApertura && minutosActual < minutosCierre;
    } else {
      return minutosActual >= minutosApertura || minutosActual < minutosCierre;
    }
  }

  return (
    <div className="min-vh-100 bg-light">
      <Header usuario={usuario} onLogout={handleLogout} />
      <div className="container-fluid">
        <div className="row" style={{ height: "calc(100vh - 60px)" }}>
          <aside className="col-md-3 col-lg-2 bg-white border-end p-3">
            <h5 className="mb-3 text-center">Filtros</h5>
            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ciudad, barrio, dirección..."
                value={direccionFiltro}
                onChange={e => setDireccionFiltro(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Precio</label>
              <div className="d-flex align-items-center">
                <input
                  type="number"
                  className="form-control me-2"
                  placeholder="Mín"
                  value={precioMin}
                  onChange={e => setPrecioMin(e.target.value)}
                  min={0}
                />
                <span className="mx-1">-</span>
                <input
                  type="number"
                  className="form-control ms-2"
                  placeholder="Máx"
                  value={precioMax}
                  onChange={e => setPrecioMax(e.target.value)}
                  min={0}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Distancia máxima (km)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Ej: 2"
                value={maxDistanciaKm}
                onChange={e => setMaxDistanciaKm(e.target.value)}
                min={0}
              />
            </div>
          </aside>

          <main className="col-md-6 col-lg-7 p-0 d-flex flex-column">
            <div className="flex-grow-1">
              <MapContainer
                center={userLocation || [-32.9442, -60.6505]}
                zoom={14}
                className="mapa-responsive"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                />
                {userLocation && (
                  <Marker position={userLocation} icon={userIcon}>
                    <Popup>Estás aquí</Popup>
                  </Marker>
                )}
                {estacionamientos
                  .filter(est => est && est.lat !== undefined && est.lng !== undefined)
                  .map((est, idx) => {
                    const key = est._id ? String(est._id) : `est-${idx}`;
                    const lat = Number(est.lat);
                    const lng = Number(est.lng);
                    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
                    return (
                      <Marker key={key} position={[lat, lng]} icon={parkingIcon}>
                        <Popup>
                          <strong>{est.nombre}</strong> <br />
                          Dirección: {est.direccion} <br />
                          Cocheras libres: {est.libres} <br />
                          Precio/Hora: ${est.precioHora}
                          {est.distancia !== undefined && (
                            <>
                              <br />
                              Distancia: {est.distancia.toFixed(2)} km
                            </>
                          )}
                        </Popup>
                      </Marker>
                    );
                  })}
              </MapContainer>
            </div>
          </main>

          <aside className="col-md-3 col-lg-3 bg-white border-start p-3 overflow-auto" style={{ maxHeight: "100vh" }}>
            <h5 className="mb-3 text-center">Estacionamientos</h5>
            {estacionamientos.length === 0 && (
              <div className="text-muted">No hay estacionamientos disponibles.</div>
            )}
            {estacionamientos.map((est, idx) => (
              <button
                key={est._id || idx}
                className="card mb-2 shadow-sm text-start"
                onClick={() => setModalEst(est)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body p-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{est.nombre}</strong>
                    <span className="badge bg-primary">${est.precioHora}/hora</span>
                  </div>
                  <div className="small text-muted">{est.direccion}</div>
                  <div>
                    <span className={`badge ${estaAbierto(est) ? "bg-success" : "bg-danger"} me-1`}>
                      {estaAbierto(est) ? "Abierto" : "Cerrado"}
                    </span>
                    <span className={`badge ${est.libres > 0 ? "bg-info" : "bg-danger"}`}>
                      {est.libres > 0 ? `${est.libres} cocheras disponibles` : "Lleno"}
                    </span>
                  </div>
                  {est.distancia !== undefined && (
                    <div className="small text-muted">Distancia: {est.distancia.toFixed(2)} km</div>
                  )}
                </div>
              </button>
            ))}
           {modalEst && (
              <div className="modal-backdrop-custom">
                <div className="modal-custom">
                  <button className="btn-close" onClick={() => setModalEst(null)} style={{float: "right"}} />
                  <h4 className="mb-3">“{modalEst.nombre}”</h4>
                  {modalEst.imagen && (
                    <img src={modalEst.imagen} alt={modalEst.nombre} className="img-fluid rounded mb-2" style={{maxHeight: 180, objectFit: "cover"}} />
                  )}
                  <div><b>Horarios:</b> {modalEst.horarioApertura || "No especificado"} - {modalEst.horarioCierre || "No especificado"}</div>
                  <div><b>Precio:</b> ${modalEst.precioHora}/hora</div>
                  <div className="mt-2">
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${modalEst.lat},${modalEst.lng}`} target="_blank" rel="noopener noreferrer">
                      ¿Cómo llego?
                    </a>
                  </div>
                  {estaAbierto(modalEst) && (
                    <button
                      className="btn btn-primary w-100 mt-3"
                      onClick={() => navigate("/reservacochera", { state: { estacionamiento: modalEst } })}
                    >
                      Reservar
                    </button>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}