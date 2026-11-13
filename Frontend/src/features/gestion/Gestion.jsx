import { useState } from 'react';
import { API_URL } from '../../shared/api';

export default function Gestion({ token }) {
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const ejecutar = async (accion, metodo, ruta) => {
    setCargando(true);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Token ${token}`;

    try {
      const respuesta = await fetch(`${API_URL}${ruta}`, {
        method: metodo,
        headers,
        credentials: 'omit',
        body: JSON.stringify({ confirmar: true }),
      });
      const datos = await respuesta.json().catch(() => ({}));
      setResultado({ ok: respuesta.ok, status: respuesta.status, accion, datos });
    } catch {
      setResultado({ ok: false, status: 0, accion, datos: { detalle: 'Sin respuesta del servidor' } });
    } finally {
      setCargando(false);
    }
  };

  const etiquetaAccion = {
    depurar: 'Depurar sin fecha',
    borrar: 'Borrar caché',
    recargar: 'Recargar CSV',
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <h2 className="header-title">Gestión de datos</h2>
      <p className="header-subtitle">
        Operaciones protegidas sobre el catálogo. Todas exigen un token válido.
      </p>

      <div style={{ display: 'flex', gap: 12, margin: '24px 0', flexWrap: 'wrap' }}>
        <button
          className="btn-pag"
          disabled={cargando}
          onClick={() => ejecutar('depurar', 'DELETE', '/peliculas/limpieza/')}
        >
          Depurar sin fecha
        </button>

        <button
          className="btn-pag"
          disabled={cargando}
          onClick={() => ejecutar('borrar', 'DELETE', '/peliculas/borrar-cache/')}
        >
          Borrar caché
        </button>

        <button
          className="btn-exportar"
          disabled={cargando}
          onClick={() => ejecutar('recargar', 'POST', '/peliculas/recargar/')}
        >
          {cargando ? 'Recargando...' : 'Recargar CSV'}
        </button>
      </div>

      {resultado && (
        <div style={{
          padding: 16, borderRadius: 12,
          background: resultado.ok ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${resultado.ok ? '#86efac' : '#fca5a5'}`,
        }}>
          <p style={{ margin: 0, fontWeight: 700, color: resultado.ok ? '#16a34a' : '#dc2626' }}>
            {resultado.ok ? '✅' : '🚫'} {etiquetaAccion[resultado.accion]} · HTTP {resultado.status}
            {resultado.status === 401 && ' · Rechazado: falta token válido'}
            {resultado.ok && ' · Operación autorizada'}
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 13 }}>
            Cabecera: {token ? `Authorization: Token ${token.substring(0, 8)}...` : 'ninguna'}
          </p>
          <pre style={{ margin: '8px 0 0', fontSize: 12, maxHeight: 200, overflow: 'auto' }}>
            {JSON.stringify(resultado.datos, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}