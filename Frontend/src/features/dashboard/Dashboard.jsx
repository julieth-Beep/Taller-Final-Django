import { useEffect, useState } from 'react';
import { API_URL, pedirOExplotar } from '../../shared/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [topPeliculas, setTopPeliculas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function traer() {
      try {
        // 1. Traer estadísticas
        const { datos: stats } = await pedirOExplotar(`${API_URL}/peliculas/estadisticas/`);
        setDatos(stats);
        
        // 2. Traer el Top 10
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

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard de Estadísticas</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', flex: 1 }}>
          <h3>Total Películas</h3>
          <p style={{ fontSize: '24px', margin: 0 }}>{datos.metricas.total_peliculas}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', flex: 1 }}>
          <h3>Ingresos Totales</h3>
          <p style={{ fontSize: '24px', margin: 0 }}>${Number(datos.metricas.ingresos_totales).toLocaleString('es-CO')}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', flex: 1 }}>
          <h3>Promedio Ingresos</h3>
          <p style={{ fontSize: '24px', margin: 0 }}>${Number(datos.metricas.promedio_ingresos).toLocaleString('es-CO')}</p>
        </div>
      </div>

      <h3>Top Géneros por Cantidad</h3>
      <div style={{ width: '100%', height: 300, marginBottom: '40px' }}>
        <ResponsiveContainer>
          <BarChart data={datos.por_genero.slice(0, 10)} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="genero" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={60} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="conteo" fill="#8884d8" name="Cantidad" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>Películas por Año (Filtrado recientes)</h3>
      <div style={{ width: '100%', height: 300, marginBottom: '40px' }}>
        <ResponsiveContainer>
          <BarChart data={datos.por_anio.slice(-20)} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="anio_lanzamiento" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="conteo" fill="#82ca9d" name="Cantidad" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>Top 10 Películas con Más Ingresos</h3>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Año</th>
            <th>Ingresos</th>
            <th>Puntuación</th>
          </tr>
        </thead>
        <tbody>
          {topPeliculas.map((p, index) => (
            <tr key={index}>
              <td>{p.titulo}</td>
              <td>{p.anio_lanzamiento}</td>
              <td>${Number(p.ingreso).toLocaleString('es-CO')}</td>
              <td>{p.puntuacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}