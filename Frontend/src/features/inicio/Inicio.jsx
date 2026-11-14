import { useState, useEffect } from 'react';
import './inicio.css';

const AUTOR = {
  nombre: 'Julieth Dayana Peña Barrera',
  rol: 'Aprendiz de Análisis y Desarrollo de Software',
  programa: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
  ficha: '3171062',
  centro: 'SENA CIMM · Sogamoso, Boyacá',
};

const CREDENCIALES = { usuario: 'julieth', clave: '12345678' };

const FUNCIONES = [
  { id: '01', t: 'Explorador paginado', d: 'Búsqueda por título, orden ascendente y descendente, filtros por género y año, y conteo total, todo resuelto en la base de datos.' },
  { id: '02', t: 'Estadísticas con el ORM', d: 'Totales, promedios y máximos calculados con aggregate y annotate, agrupados por género, año y país.' },
  { id: '03', t: 'Acceso con token', d: 'Inicio de sesión contra usuarios de Django y una operación protegida con IsAuthenticated que responde 401 sin credencial.' },
  { id: '04', t: 'Ingestión en volumen', d: 'Comando de gestión que descarga el CSV público, limpia los datos y los carga con bulk_create sin duplicar.' },
  { id: '05', t: 'Panel de administración', d: 'Admin de Django con columnas, buscador y filtros laterales para gobernar las más de 4.800 películas.' },
  { id: '06', t: 'Producción en Render', d: 'PostgreSQL, gunicorn y whitenoise, con React, API y admin servidos desde un solo origen.' },
];

const STACK = ['Django', 'Django REST Framework', 'PostgreSQL', 'React', 'Vite', 'Recharts', 'Render'];

const IMAGENES_HERO = [
  'https://i.ibb.co/r2cTYSpm/inter-1.webp',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop',
  'https://cdn.cosmos.so/images/b898b099-c78f-4c45-b498-50fe4a508219?format=webp'
];

