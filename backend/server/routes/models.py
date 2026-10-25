from django.db import models

class Products(models.Model):
    name = models.CharField(max_length=180, default='')
    category = models.CharField(max_length=150, default='')
    price = models.PositiveBigIntegerField()
    imageuri = models.TextField(default='')

    def __str__(self):
        return f"{self.name} ({self.category}) - ₹{self.price}"

    class Meta:
        verbose_name_plural = "Products"


class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PREPARING', 'Preparing Food'),
        ('OUT_FOR_DELIVERY', 'Out for Delivery'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]

    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=20)
    customer_address = models.TextField()
    items_summary = models.TextField(help_text="Ordered food items")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name} ({self.status})"

    class Meta:
        ordering = ['-created_at']
