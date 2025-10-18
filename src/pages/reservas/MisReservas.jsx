import { useEffect, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import "../../styles/reserva_css/misreservas.css";

const PERSIST_KEY = "misReservasPersist";

function getId(r) {
  return (r && (r._id || r.id || r.reservaId || r.reserva_id))?.toString() || null;
}

function loadPersisted() {
  try {
    return JSON.parse(localStorage.getItem(PERSIST_KEY) || "[]");
  } catch {
    return [];
  }
}

function savePersisted(list) {
  try {
    localStorage.setItem(PERSIST_KEY, JSON.stringify(list));
  } catch {

  }
}

export default function MisReservas({ usuario }) {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const token = localStorage.getItem("token");

  const mergeWithPersisted = (serverList) => {
    const persisted = loadPersisted();
    const mapServer = new Map();
    (Array.isArray(serverList) ? serverList : []).forEach((s) => {
      const id = getId(s);
      if (!id) return;
      const fechaFinVal = s.fechaFin ? new Date(s.fechaFin) : null;
      const estaVencida = fechaFinVal ? fechaFinVal < new Date() : false;
      const estado = s.estado === "cancelada" ? "cancelada" : (estaVencida ? "vencida" : s.estado);
      mapServer.set(id, { ...s, estado });
    });

    persisted.forEach((p) => {
      const id = getId(p);
      if (!id) return;
      if (mapServer.has(id)) {
        const serverItem = mapServer.get(id);
        serverItem.estado = p.estado || serverItem.estado;
        mapServer.set(id, serverItem);
      }
    });

    const final = Array.from(mapServer.values());

    persisted.forEach((p) => {
      const id = getId(p);
      if (!id) return;
      if (!mapServer.has(id)) {
        final.unshift(p);
      }
    });

    const toPersistMap = new Map();
    final.forEach((f) => {
      const id = getId(f);
      if (!id) return;
      if (f.estado === "cancelada" || f.estado === "vencida") {
        toPersistMap.set(id, f);
      }
    });
    savePersisted(Array.from(toPersistMap.values()));

    return final;
  };

  const fetchReservas = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:3000/cocheras/mis-reservas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const merged = mergeWithPersisted(Array.isArray(data) ? data : []);
      setReservas(merged);
    } catch (e) {
      const persisted = loadPersisted();
      setReservas(persisted);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, [usuario]);

  const handleCancelar = async (reserva) => {
    const fechaFinVal = reserva.fechaFin ? new Date(reserva.fechaFin) : null;
    const estaVencida = fechaFinVal ? fechaFinVal < new Date() : false;
    if (estaVencida || reserva.estado === "cancelada") return;

    if (!window.confirm("¿Seguro que quieres cancelar esta reserva?")) return;
    setCargando(true);

    try {
      const possibleIds = [reserva._id, reserva.id, reserva.cochera?._id, reserva.cochera, reserva.cocheraId, reserva.reservaId].filter(Boolean);
      const cancelId = possibleIds[0] || "";
      const res = await fetch(`http://localhost:3000/cocheras/${cancelId}/cancelar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reservaId: reserva._id || reserva.id }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        
        await fetchReservas();

        const persisted = loadPersisted();
        const id = getId(reserva);
        const entry = { ...reserva, estado: "cancelada" };
        const idx = persisted.findIndex((p) => getId(p) === id);
        if (idx >= 0) {
          persisted[idx] = entry;
        } else {
          persisted.unshift(entry);
        }
        savePersisted(persisted);

      
        setReservas((prev) => {
          const exists = prev.some((r) => getId(r) === id);
          if (exists) {
            return prev.map((r) => (getId(r) === id ? { ...r, estado: "cancelada" } : r));
          }
          return [{ ...entry }, ...prev];
        });

        alert(data.mensaje || "Reserva cancelada");
      } else {
        alert(data.mensaje || "Error al cancelar");
      }
    } catch (err) {
      console.error("Error cancelar reserva:", err);
      alert("Error de red al cancelar");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Header usuario={usuario} />
      <div className="container-fluid p-4">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="reservas-container">
              <h1 className="text-center mb-4">Mis Reservas</h1>
              {reservas.length === 0 ? (
                <div className="alert alert-info text-center">No tienes reservas.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped tabla-reservas">
                    <thead>
                      <tr>
                        <th>Cochera</th>
                        <th>Estacionamiento</th>
                        <th>Estado</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservas.map((r) => {
                        const fechaFinVal = r.fechaFin ? new Date(r.fechaFin) : null;
                        const estaVencida = fechaFinVal ? fechaFinVal < new Date() : false;
                        const estadoMostrado = r.estado === "cancelada" ? "cancelada" : (estaVencida ? "vencida" : r.estado);
                        const puedeCancelar = !estaVencida && r.estado !== "cancelada" && (r.estado === "ocupado" || r.estado === "reservada");

                        return (
                          <tr key={getId(r) || Math.random()}>
                            <td>{r.numero}</td>
                            <td>{r.estacionamiento?.nombre || "-"}</td>
                            <td>{estadoMostrado}</td>
                            <td>{r.fechaInicio ? new Date(r.fechaInicio).toLocaleString() : "-"}</td>
                            <td>{r.fechaFin ? new Date(r.fechaFin).toLocaleString() : "-"}</td>
                            <td>
                              {puedeCancelar ? (
                                <button
                                  className="btn btn-cancelar btn-sm"
                                  onClick={() => handleCancelar(r)}
                                  disabled={cargando}
                                >
                                  Cancelar
                                </button>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