export default function Inicio({ onIrALogin }) {
  const [copiado, setCopiado] = useState(false);
  const [indiceImagen, setIndiceImagen] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceImagen((prev) => (prev + 1) % IMAGENES_HERO.length);
    }, 5000);

    return () => clearInterval(intervalo);
  }, []);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(`${CREDENCIALES.usuario} / ${CREDENCIALES.clave}`);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch { /* sin permiso de portapapeles */ }
  };

  return (
    <div className="ini-page">
      {/* navbar */}
      <header className="ini-nav">
        <div className="ini-wrap ini-nav-in">
          <div className="ini-brand">
            <img src="https://i.pinimg.com/1200x/17/9f/24/179f24fd2833f6f8db920d6c3486b034.jpg" alt="Logo" />
            Cinema
          </div>
          <nav className="ini-links">
            <a href="#proyecto">Proyecto</a>
            <a href="#extra">Funcionalidad extra</a>
            <a href="#autor">Autora</a>
            <a href="#acceso">Acceso</a>
          </nav>
          <button className="ini-btn-dark" onClick={onIrALogin}>Iniciar sesión</button>
        </div>
      </header>

      {/* hero */}
      <section className="ini-hero-full">
        <div className="ini-hero-bg">
          {IMAGENES_HERO.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Fondo ${index}`}
              className={`ini-hero-img ${index === indiceImagen ? 'active' : ''}`}
            />
          ))}
          <div className="ini-hero-overlay"></div>
        </div>

        <div className="ini-hero-dots">
          {IMAGENES_HERO.map((_, index) => (
            <button
              key={index}
              onClick={() => setIndiceImagen(index)}
              className={`ini-dot ${index === indiceImagen ? 'active' : ''}`}
            />
          ))}
        </div>

        <div className="ini-wrap ini-hero-content">
          <div className="ini-hero-left">
            <span className="ini-pill">Proyecto final · Taller Django + React</span>
            <h1>Catálogo de cine</h1>
            <p>
              Aplicación web que ingiere más de 4.800 películas reales, las analiza directamente
              en la base de datos y las muestra en un panel con listado paginado, estadísticas y filtros dinámicos.
            </p>
            <div className="ini-cta">
              <button className="ini-btn-solid" onClick={onIrALogin}>Entrar al catálogo</button>
              <a href="#proyecto" className="ini-link-soft">Conocer el proyecto</a>
            </div>
          </div>
        </div>
      </section>

      {/* información del proyecto */}
      <section className="ini-sec-full" id="proyecto">
        <div className="ini-wrap">
          <div className="ini-sec-header">
            <h2>Sobre el proyecto</h2>
            <a href="#extra" className="ini-link-soft">Ver funcionalidad extra</a>
          </div>
          <p className="ini-sub">
            Los datos provienen del dataset público <b>TMDB 5000 Movies</b>:{' '}
            <a href="https://www.kaggle.com/datasets/akshaydattatraykhare/movies-dataset" target="_blank" rel="noreferrer">Movies Dataset en Kaggle</a>,
            publicado en un{' '}
            <a href="https://github.com/julieth-Beep/cvs-Catalogopeliculas" target="_blank" rel="noreferrer">repositorio público de GitHub</a>.
            Se cargan con código, se almacenan con tipos correctos y se consultan con el ORM de Django.
          </p>

          <div className="ini-grid">
            {FUNCIONES.map((f) => (
              <div className="ini-card" key={f.t}>
                <div className="ini-card-top">
                  <span className="ini-card-num">{f.id}</span>
                  <div className="ini-card-arrow">↗</div>
                </div>
                <h3>{f.t}</h3>
                <p>{f.d}</p>
              </div>
            ))}
          </div>

          <div className="ini-stack">
            {STACK.map((s) => <span className="ini-chip" key={s}>{s}</span>)}
          </div>
        </div>
      </section>

      {/* funcionalidad adicional + autora */}
      <section className="ini-dark-full" id="extra">
        <div className="ini-wrap ini-dark-content">
          <div className="ini-dark-left">
            <h2>Funcionalidad extra <br/>y autoría</h2>
            <p>
              Como funcionalidades adicionales integré la <b>exportación a CSV</b> del listado filtrado,
              un <b>dashboard de estadísticas dinámicas</b> dibujado con <b>Recharts</b> (librería de
              gráficas para React) y una <b>depuración protegida con token</b> que elimina las películas
              sin fecha de estreno.
            </p>

            <div className="ini-author-mini" id="autor">
              <div className="ini-avatar-dark">{AUTOR.nombre[0]}</div>
              <div>
                <p style={{ margin: 0, color: '#a1a1aa', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>Autora del proyecto</p>
                <h3 style={{ margin: '2px 0 0', color: '#fff', fontSize: '18px' }}>{AUTOR.nombre}</h3>
                <p style={{ margin: '4px 0 0', color: '#a1a1aa', fontSize: '13px' }}>{AUTOR.rol}</p>
                <p style={{ margin: '2px 0 0', color: '#a1a1aa', fontSize: '13px' }}>Programa: {AUTOR.programa}</p>
                <p style={{ margin: '2px 0 0', color: '#a1a1aa', fontSize: '13px' }}>Ficha: {AUTOR.ficha}</p>
                <p style={{ margin: '2px 0 0', color: '#a1a1aa', fontSize: '13px' }}>{AUTOR.centro}</p>
              </div>
            </div>
          </div>

          <div className="ini-dark-right">
            <div className="ini-dark-card">
              <h4>Exportación a CSV</h4>
              <p>Descarga con un clic el listado filtrado por búsqueda, género y año desde el Explorador.</p>
            </div>
            <div className="ini-dark-card">
              <h4>Estadísticas dinámicas</h4>
              <p>Totales, promedios y máximos por género, año y país, recalculados en el servidor con aggregate y annotate y graficados con Recharts.</p>
            </div>
            <div className="ini-dark-card">
              <h4>Depuración protegida</h4>
              <p>En Gestión, borra las películas sin fecha de estreno. Responde 401 sin token y solo funciona con uno válido.</p>
            </div>
          </div>
        </div>
      </section>

      {/* credenciales */}
      <section className="ini-cred-full" id="acceso">
        <div className="ini-wrap ini-cred-content">
          <h2>Credenciales de acceso</h2>
          <p className="ini-sub">
            Usa este usuario para ingresar al catálogo, al dashboard y al panel de gestión.
          </p>
          <div className="ini-credbox">
            <div><span>Usuario</span><code>{CREDENCIALES.usuario}</code></div>
            <div><span>Contraseña</span><code>{CREDENCIALES.clave}</code></div>
          </div>
          <div className="ini-cta" style={{ justifyContent: 'center' }}>
            <button className="ini-btn-solid-dark" onClick={onIrALogin}>Iniciar sesión</button>
            <button className="ini-btn-outline" onClick={copiar}>{copiado ? 'Copiado' : 'Copiar credenciales'}</button>
          </div>
        </div>
      </section>
    </div>
  );
}