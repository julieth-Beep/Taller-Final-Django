import csv
import io
import json
from decimal import Decimal, InvalidOperation
from urllib.request import Request, urlopen

URL_CSV = 'https://raw.githubusercontent.com/julieth-Beep/cvs-Catalogopeliculas/refs/heads/main/tmdb_5000_movies.csv'


def extraer_genero(texto_genero):
    """Extrae el primer género del texto JSON que trae el CSV."""
    try:
        lista_generos = json.loads(texto_genero)
        if lista_generos and isinstance(lista_generos, list):
            return lista_generos[0].get('name', 'Desconocido')
    except (json.JSONDecodeError, TypeError, IndexError):
        pass
    return 'Desconocido'


def extraer_pais(texto_pais):
    """Extrae el primer país productor del texto JSON que trae el CSV."""
    try:
        lista_paises = json.loads(texto_pais)
        if lista_paises and isinstance(lista_paises, list):
            return lista_paises[0].get('name', 'Desconocido')
    except (json.JSONDecodeError, TypeError, IndexError):
        pass
    return 'Desconocido'


def leer_archivo_csv(origen=URL_CSV):
    peliculas = []
    solicitud = Request(origen, headers={'User-Agent': 'taller-django-react/1.0'})
    with urlopen(solicitud, timeout=60) as respuesta:
        archivo = io.TextIOWrapper(respuesta, encoding='utf-8', newline='')
        lector = csv.DictReader(archivo)
        for fila in lector:
            try:
                id_pelicula = str(fila.get('id', '')).strip()

                anio = str(fila.get('release_date', '0000-00-00'))[:4]
                anio_int = int(anio) if anio.isdigit() else 0

                presupuesto_str = str(fila.get('budget', '0') or '0')
                ingreso_str = str(fila.get('revenue', '0') or '0')
                duracion_str = str(fila.get('runtime', '0') or '0')

                if not id_pelicula:
                    continue

                pelicula_limpia = {
                    'id_pelicula': id_pelicula,
                    'titulo': str(fila.get('original_title', 'Sin titulo')).strip()[:100],
                    'anio_lanzamiento': anio_int,
                    'genero': extraer_genero(fila.get('genres', '')),
                    'pais_produccion': extraer_pais(fila.get('production_countries', '')),
                    'presupuesto': Decimal(presupuesto_str).quantize(Decimal('0.01')),
                    'ingreso': Decimal(ingreso_str).quantize(Decimal('0.01')),
                    'duracion_minutos': int(float(duracion_str)) if duracion_str.replace('.', '', 1).isdigit() else 0,
                    'puntuacion': Decimal(str(fila.get('vote_average', '0.0') or '0.0')).quantize(Decimal('0.1')),
                }

                peliculas.append(pelicula_limpia)

            except (ValueError, InvalidOperation, TypeError):
                continue
    return peliculas