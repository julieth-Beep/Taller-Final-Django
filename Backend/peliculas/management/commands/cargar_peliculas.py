from django.core.management.base import BaseCommand
from peliculas.models import Pelicula
from peliculas.fuente_peliculas import leer_archivo_csv, URL_CSV


class Command(BaseCommand):
    help = 'Carga masiva de películas desde un archivo CSV'

    def add_arguments(self, parser):
        parser.add_argument(
            'archivo_csv', nargs='?', default=URL_CSV,
            help='URL o ruta del CSV (por defecto, la fuente pública)',
        )

    def handle(self, *args, **kwargs):
        archivo = kwargs['archivo_csv']
        self.stdout.write(self.style.SUCCESS(f'Iniciando carga desde {archivo}...'))

        datos_peliculas = leer_archivo_csv(archivo)

        if not datos_peliculas:
            self.stdout.write(self.style.ERROR('No se encontraron datos válidos en el CSV.'))
            return

        peliculas_nuevas = []
        for datos in datos_peliculas:
            pelicula = Pelicula(
                id_pelicula=datos['id_pelicula'],
                titulo=datos['titulo'],
                anio_lanzamiento=datos['anio_lanzamiento'],
                genero=datos['genero'],
                pais_produccion=datos['pais_produccion'],
                presupuesto=datos['presupuesto'],
                ingreso=datos['ingreso'],
                duracion_minutos=datos['duracion_minutos'],
                puntuacion=datos['puntuacion'],
            )
            peliculas_nuevas.append(pelicula)

        try:
            antes = Pelicula.objects.count()
            Pelicula.objects.bulk_create(
                peliculas_nuevas,
                batch_size=1000,
                update_conflicts=True,
                unique_fields=['id_pelicula'],
                update_fields=[
                    'titulo', 'anio_lanzamiento', 'genero', 'pais_produccion',
                    'presupuesto', 'ingreso', 'duracion_minutos', 'puntuacion',
                ],
            )
            despues = Pelicula.objects.count()
            self.stdout.write(self.style.SUCCESS(
                f'¡Éxito! Leídas: {len(peliculas_nuevas)} · Nuevas: {despues - antes} · Total: {despues}'
            ))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error al insertar: {e}'))