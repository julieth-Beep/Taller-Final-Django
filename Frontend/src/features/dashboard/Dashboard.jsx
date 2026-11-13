import { useEffect, useState } from 'react';
import { API_URL, pedirOExplotar } from '../../shared/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Íconos para las tarjetas superiores
const IconTicket = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"></path>
  </svg>
);

const IconMoney = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const IconChart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

export default function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [topPeliculas, setTopPeliculas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function traer() {
      try {
        const { datos: stats } = await pedirOExplotar(`${API_URL}/peliculas/estadisticas/`);
        setDatos(stats);
        
        const { datos: top } = await pedirOExplotar(`${API_URL}/peliculas/top/`);
        setTopPeliculas(top);
        
      } catch (err) {
        setError(err.message);
      }
    }
    traer();
  }, []);

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!datos) return <p>Cargando estadísticas...</p>;

  // Estilos reutilizables para las tarjetas blancas
  const cardStyle = {
    background: '#ffffff',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden' // Evita el scroll general
    }}>
      
      {/* 1. Header / Banner compacto */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        borderRadius: '16px',
        padding: '20px 28px',
        color: 'white',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0 // Evita que se comprima
      }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 700 }}>
            ¡Hola de nuevo! 👋
          </h2>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
            Aquí tienes el resumen de tu catálogo cinematográfico.
          </p>
        </div>
      </div>

      {/* 2. Tarjetas de Métricas */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexShrink: 0 }}>
        <div style={{ ...cardStyle, flex: 1, flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconTicket />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Total Películas</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '24px', fontWeight: 700, color: '#111827', lineHeight: 1 }}>
              {datos.metricas.total_peliculas}
            </p>
          </div>
        </div>

        <div style={{ ...cardStyle, flex: 1, flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fefce8', color: '#ca8a04', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconMoney />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Ingresos Totales</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '24px', fontWeight: 700, color: '#111827', lineHeight: 1 }}>
              ${Number(datos.metricas.ingresos_totales).toLocaleString('es-CO')}
            </p>
          </div>
        </div>

        <div style={{ ...cardStyle, flex: 1, flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconChart />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Promedio Ingresos</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '24px', fontWeight: 700, color: '#111827', lineHeight: 1 }}>
              ${Number(datos.metricas.promedio_ingresos).toLocaleString('es-CO')}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Zona Principal: Gráficos (Izquierda) y Tabla (Derecha) */}
      <div style={{ 
        flex: 1, 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', // Dos columnas iguales
        gap: '20px', 
        minHeight: 0 // Permite que el grid se adapte al 100% de la altura disponible
      }}>
        
        {/* Columna Izquierda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: 0 }}>
          
          {/* Gráfico 1 */}
          <div style={{ ...cardStyle, flex: 1 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 10px 0', flexShrink: 0 }}>Top Géneros por Cantidad</h3>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datos.por_genero.slice(0, 7)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="genero" tick={{ fontSize: 11, fill: '#6b7280' }} interval={0} angle={-35} textAnchor="end" height={50} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="conteo" fill="#8b5cf6" name="Cantidad" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2 */}
          <div style={{ ...cardStyle, flex: 1 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 10px 0', flexShrink: 0 }}>Películas por Año</h3>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datos.por_anio.slice(-10)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="anio_lanzamiento" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="conteo" fill="#34d399" name="Cantidad" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Columna Derecha (Tabla Top 10) */}
        <div style={{ ...cardStyle, padding: 0, minHeight: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>Top 10 Películas con Más Ingresos</h3>
          </div>
          
          {/* Contenedor con scroll interno por si la pantalla es muy pequeña */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: '#f9fafb', position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  <th style={{ padding: '12px 20px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Título</th>
                  <th style={{ padding: '12px 20px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Año</th>
                  <th style={{ padding: '12px 20px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Ingresos</th>
                  <th style={{ padding: '12px 20px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Puntuación</th>
                </tr>
              </thead>
              <tbody>
                {topPeliculas.map((p, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 20px', fontSize: '13px', fontWeight: 500, color: '#111827' }}>{p.titulo}</td>
                    <td style={{ padding: '12px 20px', fontSize: '13px', color: '#6b7280' }}>{p.anio_lanzamiento}</td>
                    <td style={{ padding: '12px 20px', fontSize: '13px', color: '#374151', fontWeight: 600 }}>${Number(p.ingreso).toLocaleString('es-CO')}</td>
                    <td style={{ padding: '12px 20px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#FDE047', fontSize: '14px' }}>★</span>
                        <span style={{ color: '#374151', fontWeight: 600 }}>{p.puntuacion}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}