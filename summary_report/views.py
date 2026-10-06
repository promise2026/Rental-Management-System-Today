from django.shortcuts import render

# Create your views here.
def summary_report(request):
    return render(request, 'summary_report/summary_report.html')
