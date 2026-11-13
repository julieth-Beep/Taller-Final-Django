import { useEffect, useState } from 'react';
import { API_URL, pedirOExplotar } from '../../shared/api';

const colorGenero = (genero) => {
  const colores = {
    'Action': { bg: '#FEE2E2', color: '#EF4444' },
    'Adventure': { bg: '#FEF3C7', color: '#D97706' },
    'Animation': { bg: '#FCE7F3', color: '#DB2777' },
    'Comedy': { bg: '#DCFCE7', color: '#16A34A' },
    'Crime': { bg: '#F3F4F6', color: '#4B5563' },
    'Drama': { bg: '#DBEAFE', color: '#2563EB' },
    'Horror': { bg: '#FFE4E6', color: '#BE123C' },
    'Romance': { bg: '#FCE7F3', color: '#BE185D' },
    'Science Fiction': { bg: '#E0E7FF', color: '#4338CA' },
    'Thriller': { bg: '#FEF3C7', color: '#B45309' },
    'Western': { bg: '#FFEDD5', color: '#C2410C' },
  };
  return colores[genero] || { bg: '#F3F4F6', color: '#6B7280' };
};

export default function Explorador() {
    const [peliculas, setPeliculas] = useState([]);
    const [info, setInfo] = useState({ count: 0, next: null, previous: null });
    const [pagina, setPagina] = useState(1);
    const [paginaSize, setPaginaSize] = useState(50);

    const [busqueda, setBusqueda] = useState('');
    const [genero, setGenero] = useState('');
    const [anioSeleccionado, setAnioSeleccionado] = useState(''); 
    const [listaAnios, setListaAnios] = useState([]); 
    
    const [ordenamiento, setOrdenamiento] = useState('titulo');

    useEffect(() => {
        async function cargarAnios() {
            try {
                const { datos } = await pedirOExplotar(`${API_URL}/peliculas/anios/`);
                setListaAnios(datos);
            } catch (error) {
                console.error('Error al cargar años', error);
            }
        }
        cargarAnios();
    }, []);

    const construirUrl = (paginaActual) => {
        const params = new URLSearchParams();
        params.append('ordering', ordenamiento); 
        params.append('page', paginaActual);
        params.append('page_size', paginaSize); 
        if (busqueda) params.append('search', busqueda);
        if (genero) params.append('genero', genero);
        
        if (anioSeleccionado) {
            params.append('anio_inicio', anioSeleccionado);
            params.append('anio_fin', anioSeleccionado);
        }
        
        return `${API_URL}/peliculas/?${params.toString()}`;
    };

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
    }, [pagina, busqueda, genero, anioSeleccionado, paginaSize, ordenamiento]);

    const handleBuscar = (e) => {
        e.preventDefault();
        setPagina(1); 
    };

    const handleOrdenar = (columna) => {
        setPagina(1);
        if (ordenamiento === columna) {
            // Si ya estaba en orden ascendente (A-Z, menor a mayor), lo pasa a descendente
            setOrdenamiento(`-${columna}`);
        } else {
            // Si estaba en descendente o en otra columna, lo pasa a ascendente
            setOrdenamiento(columna);
        }
    };

    const IconoFlechas = ({ columna }) => {
        const activo = ordenamiento === columna || ordenamiento === `-${columna}`;
        const descendente = ordenamiento === `-${columna}`;

        return (
            <span style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '6px', opacity: activo ? 1 : 0.4 }}>
                <svg width="10" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 11 12 6 7 11" style={{ opacity: !descendente && activo ? 1 : 0.3 }} />
                    <polyline points="7 13 12 18 17 13" style={{ opacity: descendente && activo ? 1 : 0.3 }} />
                </svg>
            </span>
        );
    };

    const exportarCSV = async () => {
        try {
            const params = new URLSearchParams();
            params.append('ordering', 'titulo');
            params.append('page_size', '9999');
            if (busqueda) params.append('search', busqueda);
            if (genero) params.append('genero', genero);
            if (anioSeleccionado) {
                params.append('anio_inicio', anioSeleccionado);
                params.append('anio_fin', anioSeleccionado);
            }

            const urlExport = `${API_URL}/peliculas/?${params.toString()}`;
            const { datos } = await pedirOExplotar(urlExport);
            const filas = datos.results || datos;

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

    const totalPaginas = Math.ceil(info.count / paginaSize);
    const paginasArray = [];
    for (let i = 1; i <= totalPaginas; i++) {
        if (i === 1 || i === totalPaginas || (i >= pagina - 1 && i <= pagina + 1)) {
            paginasArray.push(i);
        } else if (paginasArray[paginasArray.length - 1] !== '...') {
            paginasArray.push('...');
        }
    }

    return (
        <div className="explorador-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                <div>
                    <h2 className="header-title">
                        Explorador
                    </h2>
                    <p className="header-subtitle">
                        Colección cinematográfica completa
                    </p>
                </div>
                <div className="total-badge">
                    <p className="total-label">Total</p>
                    <p className="total-value">{info.count.toLocaleString()}</p>
                </div>
            </div>

            <form onSubmit={handleBuscar} className="filtros-form">
                <div className="filtros-inputs">
                    <input
                        type="text" 
                        placeholder="Buscar título..." 
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)} 
                        className="input-search" // AQUÍ SE APLICA LA CLASE DE LA LUPA
                        style={{ width: '220px' }}
                    />
                    <select value={genero} onChange={(e) => setGenero(e.target.value)} className="input-pill">
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
                    
                    <select 
                        value={anioSeleccionado} 
                        onChange={(e) => setAnioSeleccionado(e.target.value)} 
                        className="input-pill"
                    >
                        <option value="">Todos los años</option>
                        {listaAnios.map(anio => (
                            <option key={anio} value={anio}>{anio}</option>
                        ))}
                    </select>
                </div>

                <button type="button" onClick={exportarCSV} className="btn-exportar">
                    <span style={{ fontSize: '18px', lineHeight: '1' }}>+</span> Exportar CSV
                </button>
            </form>

            <div className="tabla-wrapper">
                <table className="tabla">
                    <thead>
                        <tr>
                            <th className="th" onClick={() => handleOrdenar('titulo')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                Título <IconoFlechas columna="titulo" />
                            </th>
                            <th className="th" onClick={() => handleOrdenar('anio_lanzamiento')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                Año <IconoFlechas columna="anio_lanzamiento" />
                            </th>
                            <th className="th">Género</th>
                            <th className="th">Presupuesto</th>
                            <th className="th" onClick={() => handleOrdenar('ingreso')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                Ingresos <IconoFlechas columna="ingreso" />
                            </th>
                            <th className="th" onClick={() => handleOrdenar('puntuacion')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                                Puntuación <IconoFlechas columna="puntuacion" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {peliculas.map((p) => {
                            const estiloGenero = colorGenero(p.genero);
                            return (
                                <tr key={p.id_pelicula}>
                                    <td className="td">{p.titulo}</td>
                                    <td className="td">{p.anio_lanzamiento}</td>
                                    <td className="td">
                                        <span style={{
                                            backgroundColor: estiloGenero.bg,
                                            color: estiloGenero.color,
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            display: 'inline-block'
                                        }}>
                                            {p.genero}
                                        </span>
                                    </td>
                                    <td className="td">${p.presupuesto}</td>
                                    <td className="td">${p.ingreso}</td>
                                    <td className="td">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ color: '#FDE047', fontSize: '18px', lineHeight: '1' }}>★</span>
                                            <span style={{ color: '#374151', fontWeight: '600' }}>{p.puntuacion}</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="paginacion">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <select 
                        value={paginaSize} 
                        onChange={(e) => { setPaginaSize(Number(e.target.value)); setPagina(1); }}
                        className="input-pill"
                        style={{ padding: '8px 12px', minWidth: '100px' }}
                    >
                        <option value={10}>10 Filas</option>
                        <option value={20}>20 Filas</option>
                        <option value={50}>50 Filas</option>
                        <option value={100}>100 Filas</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        disabled={!info.previous} 
                        onClick={() => setPagina(pagina - 1)} 
                        className="btn-pag"
                    >
                        &lt; Previous
                    </button>
                    
                    {paginasArray.map((num, index) => (
                        <button
                            key={index}
                            onClick={() => typeof num === 'number' && setPagina(num)}
                            disabled={num === '...'}
                            className={`btn-pag ${pagina === num ? 'btn-pag-activo' : ''}`}
                        >
                            {num}
                        </button>
                    ))}

                    <button 
                        disabled={!info.next} 
                        onClick={() => setPagina(pagina + 1)} 
                        className="btn-pag"
                    >
                        Next &gt;
                    </button>
                </div>
            </div>
        </div>
    );
}