import { useEffect, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import "../../styles/vehiculo_css/misvehiculos.css";

export default function MisVehiculos({ usuario }) {
  const [vehiculos, setVehiculos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:3000/vehiculos", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setVehiculos(Array.isArray(data) ? data : []))
      .catch(() => setVehiculos([]));
  }, [usuario]);

  const handleEliminar = async (vehiculo) => {
    if (!window.confirm("¿Seguro que quieres eliminar este vehículo?")) return;
    setCargando(true);
    try {
      const res = await fetch(`http://localhost:3000/vehiculos/${vehiculo._id || vehiculo.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert("Vehículo eliminado");
        setVehiculos(prev => prev.filter(v => v._id !== vehiculo._id));
      } else {
        alert("Error al eliminar");
      }
    } catch {
      alert("Error de red");
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
            <div className="vehiculos-container">
              <h1 className="text-center mb-4">Mis Vehículos</h1>
              {vehiculos.length === 0 ? (
                <div className="alert alert-info text-center">No tienes vehículos registrados.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped tabla-vehiculos">
                    <thead>
                      <tr>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Patente</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehiculos.map(v => (
                        <tr key={v._id || v.id}>
                          <td>{v.marca}</td>
                          <td>{v.modelo}</td>
                          <td>{v.patente}</td>
                          <td>{typeof v.tipo === "object" ? v.tipo?.descripcion : v.tipo || "-"}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleEliminar(v)}
                              disabled={cargando}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
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