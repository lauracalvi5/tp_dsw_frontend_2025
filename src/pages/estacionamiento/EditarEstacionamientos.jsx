import { useState, useEffect } from "react"; 
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import "../../styles/estacionamiento_css/editarestacionamiento.css";

export default function EditarEstacionamiento() {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    lat: "",
    lng: "",
    capacidad: "",
    precioHora: "",
  });
 
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const userId = usuario?.id || usuario?._id;
  if (!userId) {
    alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
    navigate("/login");
    return;
  }
  const { _id } = useParams();
  const location = useLocation();


useEffect(() => {
  console.log('ID desde URL:', _id);

  if (!_id) {
    alert("ID de estacionamiento no válido");
    navigate("/admin/estacionamientos");
    return;
  }

  if (location.state?.estacionamiento) {
    const data = location.state.estacionamiento;
    console.log('Datos desde state:', data);
    setForm({
      nombre: data.nombre || "",
      direccion: data.direccion || "",
      lat: data.lat || "",
      lng: data.lng || "",
      capacidad: data.capacidad || "",
      precioHora: data.precioHora || "",
    });
  } else {
    const cargarEstacionamiento = async () => {
    try {
      const token = localStorage.getItem("token"); 
      console.log('Cargando estacionamiento con ID:', _id);
      const res = await fetch(`http://localhost:3000/estacionamientos/${_id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Datos cargados:', data);
        setForm({
          nombre: data.nombre || "",
          direccion: data.direccion || "",
          lat: data.lat || "",
          lng: data.lng || "",
          capacidad: data.capacidad || "",
          precioHora: data.precioHora || "",
        });
      } else {
        const errorData = await res.json();
        console.error('Error al cargar:', errorData);
        alert("Error al cargar el estacionamiento");
        navigate("/admin/estacionamientos");
      }
    } catch (error) {
      console.error("Error de red al cargar:", error);
      alert("Error al cargar el estacionamiento");
      navigate("/admin/estacionamientos");
    }
  };

    cargarEstacionamiento();
  }
}, [_id, navigate, location.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const userId = usuario?.id || usuario?._id;
  const token = localStorage.getItem("token"); 

  try {
    const datosFormateados = {
      ...form,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
      capacidad: parseInt(form.capacidad),
      precioHora: parseFloat(form.precioHora),
      userId,
    };

    console.log('Enviando datos:', datosFormateados);

    const res = await fetch(`http://localhost:3000/estacionamientos/${_id}?userId=${userId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(datosFormateados),
    });

    console.log('Status de respuesta:', res.status);

    if (res.ok) {
      const data = await res.json();
      console.log('Respuesta exitosa:', data);
      alert("Estacionamiento editado con éxito");
      navigate("/admin/estacionamientos");
    } else {
      const errorData = await res.json();
      console.error('Error del servidor:', errorData);
      alert(errorData.mensaje || "Error al editar estacionamiento");
    }
  } catch (error) {
    console.error('Error de red:', error);
    alert("Error de conexión al editar estacionamiento");
  }
};

function handleLogout() {
  localStorage.removeItem("usuario");
  localStorage.removeItem("token");
  window.location.href = "/login";
}

return (
  <div className="min-vh-100 bg-light">
    <Header usuario={usuario} onLogout={handleLogout} />
    <div className="crear-page container my-4">
      <h1 className="text-center mb-2">Gestión de Estacionamientos</h1>
      <h2 className="text-center mb-4 text-primary">Editar Estacionamiento</h2>
      <form className="crear-form" onSubmit={handleSubmit}>
        <label htmlFor="nombre" className="form-label">Nombre del estacionamiento</label>
        <input
          id="nombre"
          type="text"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />

        <label htmlFor="direccion" className="form-label">Dirección del estacionamiento</label>
        <input
          id="direccion"
          type="text"
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />

        <div className="fila row g-2 mb-2">
          <div className="col">
            <label htmlFor="lat" className="form-label">Latitud</label>
            <input
              id="lat"
              type="text"
              name="lat"
              value={form.lat}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="col">
            <label htmlFor="lng" className="form-label">Longitud</label>
            <input
              id="lng"
              type="text"
              name="lng"
              value={form.lng}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
        </div>

        <label htmlFor="capacidad" className="form-label">Capacidad del estacionamiento</label>
        <input
          id="capacidad"
          type="number"
          name="capacidad"
          value={form.capacidad}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />

        <label htmlFor="precioHora" className="form-label">Precio por hora</label>
        <input
          id="precioHora"
          type="number"
          name="precioHora"
          value={form.precioHora}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />

        <button type="submit" className="btn-crear btn w-100 mt-3">
          Editar
        </button>
      </form>
    </div>
  </div>
);

}