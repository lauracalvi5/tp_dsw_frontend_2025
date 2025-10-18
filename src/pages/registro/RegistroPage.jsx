import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/registro_css/registro.css';

export default function RegistroPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    confirmarContrasena: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.contrasena !== form.confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError('');

    const res = await fetch('http://localhost:3000/usuarios/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        contrasena: form.contrasena
      })
    });

    const data = await res.json();
    if (res.ok) {
    alert(data.mensaje);
    navigate('/login');
  } else {
    setError(data.mensaje || 'Error al registrar usuario');
  }
     

    
  };

  return (
  <div className="registro-container d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <form className="registro-form"onSubmit={handleSubmit}>
      <img src="/src/assets/Logo ParkEasy.png" alt="Logo" className="logo mb-3 mx-auto d-block" />
      <h2 className="mb-3 text-center text-primary">Registro</h2>
      <label htmlFor="nombre" className="form-label">
        Nombre <span className="required">*</span>
      </label>
      <input
        type="text"
        name="nombre"
        placeholder="Ingrese su nombre completo"
        onChange={handleChange}
        required
        className="form-control mb-2"
      />
      <label htmlFor="apellido" className="form-label">
        Apellido <span className="required">*</span>
      </label>
      <input
        type="text"
        name="apellido"
        placeholder="Ingrese su apellido"
        onChange={handleChange}
        required
        className="form-control mb-2"
      />
      <label htmlFor="email" className="form-label">
        Email <span className="required">*</span>
      </label>
      <input
        type="email"
        name="email"
        placeholder="Ingrese su correo"
        onChange={handleChange}
        required
        className="form-control mb-2"
      />
      <label htmlFor="contrasena" className="form-label">
        Contraseña <span className="required">*</span>
      </label>
      <input
        type="password"
        name="contrasena"
        placeholder="Ingrese su contraseña"
        onChange={handleChange}
        required
        className="form-control mb-2"
      />
      <label htmlFor="confirmarContrasena" className="form-label">
        Confirmar Contraseña <span className="required">*</span>
      </label>
      <input
        type="password"
        name="confirmarContrasena"
        placeholder="Confirme su contraseña"
        onChange={handleChange}
        required
        className="form-control mb-2"
      />

      {error && <p className="error alert alert-danger py-2">{error}</p>}

      <button type="submit" className="btn-crear btn w-100 mt-3">
        Registrarse
      </button>
      <p className="text-center mt-3">
        ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
      </p>
    </form>
  </div>
);
}
