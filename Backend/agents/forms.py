from django import forms
from .models import AgentRegistration

class AgentRegistrationForm(forms.ModelForm):
    class Meta:
        model = AgentRegistration
        fields = ('name', 'username', 'phone', 'address', 'no_of_properties', 'status')
