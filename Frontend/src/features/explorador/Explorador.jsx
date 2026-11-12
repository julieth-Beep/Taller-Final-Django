import { useEffect, useState } from 'react';
import { API_URL, pedirOExplotar } from '../../shared/api';

export default function Explorador() {
    const [peliculas, setPeliculas] = useState([]);
    const [info, setInfo] = useState({ count: 0, next: null, previous: null });
    const [pagina, setPagina] = useState(1);

    // Estados para los filtros
    const [busqueda, setBusqueda] = useState('');
    const [genero, setGenero] = useState('');
    const [anioInicio, setAnioInicio] = useState('');
    const [anioFin, setAnioFin] = useState('');

    // Función que arma la URL con los filtros y la página actual
    const construirUrl = (paginaActual) => {
        const params = new URLSearchParams();
        params.append('ordering', 'id_pelicula');
        params.append('page', paginaActual);
        if (busqueda) params.append('search', busqueda);
        if (genero) params.append('genero', genero);
        if (anioInicio) params.append('anio_inicio', anioInicio);
        if (anioFin) params.append('anio_fin', anioFin);
        return `${API_URL}/peliculas/?${params.toString()}`;
    };

    // Efecto que se ejecuta al cambiar de página o al buscar
    useEffect(() => {
        async function traer() {
            try {
                const url = construirUrl(pagina);
                const { datos } = await pedirOExplotar(url);
                setPeliculas(datos.results || []);
                setInfo({
                    count: datos.count,
                    next: datos.next,
                    previous: datos.previous
                });
            } catch (error) {
                console.error('Error al traer películas', error);
            }
        }
        traer();
    }, [pagina, busqueda, genero, anioInicio, anioFin]);

    const handleBuscar = (e) => {
        e.preventDefault();
        setPagina(1); // Al buscar, volvemos siempre a la página 1
    };

    // Exportar a CSV pidiendo todos los datos SIN paginar
    const exportarCSV = async () => {
        try {
            const params = new URLSearchParams();
            params.append('ordering', 'id_pelicula');
            params.append('page_size', '9999'); // Pedimos todo
            if (busqueda) params.append('search', busqueda);
            if (genero) params.append('genero', genero);
            if (anioInicio) params.append('anio_inicio', anioInicio);
            if (anioFin) params.append('anio_fin', anioFin);

            const urlExport = `${API_URL}/peliculas/?${params.toString()}`;
            const { datos } = await pedirOExplotar(urlExport);
            const filas = datos.results || datos; // Dependiendo de la paginación

            const cabecera = "Titulo,Año,Genero,Presupuesto,Ingresos,Puntuacion\n";
            const contenido = filas.map(p =>
                `"${p.titulo}",${p.anio_lanzamiento},"${p.genero}",${p.presupuesto},${p.ingreso},${p.puntuacion}`
            ).join("\n");

            const blob = new Blob([cabecera + contenido], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "peliculas_exportadas.csv";
            link.click();
        } catch (error) {
            alert("Error al exportar el CSV: " + error.message);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Explorador de Películas</h2>

            <form onSubmit={handleBuscar} style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                    type="text" placeholder="Buscar por título..." value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)} style={{ padding: '8px', width: '200px' }}
                />
                <select
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                    style={{ padding: '8px' }}
                >
                    <option value="">Todos los géneros</option>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Animation">Animation</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Crime">Crime</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Drama">Drama</option>
                    <option value="Family">Family</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Foreign">Foreign</option>
                    <option value="History">History</option>
                    <option value="Horror">Horror</option>
                    <option value="Music">Music</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Romance">Romance</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="TV Movie">TV Movie</option>
                    <option value="Thriller">Thriller</option>
                    <option value="War">War</option>
                    <option value="Western">Western</option>
                </select>
                <input type="number" placeholder="Año inicio" value={anioInicio} onChange={(e) => setAnioInicio(e.target.value)} style={{ padding: '8px', width: '100px' }} />
                <input type="number" placeholder="Año fin" value={anioFin} onChange={(e) => setAnioFin(e.target.value)} style={{ padding: '8px', width: '100px' }} />
                <button type="submit" style={{ padding: '8px 16px' }}>Buscar</button>
                <button type="button" onClick={exportarCSV} style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Exportar CSV
                </button>
            </form>

            <p><strong>Total de películas:</strong> {info.count}</p>

            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr>
                        <th>Título</th><th>Año</th><th>Género</th><th>Presupuesto</th><th>Ingresos</th><th>Puntuación</th>
                    </tr>
                </thead>
                <tbody>
                    {peliculas.map((p) => (
                        <tr key={p.id_pelicula}>
                            <td>{p.titulo}</td><td>{p.anio_lanzamiento}</td><td>{p.genero}</td>
                            <td>${p.presupuesto}</td><td>${p.ingreso}</td><td>{p.puntuacion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button disabled={!info.previous} onClick={() => setPagina(pagina - 1)}>Anterior</button>
                <button disabled={!info.next} onClick={() => setPagina(pagina + 1)}>Siguiente</button>
            </div>
        </div>
    );
}