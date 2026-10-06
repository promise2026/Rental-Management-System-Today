from django.urls import path
from . import views


urlpatterns = [
    path('', views.agents_list, name='agents_list'),
    path('add/', views.add_agent, name='add_agent'),
    path('edit/<int:pk>/', views.edit_agent, name='edit_agent'),
    path('delete/<int:pk>/', views.delete_agent, name='delete_agent'),
    path('view/<int:pk>/', views.view_agent, name='view_agent'),
]
