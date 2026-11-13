import time
from django.db.models import Count, Sum, Avg, Max, Min
from django.contrib.auth import authenticate
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .models import Pelicula
from .serializers import PeliculaSerializer

class PeliculaViewSet(viewsets.ModelViewSet):
    queryset = Pelicula.objects.all()
    serializer_class = PeliculaSerializer

    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['titulo', 'genero']
    ordering_fields = ['anio_lanzamiento', 'ingreso', 'presupuesto', 'puntuacion', 'titulo']

    def get_queryset(self):
        queryset = super().get_queryset()
        
        genero = self.request.query_params.get('genero')
        if genero:
            queryset = queryset.filter(genero__iexact=genero)
            
        anio_inicio = self.request.query_params.get('anio_inicio')
        anio_fin = self.request.query_params.get('anio_fin')
        
        if anio_inicio and anio_fin:
            queryset = queryset.filter(anio_lanzamiento__range=(int(anio_inicio), int(anio_fin)))
        elif anio_inicio:
            queryset = queryset.filter(anio_lanzamiento__gte=int(anio_inicio))
        elif anio_fin:
            queryset = queryset.filter(anio_lanzamiento__lte=int(anio_fin))
            
        return queryset

class EstadisticasView(APIView):
    def get(self, request):
        genero = request.query_params.get('genero')
        queryset = Pelicula.objects.all()
        
        if genero:
            queryset = queryset.filter(genero__iexact=genero)

        metricas = queryset.aggregate(
            total_peliculas=Count('id_pelicula'),
            ingresos_totales=Sum('ingreso'),
            promedio_ingresos=Avg('ingreso'),
            promedio_puntuacion=Avg('puntuacion'),
            max_ingresos=Max('ingreso'),
            min_ingresos=Min('ingreso')
        )

        por_genero = queryset.values('genero').annotate(
            conteo=Count('id_pelicula'),
            promedio_puntuacion=Avg('puntuacion')
        ).order_by('-conteo')

        por_anio = queryset.values('anio_lanzamiento').annotate(
            conteo=Count('id_pelicula'),
            ingresos_anuales=Sum('ingreso')
        ).order_by('anio_lanzamiento')

        por_pais = queryset.values('pais_produccion').annotate(
            conteo=Count('id_pelicula')
        ).order_by('-conteo')[:4]

        return Response({
            'metricas': metricas,
            'por_genero': list(por_genero),
            'por_anio': list(por_anio),
            'por_pais': list(por_pais) 
        })

class TopPeliculasView(APIView):
    def get(self, request):
        top = Pelicula.objects.order_by('-ingreso')[:10].values(
            'titulo', 'ingreso', 'anio_lanzamiento', 'puntuacion'
        )
        return Response(list(top))

@method_decorator(csrf_exempt, name='dispatch')
class LlaveView(APIView):
    def post(self, request):
        usuario = authenticate(
            username=request.data.get('username'),
            password=request.data.get('password'),
        )
        if usuario is None:
            return Response({'detalle': 'Credenciales inválidas.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        llave, _ = Token.objects.get_or_create(user=usuario)
        return Response({'token': llave.key, 'usuario': usuario.username})

class LimpiezaCineView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        if request.data.get('confirmar') is not True:
            return Response({'detalle': 'Debes confirmar con {"confirmar": true}'}, status=status.HTTP_400_BAD_REQUEST)
        
        peliculas_vacias = Pelicula.objects.filter(ingreso__isnull=True)
        cantidad_borrada = peliculas_vacias.count()
        peliculas_vacias.delete()
        
        return Response({'eliminados': cantidad_borrada, 'mensaje': 'Películas sin ingresos eliminadas'})

class AniosDisponiblesView(APIView):
    def get(self, request):
        anios = Pelicula.objects.values_list('anio_lanzamiento', flat=True).distinct().order_by('-anio_lanzamiento')
        anios_validos = [a for a in anios if a and a > 0]
        return Response(anios_validos)