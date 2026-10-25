from django.contrib.auth.models import User
from django.db import models


class PropertyType(models.Model):

    name = models.CharField(
        max_length=50
    )

    description = models.TextField(
        max_length=255
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name


class PropertyOwnership(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.SET_NULL,
        related_name='property_ownership',
        blank=True,
        null=True
    )

    owner_name = models.CharField(
        max_length=100
    )

    phone_number = models.CharField(
        max_length=20
    )

    email = models.EmailField(
        max_length=254,
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
        return self.owner_name


STATUS_CHOICES = [
    ('occupied', 'Occupied'),
    ('available', 'Available'),
    ('under_review', 'Under Review'),
]


class PropertyRegistration(models.Model):

    name = models.CharField(
        max_length=100
    )

    property_type = models.ForeignKey(
        PropertyType,
        on_delete=models.CASCADE,
        related_name='properties'
    )

    location = models.CharField(
        max_length=100
    )

    price = models.PositiveIntegerField(
        default=0
    )

    owner = models.ForeignKey(
        PropertyOwnership,
        on_delete=models.CASCADE,
        related_name='properties'
    )

    agent = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='under_review'
    )

    contact = models.CharField(
        max_length=20
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name


class PropertyImage(models.Model):

    property = models.ForeignKey(
        PropertyRegistration,
        on_delete=models.CASCADE,
        related_name='images'
    )

    image = models.ImageField(
        upload_to='property_images/'
    )

    caption = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"Image for {self.property.name}"


class PropertyInquiry(models.Model):

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('responded', 'Responded'),
        ('closed', 'Closed'),
    ]

    property = models.ForeignKey(
        PropertyRegistration,
        on_delete=models.CASCADE,
        related_name='inquiries'
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='property_inquiries'
    )

    message = models.TextField(
        max_length=1000
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.property.name}"
        )