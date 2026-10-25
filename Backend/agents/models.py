from django.db import models

STATUS_CHOICES = [
    ('active', 'Active'),
    ('warning', 'Warning'),
    ('suspended', 'Suspended')
]

class AgentRegistration(models.Model):
    name = models.CharField(max_length=30)
    username = models.CharField(max_length=20)
    phone = models.IntegerField()
    address = models.CharField(max_length=100)
    no_of_properties = models.IntegerField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    