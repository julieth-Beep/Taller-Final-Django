import { useState } from 'react';
import Explorador from '../features/explorador/Explorador';
import Dashboard from '../features/dashboard/Dashboard';
import Login from '../features/auth/Login';

// logo imagenn sidebar
const IconLogo = () => (
  <img
    src="https://i.pinimg.com/1200x/17/9f/24/179f24fd2833f6f8db920d6c3486b034.jpg"
    alt="Logo"
    style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }}
  />
);

const IconDashboard = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const IconProduct = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const IconLogout = () => (
  <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

export default function App() {
  const [token, setToken] = useState(null);
  const [vista, setVista] = useState('explorador');
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleLoginSuccess = (nuevoToken) => {
    setToken(nuevoToken);
    setMostrarModal(true);
  };

  const handleLogout = () => {
    setToken(null);
    setVista('explorador');
    setMostrarModal(false);
  };

  // vista login
  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // vista de modal de exito
  if (mostrarModal) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2 className="modal-title">Login Exitoso!</h2>
          <p className="modal-text">Tu token ha sido guardado correctamente.<br /><br /><strong>Token:</strong> {token.substring(0, 20)}...</p>
          <button className="modal-button" onClick={() => setMostrarModal(false)}>
            Entrar al Catálogo
          </button>
        </div>
      </div>
    );
  }

  //vista principal
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <IconLogo />
          Cinema
        </div>

        <nav className="sidebar-menu">
          <button
            className={`nav-item ${vista === 'dashboard' ? 'active' : ''}`}
            onClick={() => setVista('dashboard')}
          >
            <IconDashboard />
            Dashboard
          </button>

          <button
            className={`nav-item ${vista === 'explorador' ? 'active' : ''}`}
            onClick={() => setVista('explorador')}
          >
            <IconProduct />
            Películas
          </button>
        </nav>

        <div className="upgrade-card">
          <img
            src="https://i.pinimg.com/1200x/51/5e/3d/515e3d8ace2021e3fb2639f6ee4bb7b7.jpg"
            alt="Explorando catálogo"
            className="upgrade-image"
          />
        </div>

        <button className="logout-item" onClick={handleLogout}>
          <IconLogout />
          Cerrar Sesión
        </button>
      </aside>

      {/* mainn */}
      <main className="main-content">
        {vista === 'explorador' && <Explorador />}
        {vista === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}