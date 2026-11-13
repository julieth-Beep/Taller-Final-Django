import { useState } from 'react';
import { API_URL } from '../../shared/api';

export default function Login({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const respuesta = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuario, password: clave }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok && datos.token) {
        onLoginSuccess(datos.token);
      } else {
        setError(datos.detalle || 'Credenciales inválidas.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <div 
        className="imageSide" 
        style={{ backgroundImage: `url(https://i.pinimg.com/736x/24/d2/9a/24d29a9287ab18e1f22fb5d756e0a961.jpg)` }}
      >
        <div className="imageOverlay">
          <h1 className="welcomeText">CINE</h1>
        </div>
      </div>

      <div className="formSide">
        <div className="formContainer">
          <div className="brand">
            <h1 className="brandTitle">Catálogo de Películas</h1>
            <p className="brandSubtitle">Inicia sesión para gestionar el catálogo</p>
          </div>

          <form className="form" onSubmit={handleSubmit}>
            {error && (
              <div style={{ color: '#ef4444', fontSize: '14px', textAlign: 'center' }}>
                {error}
              </div>
            )}
            
            <input 
              type="text" 
              placeholder="Usuario" 
              value={usuario} 
              onChange={(e) => setUsuario(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={clave} 
              onChange={(e) => setClave(e.target.value)} 
              required 
            />

            <div className="actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}