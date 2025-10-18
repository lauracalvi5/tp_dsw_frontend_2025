import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import "../../styles/reserva_css/reservaCochera.css";

export default function ReservaCochera({ usuario }) {
  const location = useLocation();
  const navigate = useNavigate();
  const estacionamiento = location.state?.estacionamiento;

  const handleLogout = () => {
    if (window.confirm('¿Seguro que quieres cerrar sesión?')) {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const [vehiculos, setVehiculos] = useState([]);
  const [tiposVehiculo, setTiposVehiculo] = useState([]);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState("");
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    patente: "",
    marca: "",
    modelo: "",
    tipo: "",
  });
  const [cargando, setCargando] = useState(false);
  const [agregandoNuevo, setAgregandoNuevo] = useState(false);

  
  const [duracion, setDuracion] = useState({ tipo: "horas", cantidad: 1 });
  const [duracionMinutos, setDuracionMinutos] = useState(60);
  const [cocheraReservada, setCocheraReservada] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(null);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const usuarioId = usuario?.id;
    if (token && usuarioId) {
      fetch(`http://localhost:3000/vehiculos?usuarioId=${usuarioId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          console.log("Vehiculos recibidos:", data);
          setVehiculos(Array.isArray(data) ? data : []);
        })
        .catch(error => console.error("Error fetching vehiculos:", error));
    } else if (!token) {
      console.warn("No token found. Cannot fetch vehiculos.");
    } else if (!usuarioId) {
      console.warn("No usuarioId found. Cannot fetch vehiculos.");
    }

    fetch("http://localhost:3000/tipos-vehiculo")
      .then(res => res.json())
      .then(data => setTiposVehiculo(Array.isArray(data) ? data : []))
      .catch(error => console.error("Error fetching tipos-vehiculo:", error));
  }, [usuario]);

  
  useEffect(() => {
    let minutos = 60;
    if (duracion.tipo === "horas") minutos = duracion.cantidad * 60;
    else if (duracion.tipo === "dias") minutos = duracion.cantidad * 24 * 60;
    else if (duracion.tipo === "minutos") minutos = duracion.cantidad;
    setDuracionMinutos(minutos);
  }, [duracion]);

  
  useEffect(() => {
    setAgregandoNuevo(!vehiculos || vehiculos.length === 0);
  }, [vehiculos]);

  
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token || !estacionamiento?._id) return;
  fetch(`http://localhost:3000/cocheras/libres?estacionamientoId=${estacionamiento._id}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta cocheras libres:", data);
      setCocherasLibres(Array.isArray(data) ? data : []);
    })
    .catch(error => console.error("Error fetching cocheras libres:", error));
}, [estacionamiento]);

 
  useEffect(() => {
    if (!cocheraReservada?.fechaFin) {
      setTiempoRestante(null);
      return;
    }
    const calc = () => {
      const fin = new Date(cocheraReservada.fechaFin);
      const ahora = new Date();
      const diff = Math.max(0, Math.floor((fin - ahora) / 60000)); 
      setTiempoRestante(diff);
    };
    calc();
    const timer = setInterval(calc, 60000);
    return () => clearInterval(timer);
  }, [cocheraReservada]);

  const handleNuevoVehiculoChange = (e) => {
    setNuevoVehiculo({ ...nuevoVehiculo, [e.target.name]: e.target.value });
  };

  
  const handleAgregarVehiculo = async (e) => {
    e.preventDefault();
    if (!nuevoVehiculo.tipo || nuevoVehiculo.tipo.length !== 24) {
      alert("Selecciona un tipo de vehículo válido.");
      setCargando(false);
      return;
    }
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/vehiculos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          patente: nuevoVehiculo.patente,
          marca: nuevoVehiculo.marca,
          modelo: nuevoVehiculo.modelo,
          tipo: nuevoVehiculo.tipo,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setVehiculos([...vehiculos, data]);
        setVehiculoSeleccionado(data._id || data.id);
        setAgregandoNuevo(false);
        setNuevoVehiculo({ patente: "", marca: "", modelo: "", tipo: "" });
      } else {
        alert(data.mensaje || "Error al agregar vehículo");
      }
    } catch (err) {
      alert("Error de red");
    } finally {
      setCargando(false);
    }
  };
  
  
