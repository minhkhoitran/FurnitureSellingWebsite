# Generated by Django 3.2.5 on 2021-10-07 11:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shopapp', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='dienthoai',
        ),
        migrations.RemoveField(
            model_name='user',
            name='mauser',
        ),
        migrations.AlterField(
            model_name='sanpham',
            name='khonggian',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sanpham', to='shopapp.khonggian'),
        ),
    ]
