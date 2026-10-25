from django.contrib import admin

from .models import (
    UserProfile,
    FavoriteProperty
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):

    list_display = (
        'user',
        'phone_number',
        'role',
        'location',
        'created_at'
    )

    list_filter = (
        'role',
        'created_at'
    )

    search_fields = (
        'user__username',
        'user__email',
        'phone_number',
        'location'
    )

    ordering = (
        '-created_at',
    )


@admin.register(FavoriteProperty)
class FavoritePropertyAdmin(admin.ModelAdmin):

    list_display = (
        'user',
        'property',
        'created_at'
    )

    list_filter = (
        'created_at',
    )

    search_fields = (
        'user__username',
        'property__name',
        'property__location'
    )

    ordering = (
        '-created_at',
    )