from django.contrib import admin
from .models import RecordPayment

class RecordPaymentAdmin(admin.ModelAdmin):
    list_display = ['date', 'amount', 'transaction_id', 'agent', 'landlord']
    
admin.site.register(RecordPayment, RecordPaymentAdmin)
