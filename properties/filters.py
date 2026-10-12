import django_filters

from .models import PropertyRegistration


class PropertyFilter(django_filters.FilterSet):

    min_price = django_filters.NumberFilter(
        field_name='price',
        lookup_expr='gte'
    )

    max_price = django_filters.NumberFilter(
        field_name='price',
        lookup_expr='lte'
    )

    class Meta:

        model = PropertyRegistration

        fields = [
            'status',
            'property_type',
            'owner',
            'location',
            'min_price',
            'max_price'
        ]