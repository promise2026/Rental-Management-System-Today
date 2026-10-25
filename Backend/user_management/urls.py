from . import views
from django.urls import path


urlpatterns = [
    path('login/', views.login, name='login'),
    path('logout/', views.log_out, name='logout'),
    path('agents/', views.agents, name='agents'),
]
