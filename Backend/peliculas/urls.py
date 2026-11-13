from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    PeliculaViewSet,
    EstadisticasView,
    LlaveView,
    LimpiezaCineView,
    TopPeliculasView,
    AniosDisponiblesView,
    BorrarCacheView,
    RecargarDatosView,
)

router = DefaultRouter()
router.register('peliculas', PeliculaViewSet, basename='pelicula')

urlpatterns = [
    path('peliculas/estadisticas/', EstadisticasView.as_view(), name='estadisticas'),
    path('peliculas/top/', TopPeliculasView.as_view()),
    path('auth/login/', LlaveView.as_view(), name='llave-de-acceso'),
    path('peliculas/limpieza/', LimpiezaCineView.as_view(), name='limpieza'),
    path('peliculas/anios/', AniosDisponiblesView.as_view(), name='anios-disponibles'),
    path('peliculas/borrar-cache/', BorrarCacheView.as_view(), name='borrar-cache'),
    path('peliculas/recargar/', RecargarDatosView.as_view(), name='recargar-datos'),
    *router.urls,
]