
from django.contrib import admin

from .models import (
    PropertyType,
    PropertyOwnership,
    PropertyRegistration,
    PropertyImage
)


@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'description',
        'created_at',
        'updated_at'
    )


@admin.register(PropertyOwnership)
class PropertyOwnershipAdmin(admin.ModelAdmin):
    list_display = (
        'owner_name',
        'phone_number',
        'email',
        'created_at',
        'updated_at'
    )


@admin.register(PropertyRegistration)
class PropertyRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'property_type',
        'location',
        'price',
        'owner',
        'agent',
        'status',
        'contact'
    )

    list_filter = (
        'status',
        'property_type'
    )

    search_fields = (
        'name',
        'location',
        'agent'
    )


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):
    list_display = (
        'property',
        'caption',
        'created_at'
    )

    list_filter = (
        'property',
    )

    search_fields = (
        'property__name',
        'caption'
    )