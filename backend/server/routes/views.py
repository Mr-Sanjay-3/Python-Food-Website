from django.shortcuts import render
from .qurys import get_all_foods
from django.http import JsonResponse

# Create your views here.

def foods_list(request):
   all_foods = get_all_foods()
   return JsonResponse(all_foods,safe=False)
   
    

