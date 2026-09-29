from django.urls import path
from . import views

urlpatterns = [
    path('api/foodlist/',views.foods_list),
]