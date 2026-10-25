from django.urls import path
from . import views

urlpatterns = [
    path('api/foodlist/', views.foods_list),
    path('api/orders/create/', views.create_order),
    path('api/orders/<int:order_id>/', views.get_order_status),
]