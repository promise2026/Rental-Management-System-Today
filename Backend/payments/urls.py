from django.urls import path
from . import views

urlpatterns = [
    path('', views.payment_list, name='payment_list'),
    path('add/', views.add_payment, name='add_payment'),
    path('delete/<int:pk>/', views.delete_payment, name='delete_payment'),
    path('view/<int:pk>/', views.view_payment, name='view_payment'),
    path('edit/<int:pk>/', views.edit_payment, name='edit_payment'),
]
