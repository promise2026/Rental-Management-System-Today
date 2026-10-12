from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    MyProfileView,
    FavoritePropertyView
)


urlpatterns = [

    path(
        'register/',
        RegisterView.as_view(),
        name='register'
    ),

    path(
        'login/',
        LoginView.as_view(),
        name='login'
    ),

    path(
        'logout/',
        LogoutView.as_view(),
        name='logout'
    ),

    path(
        'profile/',
        MyProfileView.as_view(),
        name='profile'
    ),

    path(
        'favorites/',
        FavoritePropertyView.as_view(),
        name='favorites'
    ),
]