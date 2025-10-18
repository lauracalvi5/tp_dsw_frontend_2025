import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/registro_css/resetear.css';

export default function ResetearContrasenaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setError('');

    const res = await fetch('http://localhost:3000/usuarios/resetear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, nuevaContrasena })
    });

    const data = await res.json();

    if (res.ok) {
      setMensaje(data.mensaje || 'Contraseña cambiada con éxito');
      alert(data.mensaje || 'Contraseña cambiada con éxito');
      navigate('/login');
    } else {
      setError(data.mensaje || 'Error al cambiar la contraseña');
    }
  };

 return (
  <div className="resetear-container d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <form className="resetear-form" onSubmit={handleSubmit}>
      <h2 className="mb-3 text-center text-primary">Elegí tu nueva contraseña</h2>
      <label htmlFor="nuevaContrasena" className="form-label">
        Nueva Contraseña <span className="required">*</span>
      </label>
      <input
        type="password"
        id="nuevaContrasena"
        value={nuevaContrasena}
        onChange={(e) => setNuevaContrasena(e.target.value)}
        required
        autoComplete="new-password"
        className="form-control mb-2"
      />
      <label htmlFor="confirmarContrasena" className="form-label">
        Confirmar Contraseña <span className="required">*</span>
      </label>
      <input
        type="password"
        id="confirmarContrasena"
        value={confirmarContrasena}
        onChange={(e) => setConfirmarContrasena(e.target.value)}
        required
        autoComplete="new-password"
        className="form-control mb-2"
      />
      {error && <p className="error alert alert-danger py-2">{error}</p>}
      {mensaje && <p className="alert alert-info py-2">{mensaje}</p>}
      <button type="submit" className="btn-crear btn w-100 mt-3">
        Guardar
      </button>
    </form>
  </div>
);
}