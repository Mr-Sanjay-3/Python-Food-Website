from django.contrib import admin
from .models import Order, Products

@admin.register(Products)
class ProductsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price', 'imageuri')
    list_filter = ('category',)
    search_fields = ('name', 'category')
    ordering = ('id',)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'customer_phone', 'total_amount', 'status', 'created_at')
    list_editable = ('status',)  # Switch status directly from table
    list_filter = ('status', 'created_at')
    search_fields = ('customer_name', 'customer_phone', 'customer_address')
    ordering = ('-created_at',)
