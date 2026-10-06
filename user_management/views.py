from django.shortcuts import redirect, render
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, logout


def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            
            user = authenticate(username=username, password=password)
            if user:
                return redirect('dashboard')
        else:
            print(form.errors)
    form = AuthenticationForm()
    context = {
        'form': form,
    }
    return render(request, 'user_management/login.html', context)


def log_out(request):
    logout(request)
    return redirect('homepage')

def agents(request):
    return render(request, 'user_management/agents.html')

