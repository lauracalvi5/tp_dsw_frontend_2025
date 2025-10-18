import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Header from '../../components/Header/Header';
import '../../styles/chat_soporte_css/chat.css';

const socket = io("http://localhost:3000");

export default function App() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const listRef = useRef(null);
  const [usuario, setUsuario] = useState(null);
   
  const reciveMessage = (message) => {
    setMessages((state) => [...state, message]);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('usuario');
      if (raw) setUsuario(JSON.parse(raw));
    } catch (e) {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    try {
      const bc = new BroadcastChannel('auth-channel');
      bc.postMessage({ type: 'auth-changed' });
      bc.close();
    } catch (e) {}
    setUsuario(null);
    navigate('/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMessage = { body: message, from: "Tú", ts: Date.now() };
    setMessages((prev) => [...prev, newMessage]);
    socket.emit("message", message);
    setMessage("");
  };
  
  useEffect(() => {
    socket.on("message", reciveMessage);
    return () => {
      socket.off("message", reciveMessage);
    };
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-vh-100 bg-light">
      <Header usuario={usuario} onLogout={handleLogout} />

      <div className="chat bg-light min-vh-100">
        <div className="container py-4">
          <h1 className="chat-support-title text-center mb-3">Chat de Soporte</h1>

          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <div className="chat__container">
                <div className="card shadow-sm">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Chat en vivo</h5>
                    <div>
                      <span className="badge bg-success me-2">Conectado</span>
                      <small className="text-muted">{usuario?.nombre || usuario?.email}</small>
                    </div>
                  </div>

                  <div className="card-body p-0">
                    <ul
                      className="list-group list-group-flush chat__messages"
                      ref={listRef}
                      style={{ maxHeight: 360, overflowY: "auto" }}
                    >
                      {messages.map((m, i) => (
                        <li
                          key={i}
                          className={
                            "list-group-item d-flex " +
                            (m.rol === "admin" ? "justify-content-start" : "justify-content-end")
                          }
                        >
                          <div
                            className={
                              "p-2 rounded " + (m.rol === "admin" ? "bg-white text-dark" : "bg-primary text-white")
                            }
                            style={{ maxWidth: "85%" }}
                          >
                            <div className="fw-bold small">{m.from}</div>
                            <div>{m.body}</div>
                            <div className="text-end small text-muted">{new Date(m.ts || Date.now()).toLocaleTimeString()}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card-footer">
                    <form className="d-flex gap-2" onSubmit={handleSubmit}>
                      <input
                        className="form-control"
                        id="message"
                        name="message"
                        type="text"
                        placeholder="Escribe tu mensaje..."
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        aria-label="Mensaje"
                      />
                      <button className="btn btn-primary" type="submit">Enviar</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}