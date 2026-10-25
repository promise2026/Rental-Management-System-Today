from django.contrib import admin

from .models import (
    PropertyType,
    PropertyOwnership,
    PropertyRegistration,
    PropertyImage,
    PropertyInquiry
)


@admin.register(PropertyType)
class PropertyTypeAdmin(admin.ModelAdmin):

    list_display = (
        'name',
        'description',
        'created_at',
        'updated_at'
    )

    search_fields = (
        'name',
        'description'
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

    search_fields = (
        'owner_name',
        'phone_number',
        'email'
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
        'contact',
        'created_at'
    )

    list_filter = (
        'status',
        'property_type',
        'created_at'
    )

    search_fields = (
        'name',
        'location',
        'agent',
        'contact',
        'owner__owner_name'
    )

    ordering = (
        '-created_at',
    )


@admin.register(PropertyImage)
class PropertyImageAdmin(admin.ModelAdmin):

    list_display = (
        'property',
        'caption',
        'created_at'
    )

    list_filter = (
        'created_at',
    )

    search_fields = (
        'property__name',
        'caption'
    )


@admin.register(PropertyInquiry)
class PropertyInquiryAdmin(admin.ModelAdmin):

    list_display = (
        'property',
        'user',
        'status',
        'created_at',
        'updated_at'
    )

    list_filter = (
        'status',
        'created_at'
    )

    search_fields = (
        'property__name',
        'user__username',
        'message'
    )

    ordering = (
        '-created_at',
    )