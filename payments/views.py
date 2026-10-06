from django.shortcuts import render, redirect, get_object_or_404
from .forms import RecordPaymentForm
from .models import RecordPayment

def payment_list(request):
    payments = RecordPayment.objects.all()
    context = {
        'payments': payments,
    }
    return render(request, 'payments/payment_list.html', context)

def add_payment(request):
    if request.method == 'POST':
        payment_form = RecordPaymentForm(request.POST)
        if payment_form.is_valid():
            payment_form.save()
            return redirect('payment_list')
    payment_form = RecordPaymentForm()
    context = {
        'payment_form': payment_form,
    }
    return render(request, 'payments/add_payment.html', context)

def delete_payment(request, pk):
    payment = get_object_or_404(RecordPayment, pk=pk)
    payment.delete()
    return redirect('payment_list')

def view_payment(request, pk):
    payment = get_object_or_404(RecordPayment, pk=pk)
    context = {
        'payment': payment,
    }
    return render(request, 'payments/view_payment.html', context)

def edit_payment(request, pk):
    payment = get_object_or_404(RecordPayment, pk=pk)
    if request.method == 'POST':
        edit_form = RecordPaymentForm(request.POST, instance=payment)
        if edit_form.is_valid():
            edit_form.save()
            return redirect('payment_list')
    edit_form = RecordPaymentForm(instance=payment)
    context = {
        'payment': payment,
        'edit_form': edit_form,
    }
    return render(request, 'payments/edit_payment.html', context)