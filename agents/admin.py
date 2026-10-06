from django.contrib import admin
from .models import AgentRegistration

class AgentRegistrationAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone']

admin.site.register(AgentRegistration, AgentRegistrationAdmin)

