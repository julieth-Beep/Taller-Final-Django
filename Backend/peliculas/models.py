from django.db import models

class Pelicula(models.Model):
    id_pelicula = models.CharField(max_length=60, unique=True)
    titulo = models.CharField(max_length=100)
    anio_lanzamiento = models.IntegerField()
    genero = models.CharField(max_length=100)
    pais_produccion = models.CharField(max_length=100, null=True, blank=True)
    presupuesto = models.DecimalField(max_digits=15, decimal_places=2)
    ingreso = models.DecimalField(max_digits=15, decimal_places=2)
    duracion_minutos = models.IntegerField()
    puntuacion = models.DecimalField(max_digits=15, decimal_places=2)

    def __str__(self):
        return f"{self.id_pelicula} ({self.anio_lanzamiento})"