import { useState } from 'react';
import { API_URL } from '../../shared/api';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [token, setToken] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');
    setToken(null);

    try {
      const respuesta = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuario, password: clave }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok && datos.token) {
        setToken(datos.token);
        setMensaje('¡Login exitoso! Token guardado en memoria.');
      } else {
        setMensaje(datos.detalle || 'Credenciales inválidas.');
      }
    } catch (error) {
      setMensaje('Error de conexión con el servidor.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          style={{ padding: '10px' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Entrar</button>
      </form>

      {mensaje && <p style={{ marginTop: '20px', color: token ? 'green' : 'red' }}>{mensaje}</p>}
      {token && <p style={{ wordBreak: 'break-all', fontSize: '12px' }}><strong>Tu Token:</strong> {token}</p>}
    </div>
  );
}