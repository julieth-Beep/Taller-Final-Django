import csv
from django.core.management.base import BaseCommand
from peliculas.models import Pelicula
from peliculas.fuente_peliculas import leer_archivo_csv

class Command(BaseCommand):
    help = 'Carga masiva de películas desde un archivo CSV'

    def add_arguments(self, parser):
        parser.add_argument('archivo_csv', type=str, help='Ruta del archivo CSV')

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
                puntuacion=datos['puntuacion']
            )
            peliculas_nuevas.append(pelicula)

        try:
            Pelicula.objects.bulk_create(peliculas_nuevas, batch_size=1000, ignore_conflicts=True)
            self.stdout.write(self.style.SUCCESS(f'¡Éxito! Se cargaron {len(peliculas_nuevas)} películas.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error al insertar: {e}'))