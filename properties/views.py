from rest_framework import viewsets

from .models import (
    PropertyRegistration,
    PropertyType,
    PropertyOwnership,
    PropertyImage
)

from .serializers import (
    PropertyRegistrationSerializer,
    PropertyTypeSerializer,
    PropertyOwnershipSerializer,
    PropertyImageSerializer
)


class PropertyRegistrationViewSet(viewsets.ModelViewSet):
    queryset = PropertyRegistration.objects.all()
    serializer_class = PropertyRegistrationSerializer


class PropertyTypeViewSet(viewsets.ModelViewSet):
    queryset = PropertyType.objects.all()
    serializer_class = PropertyTypeSerializer


class PropertyOwnershipViewSet(viewsets.ModelViewSet):
    queryset = PropertyOwnership.objects.all()
    serializer_class = PropertyOwnershipSerializer


class PropertyImageViewSet(viewsets.ModelViewSet):
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer