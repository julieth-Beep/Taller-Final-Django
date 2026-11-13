export const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8000/api'
  : 'https://peliculas-django.onrender.com/api';
  
export class FallaApi extends Error {
  constructor(tipo, mensaje) {
    super(mensaje)
    this.tipo = tipo
  }
}

const PISTAS_HTTP = {
  400: 'HTTP 400 · el servidor RECHAZÓ el dato: mira el serializer (El Escudo).',
  401: 'HTTP 401 · falta autenticación en la API.',
  403: 'HTTP 403 · el servidor entendió pero no autoriza.',
  404: 'HTTP 404 · el recurso NO existe: ruta mal escrita o id inexistente.',
  405: 'HTTP 405 · el verbo HTTP no está permitido en esa ruta.',
  500: 'HTTP 500 · error interno del servidor: revisa la terminal de Django.',
}

export async function peticion(ruta, opciones = {}) {
  const inicio = performance.now()

  try {
    const respuesta = await fetch(ruta, opciones)
    return { respuesta, ms: Math.round(performance.now() - inicio) }
  } catch {
    throw new FallaApi(
      'cors',
      'No hubo respuesta de Django. Revisa que el servidor esté activo ' +
        'en el puerto 8000 y que CORS esté configurado.',
    )
  }
}

export async function pedirOExplotar(ruta, opciones = {}) {
  const { respuesta, ms } = await peticion(ruta, opciones)
  if (!respuesta.ok) {
    const mensaje = PISTAS_HTTP[respuesta.status]
      || `HTTP ${respuesta.status} · respuesta inesperada del servidor`
    throw new FallaApi('http', mensaje)
  }

  let datos
  try {
    datos = await respuesta.json()
  } catch {
    throw new FallaApi('json', 'El servidor respondió algo que no es JSON.')
  }
  return { respuesta, ms, datos }
}
