from django.contrib import admin
from .models import Pelicula

@admin.register(Pelicula)
class PeliculaAdmin(admin.ModelAdmin):
    list_display = (
        'id_pelicula',
        'titulo',
        'anio_lanzamiento',
        'genero',
        'presupuesto',
        'ingreso',
        'puntuacion',
    )
    search_fields = ('id_pelicula', 'titulo', 'genero')
    list_filter = ('genero', 'anio_lanzamiento')
    ordering = ('-anio_lanzamiento',)