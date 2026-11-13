import { useState } from 'react';
import { API_URL } from '../../shared/api';

export default function Gestion({ token }) {
  const [resultado, setResultado] = useState(null);

  const depurar = async (conToken) => {
    const headers = { 'Content-Type': 'application/json' };
    if (conToken) headers.Authorization = `Token ${token}`;

    try {
      const respuesta = await fetch(`${API_URL}/peliculas/limpieza/`, {
        method: 'DELETE',
        headers,
        credentials: 'omit', // evita que la sesión del admin se cuele y cambie el 401
        body: JSON.stringify({ confirmar: true }),
      });
      const datos = await respuesta.json().catch(() => ({}));
      setResultado({ ok: respuesta.ok, status: respuesta.status, conToken, datos });
    } catch {
      setResultado({ ok: false, status: 0, conToken, datos: { detalle: 'Sin respuesta del servidor' } });
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 className="header-title">Gestión de datos</h2>
      <p className="header-subtitle">
        Depura las películas sin fecha de estreno. Es una operación protegida: exige un token válido.
      </p>

      <div style={{ display: 'flex', gap: 12, margin: '24px 0' }}>
        <button className="btn-pag" onClick={() => depurar(false)}>Probar SIN token</button>
        <button className="btn-exportar" onClick={() => depurar(true)}>Depurar CON token</button>
      </div>

      {resultado && (
        <div style={{
          padding: 16, borderRadius: 12,
          background: resultado.ok ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${resultado.ok ? '#86efac' : '#fca5a5'}`,
        }}>
          <p style={{ margin: 0, fontWeight: 700, color: resultado.ok ? '#16a34a' : '#dc2626' }}>
            {resultado.ok ? '✅' : '🚫'} HTTP {resultado.status}{' '}
            {resultado.status === 401 && '· Rechazado: falta credencial válida'}
            {resultado.ok && '· Operación autorizada'}
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 13 }}>
            Cabecera enviada: {resultado.conToken ? `Authorization: Token ${token.substring(0, 8)}...` : 'ninguna'}
          </p>
          <pre style={{ margin: '8px 0 0', fontSize: 12 }}>{JSON.stringify(resultado.datos, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}