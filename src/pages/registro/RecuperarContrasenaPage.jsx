import { useState } from 'react';
import '../../styles/registro_css/recuperar.css';

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/usuarios/recuperar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    setMensaje(data.mensaje);
  };

  return (
  <div className="recuperar-container d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <form className="recuperar-form" onSubmit={handleSubmit}>
      <h2 className="mb-3 text-center text-primary">Recuperar Contraseña</h2>
      <p className="mb-3 text-center">Ingresá tu email para recibir instrucciones de recuperación.</p>
      <input
        type="email"
        placeholder="Ingresá tu email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="form-control mb-2"
      />
      <button type="submit" className="btn-crear btn w-100 mt-2">
        Enviar correo
      </button>
      {mensaje && <p className="alert alert-info py-2 mt-3">{mensaje}</p>}
    </form>
  </div>
);
}
