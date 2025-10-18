import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/registro_css/splash.css';
import pin from '../../assets/logo-pin.png'; 
import text from '../../assets/logo-text.png'; 

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
  <div className="splash-container d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
    <div className="logo-group d-flex flex-column align-items-center mb-4">
      <img src={pin} alt="Pin" className="pin-animado mb-2" />
      <img src={text} alt="ParkEase" className="texto-logo" />
    </div>
    <div className="loader mt-3" />
  </div>
);
}

