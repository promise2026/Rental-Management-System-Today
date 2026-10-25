from .models import PropertyType, PropertyRegistration
from django import forms


class PropertyTypeForm(forms.ModelForm):
    class Meta:
        model = PropertyType
        fields = ('name', 'description')
    
class PropertyRegistrationForm(forms.ModelForm):  
    class Meta:
        model = PropertyRegistration
        fields = ('name', 'property_type', 'location', 'price', 'owner', 'agent', 'status', 'contact')

