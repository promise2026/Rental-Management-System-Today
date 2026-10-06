from django.shortcuts import render


def homepage(request):
    return render(request, 'homepage.html')

def learn(request):
    return render(request, 'learn.html')

def about_us(request):
    return render(request, 'about_us.html')

def settings(request):
   return render(request, 'settings.html') 

def dashboard(request):
    return render(request, 'dashboard/dashboard_overview.html')

def dashboard_overview(request):
    return render(request, 'dashboard/dashboard_overview.html')
