import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaEdit, FaPlus} from "react-icons/fa";
import Header from "../../components/Header/Header.jsx";
import "../../styles/estacionamiento_css/adminestacionamiento.css";

export default function AdminEstacionamientos() {
  const [estacionamientos, setEstacionamientos] = useState([]);

  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const handleLogout = () => {
  if (window.confirm('¿Seguro que quieres cerrar sesión?')) {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    navigate('/login');
  }
};

 
  const obtenerEstacionamientos = async () => {
    try {
      const res = await fetch("http://localhost:3000/estacionamientos");
      const data = await res.json();
      console.log("Datos del servidor:", data);
      setEstacionamientos(data);
    } catch (error) {
      console.error("Error al obtener estacionamientos", error);
    }
  };

  useEffect(() => {
    obtenerEstacionamientos();
  }, []);
  
  
  const eliminarEstacionamiento = async (estacionamiento) => {
  if (!window.confirm("¿Seguro que quieres eliminar este estacionamiento?")) return;

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem('token');
  const userId = usuario?.id || usuario?._id;
  const estacionamientoId = estacionamiento._id || estacionamiento.id;

  const res = await fetch(
    `http://localhost:3000/estacionamientos/${estacionamientoId}?userId=${userId}`,
    {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}),
    }
  );
  if (res.ok) {
    alert("Estacionamiento eliminado con éxito");
    obtenerEstacionamientos();
  } else {
    const data = await res.json().catch(() => ({}));
    alert(data.mensaje || "Error al eliminar estacionamiento");
  }
};


  const editarEstacionamiento = (estacionamiento) => {
    navigate(`/admin/estacionamientos/editar/${estacionamiento._id}`, {
       state: { estacionamiento }
    });
  };

  return (
    <div className="min-vh-100 bg-light">
      <Header usuario={usuario} onLogout={handleLogout} />
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">
            <div className="admin-container">
              <h1>Gestión de Estacionamientos</h1>

              <div className="table-responsive">
                  <table className="tabla-estacionamientos">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Capacidad</th>
                        <th>Cocheras libres</th>
                        <th>Precio Por Hora</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estacionamientos.map((e) => (
                        <tr key={e._id}>
                          <td>{e.nombre}</td>
                          <td>{e.direccion}</td>
                          <td>{e.capacidad}</td>
                          <td>{e.libres}</td>
                          <td>${e.precioHora}</td>
                      <td>
                      <div className="d-flex justify-content-center gap-2 btn-group">
                        <button
                          className="btn-editar btn btn-sm"
                          onClick={() => editarEstacionamiento(e)}
                        >
                          <FaEdit /> Editar
                        </button>
                       <button
                          className="btn-eliminar btn btn-sm"
                          onClick={() => eliminarEstacionamiento(e)}
                        >
                          <FaTrash /> Eliminar
                        </button>
                      </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center añadir-estacionamiento">
                  <button
                    className="btn-anadir"
                    onClick={() => navigate("/admin/estacionamientos/crear")}
                  >
                    <FaPlus /> Añadir Estacionamiento
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
}