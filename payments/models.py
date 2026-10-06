from django.db import models
from agents.models import AgentRegistration
from properties.models import PropertyOwnership

class RecordPayment(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=0)
    transaction_id = models.CharField(max_length=50)
    agent = models.ForeignKey(AgentRegistration, on_delete=models.CASCADE)
    landlord = models.ForeignKey(PropertyOwnership, on_delete=models.CASCADE)

    def __str__(self):
        return f"{ self.amount } - {self.agent}"
        