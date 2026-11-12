from django.db import migrations, models

class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Pelicula',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('id_pelicula', models.CharField(max_length=60, unique=True)),
                ('titulo', models.CharField(max_length=100)),
                ('anio_lanzamiento', models.IntegerField()),
                ('genero', models.CharField(max_length=100)),
                ('presupuesto', models.DecimalField(decimal_places=2, max_digits=15)),
                ('ingreso', models.DecimalField(decimal_places=2, max_digits=15)),
                ('duracion_minutos', models.IntegerField()),
                ('puntuacion', models.DecimalField(decimal_places=2, max_digits=15)),
            ],
        ),
    ]