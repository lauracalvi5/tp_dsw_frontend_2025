import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaBars, FaBuilding, FaCar, FaHeadset, FaCog, FaSignOutAlt, FaMapMarkedAlt, FaClipboardList } from 'react-icons/fa';
import './Header.css';

function safeBase64UrlDecode(str) {
  try {
    const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
    return atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, '='));
  } catch (e) {
    return null;
  }
}

function decodeJwtRole(token) {
  if (!token) return null;
  try {
    if (token.startsWith('Bearer ')) token = token.slice(7);
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    const jsonStr = safeBase64UrlDecode(payload);
    if (!jsonStr) return null;
    const obj = JSON.parse(jsonStr);
    return obj?.rol || obj?.role || obj?.roleName || (obj?.user && (obj.user.rol || obj.user.role)) || null;
  } catch (e) {
    return null;
  }
}

export default function Header({ usuario, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [role, setRole] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const tokenRole = decodeJwtRole(token);
    const derived = tokenRole ?? usuario?.rol ?? null;
    setRole(derived);
  }, [usuario]);

  useEffect(() => {
    function onStorage(e) {
      try {
        if (!e) return;
        if (e.key === 'token' || e.key === 'authChange') {
          const newToken = localStorage.getItem('token');
          const newRole = decodeJwtRole(newToken);
          setRole(newRole ?? null);
          console.debug('[Header] storage event -> key:', e.key, 'newRole:', newRole);
        }
      } catch (err) {}
    }
    window.addEventListener('storage', onStorage);

    let bc;
    try {
      bc = new BroadcastChannel('auth-channel');
      bc.onmessage = (ev) => {
        if (!ev) return;
        const { type } = ev.data || {};
        if (type === 'auth-changed') {
          const t = localStorage.getItem('token');
          const r = decodeJwtRole(t);
          setRole(r ?? null);
          console.debug('[Header] bc message -> role:', r);
        }
      };
    } catch (err) {
    }

    return () => {
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
    };
  }, []);

  useEffect(() => {
    setShowUserMenu(false);
    setShowMainMenu(false);
  }, [location.pathname, role]);

  const esAdmin = role === 'admin';
  const headerClass = esAdmin ? 'admin-header' : 'cliente-header';

  const handleLogout = () => {
    if (window.confirm('¿Seguro que quieres cerrar sesión?')) {
      localStorage.removeItem('token');
      try {
        localStorage.setItem('authChange', Date.now().toString());
      } catch (e) { }
      try {
        const bc = new BroadcastChannel('auth-channel');
        bc.postMessage({ type: 'auth-changed' });
        bc.close();
      } catch (e) { }
      onLogout();
    }
  };

  return (
    <>
      <header className={headerClass}>
        <div className="logo">
          <img src="/src/assets/Logo ParkEasy horizontal.png" alt="ParkEase" />
        </div>

        <div className="header-icons" style={{ position: 'relative' }}>
          <button
            className="icon user-btn"
            onClick={() => { setShowUserMenu((v) => !v); setShowMainMenu(false); }}
            aria-label="Usuario"
          >
            <FaUser />
          </button>

          {showUserMenu && (
            <div className={`menu-desplegable ${esAdmin ? 'admin-menu' : 'cliente-menu'}`} style={{ right: 16 }}>
              <div className="menu-header">{usuario?.nombre || usuario?.email || 'Usuario'}</div>
              <button
                className="logout-btn"
                onClick={() => { setShowUserMenu(false); handleLogout(); }}
              >
                <FaSignOutAlt style={{ marginRight: 8 }} /> Cerrar sesión
              </button>
            </div>
          )}

          <button
            className="icon menu-btn"
            onClick={() => { setShowMainMenu((v) => !v); setShowUserMenu(false); }}
            aria-label="Abrir menú"
          >
            <FaBars />
          </button>

          {showMainMenu && (
            <div className={`menu-desplegable ${esAdmin ? 'admin-menu' : 'cliente-menu'}`} style={{ right: 16 }}>
              {esAdmin ? (
                <>
                  <button onClick={() => { setShowMainMenu(false); navigate('/admin/estacionamientos'); }}>
                    <FaBuilding style={{ marginRight: 8 }} /> Gestión Estacionamientos
                  </button>
                  <button onClick={() => { setShowMainMenu(false); navigate('/admin/cocheras'); }}>
                    <FaCar style={{ marginRight: 8 }} /> Gestión Cocheras
                  </button>
                  <button onClick={() => { setShowMainMenu(false); navigate('/admin/chatsoporte'); }}>
                    <FaHeadset style={{ marginRight: 8 }} /> Soporte
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setShowMainMenu(false); navigate('/misvehiculos'); }}>
                    <FaCar style={{ marginRight: 8 }} /> Mis Vehículos
                  </button>
                  <button onClick={() => { setShowMainMenu(false); navigate('/misreservas'); }}>
                    <FaClipboardList style={{ marginRight: 8 }} /> Mis Reservas
                  </button>
                  <button onClick={() => { setShowMainMenu(false); navigate('/chatsoporte'); }}>
                    <FaHeadset style={{ marginRight: 8 }} /> Soporte
                  </button>
                  <button onClick={() => { setShowMainMenu(false); navigate('/mapa'); }}>
                    <FaMapMarkedAlt style={{ marginRight: 8 }} /> Mapa
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {(showUserMenu || showMainMenu) && <div className="menu-overlay" onClick={() => { setShowUserMenu(false); setShowMainMenu(false); }} />}
    </>
  );
}