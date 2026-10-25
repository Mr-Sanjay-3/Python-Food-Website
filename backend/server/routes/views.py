import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .qurys import get_all_foods
from .models import Order

def foods_list(request):
    all_foods = get_all_foods()
    return JsonResponse(all_foods, safe=False)

@csrf_exempt
def create_order(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        name = data.get('customer_name', '').strip()
        phone = data.get('customer_phone', '').strip()
        address = data.get('customer_address', '').strip()
        total_price = data.get('total_price', 0)
        items = data.get('items', [])

        if not name or not phone or not address:
            return JsonResponse({'error': 'Please provide name, phone, and delivery address'}, status=400)
        
        if not items:
            return JsonResponse({'error': 'Your cart is empty'}, status=400)

        # Build clean summary string: "Burger & Fries x2, Pizza x1"
        summary_parts = []
        for item in items:
            item_name = item.get('name', 'Food')
            item_qty = item.get('quantity', 1)
            item_price = item.get('price', 0)
            summary_parts.append(f"{item_name} x{item_qty} (₹{item_price})")
        items_summary = ", ".join(summary_parts)

        # Create order in database
        order = Order.objects.create(
            customer_name=name,
            customer_phone=phone,
            customer_address=address,
            items_summary=items_summary,
            total_amount=total_price,
            status='PENDING'
        )

        return JsonResponse({
            'success': True,
            'order_id': order.id,
            'status': order.status,
            'message': 'Order placed successfully!'
        }, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def get_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        return JsonResponse({
            'success': True,
            'order': {
                'id': order.id,
                'customer_name': order.customer_name,
                'customer_phone': order.customer_phone,
                'customer_address': order.customer_address,
                'items_summary': order.items_summary,
                'total_amount': float(order.total_amount),
                'status': order.status,
                'status_display': order.get_status_display(),
                'created_at': order.created_at.strftime('%Y-%m-%d %I:%M %p')
            }
        })
    except Order.DoesNotExist:
        return JsonResponse({'error': 'Order not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
