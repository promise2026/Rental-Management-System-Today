from django.shortcuts import render, redirect, get_object_or_404
from .forms import AgentRegistrationForm
from .models import AgentRegistration


def agents_list(request):
    agents_list = AgentRegistration.objects.all()
    context = {
        'agents_list': agents_list,
    }
    return render(request, 'agents/agents_list.html', context)

def add_agent(request):
    if request.method == 'POST':
        form = AgentRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('agents_list')
    form = AgentRegistrationForm()
    context = {
        'form': form,
    }
    return render(request, 'agents/add_agent.html', context)

def edit_agent(request, pk):
    agent = get_object_or_404(AgentRegistration, pk=pk)
    if request.method == 'POST':
        form = AgentRegistrationForm(request.POST, instance=agent)
        if form.is_valid():
            form.save()
            return redirect('agents_list')
    form = AgentRegistrationForm(instance=agent)
    context = {
        'form': form,
        'agent': agent,
    }
    return render(request, 'agents/edit_agent.html', context)

def delete_agent(request, pk):
    agent = get_object_or_404(AgentRegistration, pk=pk)
    agent.delete()
    return redirect('agents_list')

def view_agent(request, pk):
    agent = get_object_or_404(AgentRegistration, pk=pk)
    context = {
        'agent': agent,
    }
    return render(request, 'agents/view_agent.html', context)