from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):

    ROLE_CHOICES = [
        ('seeker', 'Accommodation Seeker'),
        ('owner', 'Property Owner'),
        ('agent', 'Property Agent'),
    ]

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )

    phone_number = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='seeker'
    )

    location = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.user.username} - {self.role}"


class FavoriteProperty(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='favorite_properties'
    )

    property = models.ForeignKey(
        'properties.PropertyRegistration',
        on_delete=models.CASCADE,
        related_name='favorited_by'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:

        constraints = [
            models.UniqueConstraint(
                fields=['user', 'property'],
                name='unique_user_favorite'
            )
        ]

        ordering = ['-created_at']

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.property.name}"
        )