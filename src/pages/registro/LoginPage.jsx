import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/registro_css/login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    contrasena: ''
  });
 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          contrasena: form.contrasena
        })
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Login exitoso:', data);
        console.log('Usuario logueado:', data.usuario);
        console.log('Rol del usuario:', data.usuario?.rol);
        alert(data.mensaje || 'Inicio de sesión correcto');

        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        localStorage.setItem('token', data.token);

        try {
          localStorage.setItem('authChange', Date.now().toString());
        } catch (err) {
        }
        try {
          const bc = new BroadcastChannel('auth-channel');
          bc.postMessage({ type: 'auth-changed' });
          bc.close();
        } catch (err) {
        }

        if (data.usuario?.rol === 'admin') {
          navigate('/admin/estacionamientos');
        } else {
          navigate('/mapa');
        }
      } else {
        alert(data?.mensaje || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      alert('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="login-container d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <form className="login-form"  onSubmit={handleSubmit}>
          <img src="/src/assets/Logo ParkEasy.png" alt="Logo" className="logo mb-3 mx-auto d-block" />
          <h2 className="mb-3 text-center text-primary">Iniciar Sesión</h2>
          <p className="text-center mb-3">
            ¿Es tu primera vez? <a href="/registro">Registrate</a>
          </p>
          <label htmlFor="email" className="form-label">
            Email <span className="required">*</span>
          </label>
          {error && (
            <div className="error-message alert alert-danger py-2 mb-2">
              {error}
            </div>
          )}
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="username"
            className="form-control mb-2"
          />
          <label htmlFor="contrasena" className="form-label">
            Contraseña <span className="required">*</span>
          </label>
          <input
            type="password"
            name="contrasena"
            id="contrasena"
            placeholder="Contraseña"
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="current-password"
            className="form-control mb-2"
          />
          <a href="/recuperar" className="d-block mb-3 text-left text-decoration-none">¿Olvidaste la contraseña?</a>
          <button type="submit" className="btn-crear btn w-100 mt-2" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    ); 
}
