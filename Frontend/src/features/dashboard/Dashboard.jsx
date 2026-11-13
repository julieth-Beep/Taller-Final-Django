import { useEffect, useState } from 'react';
import { API_URL, pedirOExplotar } from '../../shared/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, RadialBarChart, RadialBar
} from 'recharts';

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

const IconStar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const COLORS = ['#c084fc', '#0ea5e9', '#818cf8', '#6ee7b7', '#fde047', '#fca5a5'];

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

  const card = {
    background: '#ffffff',
    padding: '20px 28px',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const datosPaises = (datos.por_pais?.slice(0, 4) || []).map((item, index) => {
    const percentage = Math.round((item.conteo / datos.metricas.total_peliculas) * 100);
    const coloresAnillo = ['#c084fc', '#0ea5e9', '#818cf8', '#6ee7b7'];
    return {
      name: item.pais_produccion || 'N/A',
      value: item.conteo,
      percentage: percentage,
      fill: coloresAnillo[index % coloresAnillo.length]
    };
  });

  const dataRadial = [...datosPaises].reverse();

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', sans-serif",
      overflowY: 'auto',
      paddingBottom: '20px'
    }}>

      <div style={{ ...card, flexDirection: 'row', alignItems: 'center', gap: '16px', marginBottom: '24px', padding: '30px 28px', flex: 'none' }}>
        <div>
          <p style={{ margin: '2px 0 0 0', fontSize: '24px', fontWeight: 700, color: '#111827', lineHeight: 1 }}>
            Hola de nuevo! 👋
          </p>
          <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Aquí tienes el resumen de tu catálogo cinematográfico.</p>
        </div>
      </div>


      {/* tarjetas */}
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

        <div style={{ ...cardStyle, flex: 1, flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fdf2f8', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconStar />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '11px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>Puntuación Promedio</p>
            <p style={{ margin: '2px 0 0 0', fontSize: '24px', fontWeight: 700, color: '#111827', lineHeight: 1 }}>
              {Number(datos.metricas.promedio_puntuacion || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/*graficos (izquierda) y tabla (derecha) */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px'
      }}>

        {/*izquierda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/*top generos */}
          <div style={{ ...cardStyle, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#271111', margin: 0 }}>Top Géneros</h3>
              <span style={{ fontSize: '12px', color: '#6b7280', border: '1px solid #e5e7eb', padding: '4px 10px', borderRadius: '20px' }}>Global</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '180px', height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datos.por_genero.slice(0, 5)}
                      dataKey="conteo"
                      nameKey="genero"
                      cx="50%" cy="50%"
                      innerRadius={55} outerRadius={80}
                      paddingAngle={5}
                      stroke="none"
                    >
                      {datos.por_genero.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1, paddingLeft: '10px' }}>
                {datos.por_genero.slice(0, 5).map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[index % COLORS.length] }}></div>
                      <span style={{ color: '#4b5563' }}>{item.genero}</span>
                    </div>
                    <span style={{ fontWeight: 600, color: '#111827' }}>{Math.round((item.conteo / datos.metricas.total_peliculas) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/*top paises productores*/}
          <div style={{ ...cardStyle, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>Top Países Productores</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '180px' }}>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px', paddingLeft: '10px' }}>
                {datosPaises.map((item, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', paddingRight: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.fill }}></div>
                      <span style={{ color: '#4b5563', fontSize: '14px' }}>{item.name}</span>
                    </div>
                    <span style={{ color: '#111827', fontWeight: 500, fontSize: '14px' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ width: '160px', height: '160px', flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%" cy="50%"
                    innerRadius="30%"
                    outerRadius="100%"
                    barSize={10}
                    data={dataRadial}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar 
                      background={{ fill: '#f3f4f6' }} 
                      dataKey="percentage" 
                      cornerRadius={10} 
                      innerRadius={(data) => data.index * 8 + 10} 
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>

        </div>

        {/*derecha*/}

        {/* tabla*/}
        <div style={{ ...cardStyle, padding: 0, minHeight: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', flexShrink: 0 }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#271411', margin: 0 }}>Top 10 Películas con Más Ingresos</h3>
          </div>

          {/* scroll*/}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, maxHeight: '420px' }}>
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

      {/* inferior*/}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* peli x año*/}
        <div style={{ ...cardStyle, flex: 1, height: '300px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 10px 0', flexShrink: 0 }}>Películas por Año</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={datos.por_anio.slice(-10)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConteo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="anio_lanzamiento" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ stroke: '#818cf8', strokeWidth: 1, strokeDasharray: '3 3' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="conteo"
                  stroke="#818cf8"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorConteo)"
                  activeDot={{ r: 6, fill: '#fff', stroke: '#818cf8', strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/*peli + vistas*/}
        <div style={{ ...cardStyle, padding: '20px', height: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>Películas más Taquilleras</h3>
            <span style={{ fontSize: '12px', color: '#6b7280', border: '1px solid #e5e7eb', padding: '4px 10px', borderRadius: '20px' }}>Top 7</span>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPeliculas.slice(0, 7)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="titulo" tick={{ fontSize: 11, fill: '#6b7280' }} interval={0} angle={-25} textAnchor="end" height={60} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val / 1e9}B`} />
                <Tooltip
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`$${Number(value).toLocaleString('es-CO')}`, 'Ingresos']}
                />
                <Bar dataKey="ingreso" fill="#d8b4fe" radius={[4, 4, 0, 0]}>
                  {topPeliculas.slice(0, 7).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#818cf8' : '#e9d5ff'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}