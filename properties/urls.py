from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    PropertyRegistrationViewSet,
    PropertyTypeViewSet,
    PropertyOwnershipViewSet,
    PropertyImageViewSet
)


router = DefaultRouter()


router.register(
    r'properties',
    PropertyRegistrationViewSet,
    basename='property'
)


router.register(
    r'property-types',
    PropertyTypeViewSet,
    basename='property-type'
)


router.register(
    r'property-owners',
    PropertyOwnershipViewSet,
    basename='property-owner'
)


router.register(
    r'property-images',
    PropertyImageViewSet,
    basename='property-image'
)


urlpatterns = [
    path('api/', include(router.urls)),
]