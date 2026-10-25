import React, { useState, useContext } from 'react';
import { ShoppingBasket, X, Plus, Minus, Trash2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../../context/CartContext';
import LazyImage from './LazyImage';
import { API_BASE_URL } from '../../config/api';

const Cart = ({ items: propItems, setItems: propSetItems }) => {
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);
  const [localIsOpen, setLocalIsOpen] = useState(false);

  // Form & checkout state
  const [isCheckout, setIsCheckout] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isOpen = cartContext ? cartContext.isOpen : localIsOpen;
  const setIsOpen = cartContext ? cartContext.setIsOpen : setLocalIsOpen;

  const items = propItems ?? cartContext?.cartItems ?? [];
  const setItems = propSetItems ?? cartContext?.setCartItems;

  // 1. Calculate total quantity
  const totalQuantity = items ? items.length : 0;

  // 2. Group identical items together
  const groupedItems = items
    ? items.reduce((acc, currentItem) => {
        const existing = acc.find((item) => item.id === currentItem.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          acc.push({ ...currentItem, quantity: 1 });
        }
        return acc;
      }, [])
    : [];

  // 3. Calculate total price
  const totalPrice = groupedItems.reduce((sum, item) => {
    return sum + (Number(item.price) || 0) * item.quantity;
  }, 0);

  // Increment item
  const handleIncrease = (item) => {
    if (setItems) {
      setItems((prev) => [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          img: item.img || item.imageuri || '',
          category: item.category,
        },
      ]);
    }
  };

  // Decrement item
  const handleDecrease = (item) => {
    if (setItems) {
      setItems((prev) => {
        const index = prev.findIndex((p) => p.id === item.id);
        if (index !== -1) {
          const copy = [...prev];
          copy.splice(index, 1);
          return copy;
        }
        return prev;
      });
    }
  };

  // Remove all instances of an item
  const handleRemoveItem = (itemId) => {
    if (setItems) {
      setItems((prev) => prev.filter((p) => p.id !== itemId));
    }
  };

  // Handle Order Submit to Django Backend
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setErrorMessage('Please fill in your name, phone number, and delivery address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const url = (
        import.meta.env.VITE_API_URI ||
        import.meta.env.API_URI ||
        API_BASE_URL ||
        'https://foodweb-aaoi.onrender.com'
      ).replace(/\/+$/, '');
      const response = await fetch(`${url}/api/orders/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_address: formData.address,
          total_price: totalPrice,
          items: groupedItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Save order id for tracking
      localStorage.setItem('latestOrderId', data.order_id);

      // Clear cart
      if (cartContext?.clearCart) {
        cartContext.clearCart();
      } else if (setItems) {
        setItems([]);
      }

      setIsCheckout(false);
      setIsOpen(false);
      setFormData({ name: '', phone: '', address: '' });

      // Navigate to tracking page
      navigate(`/track?orderId=${data.order_id}`);
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Basket Icon */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-10 right-16 z-50 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
        title="Click to view added products"
      >
        <div className="relative bg-[#1A1A1A] p-4 rounded-full border-2 border-[#F54748] shadow-[0_4px_25px_rgba(245,71,72,0.45)] flex items-center justify-center">
          <ShoppingBasket color="#F54748" size={38} className="md:size-10" />

          {/* Badge counter */}
          {totalQuantity > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs font-bold w-6 h-6 flex items-center justify-center shadow-lg animate-bounce">
              {totalQuantity}
            </span>
          )}
        </div>
      </div>

      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
            setIsCheckout(false);
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* Slide-over Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#111111] border-l border-white/10 text-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#181818]">
          <div className="flex items-center gap-3">
            {isCheckout ? (
              <button
                type="button"
                onClick={() => setIsCheckout(false)}
                className="p-1 hover:bg-white/10 rounded-lg text-gray-300 transition-colors"
                title="Back to Basket"
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
              <ShoppingBasket color="#F54748" size={24} />
            )}
            <div>
              <h3 className="font-bold text-lg text-white">
                {isCheckout ? 'Delivery Details' : 'Your Basket'}
              </h3>
              <p className="text-xs text-gray-400">
                {isCheckout
                  ? 'Enter details to confirm order'
                  : `${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'} added`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              setIsCheckout(false);
            }}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* View 1: Basket Items List */}
        {!isCheckout ? (
          <>
            <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
              {groupedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="text-5xl mb-2">🛒</div>
                  <h4 className="text-lg font-semibold text-white">Your basket is empty</h4>
                  <p className="text-sm text-gray-400 max-w-xs">
                    Click "Order" on any food item to add it to your basket.
                  </p>
                </div>
              ) : (
                groupedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#1A1A1A] border border-white/5 flex items-center justify-between gap-3 hover:border-white/10 transition-all"
                  >
                    {/* Image / Name / Price */}
                    <div className="flex items-center gap-3 min-w-0">
                      {item.img && (item.img.startsWith('http') || item.img.startsWith('/') || item.img.startsWith('data:')) ? (
                        <LazyImage
                          src={item.img}
                          alt={item.name}
                          className="w-10 h-10 object-contain drop-shadow"
                          containerClassName="w-10 h-10 rounded-xl bg-white/5 border border-white/10 shrink-0"
                          fallback="🍔"
                        />
                      ) : (
                        <span className="text-2xl">{item.img || '🍔'}</span>
                      )}
                      <div className="min-w-0">
                        <strong className="text-[#F54748] text-sm block truncate">{item.name}</strong>
                        <span className="font-semibold text-[#FDC55E] text-xs">
                          ₹{item.price} each
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-[#242424] rounded-lg border border-white/10 p-0.5">
                        <button
                          onClick={() => handleDecrease(item)}
                          className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                          title="Decrease"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center font-bold text-xs text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrease(item)}
                          className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
                          title="Increase"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="font-bold text-sm text-white w-14 text-right">
                        ₹{(Number(item.price) || 0) * item.quantity}
                      </span>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Proceed Button */}
            {groupedItems.length > 0 && (
              <div className="p-5 border-t border-white/10 bg-[#181818] space-y-3">
                <div className="flex justify-between items-center text-base font-bold">
                  <span className="text-gray-300">Total Price:</span>
                  <span className="text-[#FDC55E] text-xl">₹{totalPrice}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCheckout(true)}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#F54748] hover:bg-[#e03839] text-white font-bold text-sm shadow-lg shadow-[#F54748]/30 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>Proceed to Order (₹{totalPrice})</span>
                </button>
              </div>
            )}
          </>
        ) : (
          /* View 2: Human-Friendly Customer Order Form */
          <form onSubmit={handleOrderSubmit} className="flex-1 flex flex-col justify-between p-5 overflow-y-auto">
            <div className="space-y-4">
              <div className="bg-[#1A1A1A] p-3.5 rounded-xl border border-white/10 flex justify-between items-center">
                <span className="text-xs text-gray-400">Order Summary:</span>
                <span className="text-sm font-bold text-[#FDC55E]">
                  {totalQuantity} items • ₹{totalPrice}
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/80 border border-red-700/50 rounded-lg text-red-200 text-xs">
                  {errorMessage}
                </div>
              )}


{/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"

                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#181818] border border-white/15 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-500 text-sm focus:border-[#F54748] outline-none"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#181818] border border-white/15 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-500 text-sm focus:border-[#F54748] outline-none"
                />
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Delivery Address *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#181818] border border-white/15 rounded-xl py-2.5 px-3.5 text-white placeholder-gray-500 text-sm focus:border-[#F54748] outline-none resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-[#F54748] hover:bg-[#e03839] disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-[#F54748]/30 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Placing Order...</span>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    <span>Confirm Order (₹{totalPrice})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsCheckout(false)}
                className="w-full py-2 text-center text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                ← Back to edit items
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default Cart;
