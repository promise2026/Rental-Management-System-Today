from django.urls import path
from . import views

urlpatterns = [
    path('', views.summary_report, name='summary_report'),
]
