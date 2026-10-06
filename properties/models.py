from django.db import models


class PropertyType(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=255)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.name


class PropertyOwnership(models.Model):
    owner_name = models.CharField(max_length=50)
    phone_number = models.IntegerField()
    email = models.EmailField(
        max_length=254,
        blank=True,
        null=True
    )
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.owner_name


STATUS_CHOICES = [
    ('occupied', 'Occupied'),
    ('available', 'Available'),
    ('under_review', 'Under Review')
]


class PropertyRegistration(models.Model):
    name = models.CharField(max_length=50)

    property_type = models.ForeignKey(
        PropertyType,
        on_delete=models.CASCADE
    )

    location = models.CharField(max_length=50)

    price = models.IntegerField(default=0)

    owner = models.ForeignKey(
        PropertyOwnership,
        on_delete=models.CASCADE
    )

    agent = models.CharField(max_length=50)

    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='under_review'
    )

    contact = models.IntegerField()

    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

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