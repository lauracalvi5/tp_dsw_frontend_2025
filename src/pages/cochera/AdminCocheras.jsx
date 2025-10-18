import { useEffect, useState } from "react";
import { FaLockOpen } from "react-icons/fa";
import Header from "../../components/Header/Header.jsx";
import { useNavigate } from "react-router-dom";
import '../../styles/cochera_css/cocheras.css';

export default function AdminCocheras() {
  const [cocheras, setCocheras] = useState([]);
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const handleLogout = () => {
    if (window.confirm('¿Seguro que quieres cerrar sesión?')) {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  
  const obtenerCocheras = async () => {
    try {
      const res = await fetch(`http://localhost:3000/cocheras`);
      const data = await res.json();
      setCocheras(data);
    } catch (error) {
      console.error("Error al obtener cocheras", error);
    }
  };

  useEffect(() => {
    obtenerCocheras();
  }, []);

  const liberarCochera = async (cochera) => {
    const cocheraId = cochera?._id || cochera?.id;
    if (!cocheraId) {
      alert("Cochera inválida");
      return;
    }
    if (!window.confirm("¿Seguro que quieres liberar esta cochera?")) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(
        `http://localhost:3000/cocheras/${cocheraId}/liberar`,
        {
          method: "PUT",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({}) 
        }
      );
      if (res.ok) {
        alert("Cochera liberada");
        obtenerCocheras();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.mensaje || "No se pudo liberar la cochera");
      }
    } catch (error) {
      alert("Error de red");
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Header usuario={usuario} onLogout={handleLogout} />
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="admin-container">
              <h1>Gestión de Cocheras Ocupadas</h1>
              <div className="table-responsive">
                <table className="tabla-cocheras table">
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Estado</th>
                      <th>Estacionamiento</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cocheras.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center text-muted">
                          No hay cocheras ocupadas.
                        </td>
                      </tr>
                    )}

                    {cocheras.map((c) => (
                      <tr key={c._id || c.id}>
                        <td>{c.numero}</td>
                        <td>
                          <span className={`badge ${c.estado === 'ocupada' ? 'bg-danger' : 'bg-success'}`}>
                            {c.estado}
                          </span>
                        </td>
                        <td>
                          {typeof c.estacionamiento === "object"
                            ? c.estacionamiento.nombre
                            : c.estacionamiento}
                        </td>
                        <td>
                          <button
                            className="btn-liberar btn btn-sm"
                            onClick={() => liberarCochera(c)}
                          >
                            <FaLockOpen style={{ marginRight: 4 }} /> Liberar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}