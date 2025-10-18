import { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import "../../styles/estacionamiento_css/crearEstacionamiento.css";

export default function CrearEstacionamiento() {
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    lat: "",
    lng: "",
    capacidad: "",
    precioHora: "",
    horarioApertura: "",
    horarioCierre: "",
  });

  const [opciones, setOpciones] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [buscarTexto, setBuscarTexto] = useState(""); 

  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  
  const recargarOpciones = (inputValue) => {
    fetch(`http://localhost:3000/estacionamientos2/buscar?nombre=${encodeURIComponent(inputValue)}`)
      .then(res => res.json())
      .then(data => {
        setOpciones(
          Array.isArray(data)
            ? data.map(op => ({
                value: op._id,
                label: op.nombre,
                ...op,
              }))
            : []
        );
      })
      .catch(() => setOpciones([]));
  };

  
  const handleSelectChange = (opcion) => {
    setSelectedOption(opcion);
    if (opcion) {
      setForm({
        ...form,
        nombre: opcion.nombre,
        direccion: opcion.direccion,
        lat: opcion.lat,
        lng: opcion.lng,
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleInputChange = (inputValue) => {
    setBuscarTexto(inputValue);
    recargarOpciones(inputValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/estacionamientos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form,
        activo: true
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Estacionamiento creado con éxito");
      navigate("/admin/estacionamientos");
    } else {
      alert(data.mensaje || "Error al crear estacionamiento");
    }
  };

  return (
      <div className="min-vh-100 bg-light">
        <Header usuario={usuario} onLogout={handleLogout} />
        <div className="crear-page container my-4">
          <h1 className="text-center mb-2">Gestión de Estacionamientos</h1>
          <h2 className="text-center mb-4 text-primary">Crear Estacionamiento</h2>
          <form className="crear-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-2">
              <label htmlFor="buscarNombre" className="form-label">Buscar estacionamiento</label>
              <Select
                id="buscarNombre"
                options={opciones}
                value={selectedOption}
                onChange={handleSelectChange}
                onInputChange={handleInputChange}
                placeholder="Escriba o seleccione..."
                isClearable
                noOptionsMessage={() => "Sin opciones"}
                classNamePrefix="react-select"
                onMenuOpen={() => recargarOpciones("")} 
              />
            </div>

            <label htmlFor="nombre" className="form-label">Nombre del estacionamiento</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="form-control mb-2"
              autoComplete="off"
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
              autoComplete="off"
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
                  autoComplete="off"
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
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="fila row g-2 mb-2">
              <div className="col">
                <label htmlFor="horario-apertura" className="form-label">Hora de Apertura</label>
                <input
                  id="horario-apertura"
                  type="time"
                  name="horarioApertura"
                  value={form.horarioApertura}
                  onChange={handleChange}
                  required
                  className="form-control"
                  autoComplete="off"
                />
              </div>
              <div className="col">
                <label htmlFor="horario-cierre" className="form-label">Hora de Cierre</label>
                <input
                  id="horario-cierre"
                  type="time"
                  name="horarioCierre"
                  value={form.horarioCierre}
                  onChange={handleChange}
                  required
                  className="form-control"
                  autoComplete="off"
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
              Crear
            </button>
          </form>
        </div>
      </div>
  );
}