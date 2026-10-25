from django import forms
from .models import RecordPayment

class RecordPaymentForm(forms.ModelForm):
    class Meta:
        model = RecordPayment
        fields = ('amount', 'transaction_id', 'agent', 'landlord')
        