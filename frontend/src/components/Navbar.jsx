import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>📝 TaskManager</h1>
        </div>
        
        <div className="navbar-menu">
          <button 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-link ${isActive('/kanban') ? 'active' : ''}`}
            onClick={() => navigate('/kanban')}
          >
            Kanban
          </button>
          <button 
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            onClick={() => navigate('/profile')}
          >
            Perfil
          </button>
        </div>

        <div className="navbar-content">
          <button 
            className="btn-dark-mode"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <span className="user-name">{user?.name || 'Usuario'}</span>
          <button className="btn btn-logout" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