const [cocherasLibres, setCocherasLibres] = useState([]);


  function handleReservar(e) {
    e.preventDefault();
      if (!vehiculoSeleccionado) {
        alert("Selecciona un vehículo");
        return;
      }
      if (!Array.isArray(cocherasLibres) || cocherasLibres.length === 0) {
        alert("No hay cocheras libres");
        return;
      }
      const cocheraId = cocherasLibres[0]._id;

      setCargando(true);
      const token = localStorage.getItem("token");
      fetch(`http://localhost:3000/cocheras/reservar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          vehiculoId: vehiculoSeleccionado,
          duracionMinutos,
          estacionamientoId: estacionamiento._id,

        }),
      })
        .then(res => res.json().then(data => ({ ok: res.ok, data })))
        .then(({ ok, data }) => {
          if (ok) {
            setCocheraReservada(data.cochera);
            alert("Reserva realizada con éxito");
            navigate("/mapa");
          } else {
            alert(data.mensaje || "Error al reservar");
          }
        })
        .catch(() => alert("Error de red"))
        .finally(() => setCargando(false));
  }

 
  const handleCancelarReserva = async () => {
    const cocheraId = cocheraReservada?._id || cocheraReservada?.id;
    if (!cocheraId) return;
    if (!window.confirm("¿Seguro que quieres cancelar la reserva?")) return;
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/cocheras/${cocheraId}/cancelar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },

      });
      const data = await res.json();
      console.log("Respuesta cancelar:", res.status, data);
      if (res.ok) {
        setCocheraReservada(null);
        alert("Reserva cancelada");
      } else {
        alert(data.mensaje || "Error al cancelar");
      }
    } catch (err) {
      alert("Error de red");
    } finally {
      setCargando(false);
    }
  };
 
  if (!estacionamiento) {
    return (
      <div className="min-vh-100 bg-light">
        <Header usuario={usuario} onLogout={handleLogout} />
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
          <div>
            <h4>No se seleccionó ningún estacionamiento.</h4>
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Volver al mapa
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
    <Header usuario={usuario} onLogout={handleLogout} />
    <div className="reserva-page container my-4">
      <h1 className="text-center mb-2">Reserva de Cochera</h1>
      <div className="reserva-form crear-form">
        {cocheraReservada ? (
          <div className="alert alert-info">
            <b>Cochera reservada:</b> N° {cocheraReservada.numero}
            <br />
            <b>Estado:</b> {cocheraReservada.estado}
            <br />
            <b>Fin de reserva:</b> {new Date(cocheraReservada.fechaFin).toLocaleString()}
            <br />
            <b>Tiempo restante:</b> {tiempoRestante !== null ? `${tiempoRestante} minutos` : "Calculando..."}
            <br />
            <button className="btn btn-danger mt-2" onClick={handleCancelarReserva} disabled={cargando}>
              Cancelar reserva
            </button>
          </div>
        ) : agregandoNuevo ? (
              <form className="crear-form" onSubmit={handleAgregarVehiculo} autoComplete="off">
                <div className="mb-2">
                  <label htmlFor="patente" className="form-label">Patente</label>
                  <input
                    type="text"
                    className="form-control"
                    name="patente"
                    value={nuevoVehiculo.patente}
                    onChange={handleNuevoVehiculoChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="marca" className="form-label">Marca</label>
                  <input
                    type="text"
                    className="form-control"
                    name="marca"
                    value={nuevoVehiculo.marca}
                    onChange={handleNuevoVehiculoChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="modelo" className="form-label">Modelo</label>
                  <input
                    type="text"
                    className="form-control"
                    name="modelo"
                    value={nuevoVehiculo.modelo}
                    onChange={handleNuevoVehiculoChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="tipo" className="form-label">Tipo de vehículo</label>
                  <select
                    className="form-control"
                    name="tipo"
                    value={nuevoVehiculo.tipo}
                    onChange={handleNuevoVehiculoChange}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {tiposVehiculo.map(tipo => (
                      <option key={tipo.id || tipo._id || tipo.descripcion} value={tipo.id || tipo._id}>
                        {tipo.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn btn-success w-100 mt-2" disabled={cargando}>
                  {cargando ? "Guardando..." : "Guardar vehículo"}
                </button>
                {vehiculos.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-link w-100"
                    style={{ textDecoration: "underline" }}
                    onClick={() => setAgregandoNuevo(false)}
                  >
                    Volver a la lista de vehículos
                  </button>
                )}
              </form>
            ) : (
              <form className="crear-form" onSubmit={handleReservar} autoComplete="off">
                <div className="mb-2">
                  <label htmlFor="vehiculo" className="form-label">Selecciona tu vehículo</label>
                  <select
                    className="form-control"
                    value={vehiculoSeleccionado}
                    onChange={e => setVehiculoSeleccionado(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar</option>
                    {vehiculos.map(v => (
                      <option key={v._id?.toString() || v.id || v.patente} value={v._id?.toString() || v.id}>
                        {v.patente} - {v.marca} {v.modelo} ({v.tipo?.descripcion || "Sin tipo"})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label htmlFor="duracion" className="form-label">Duración de la reserva</label>
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      min={1}
                      className="form-control"
                      value={duracion.cantidad}
                      onChange={e => setDuracion({ ...duracion, cantidad: Number(e.target.value) })}
                      required
                      style={{ maxWidth: 100 }}
                    />
                    <select
                      className="form-control"
                      value={duracion.tipo}
                      onChange={e => setDuracion({ ...duracion, tipo: e.target.value })}
                      style={{ maxWidth: 120 }}
                    >
                      <option value="minutos">Minutos</option>
                      <option value="horas">Horas</option>
                      <option value="dias">Días</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-2" disabled={cargando}>
                  {cargando ? "Reservando..." : "Confirmar reserva"}
                </button>
                <button
                  type="button"
                  className="btn btn-link w-100"
                  style={{ textDecoration: "underline" }}
                  onClick={() => setAgregandoNuevo(true)}
                >
                  Agregar nuevo vehículo
                </button>
                <button type="button" className="btn btn-warning w-100 mt-2" disabled>
                  Pagar con Mercado Pago (próximamente)
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
  );
}