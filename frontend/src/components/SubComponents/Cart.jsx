import React, { useState } from 'react';
import { ShoppingBasket, X, Plus, Minus, Trash2 } from 'lucide-react';

const Cart = ({ items = [], setItems }) => {
  const [isOpen, setIsOpen] = useState(false);

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
      setItems((prev) => [...prev, { id: item.id, name: item.name, price: item.price, img: item.img }]);
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

  return (
    <>
      {/* Visual Floating Basket Icon - Clicking opens the added products drawer */}
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

      {/* Backdrop overlay when drawer is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        />
      )}

      {/* Slide-over Drawer / Modal (Opens on Basket Icon Click) */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#111111] border-l border-white/10 text-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#181818]">
          <div className="flex items-center gap-3">
            <ShoppingBasket color="#F54748" size={24} />
            <div>
              <h3 className="font-bold text-lg text-white">Your Basket</h3>
              <p className="text-xs text-gray-400">
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} added
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Added Products List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 custom-scrollbar">
          {groupedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="text-5xl mb-2">🛒</div>
              <h4 className="text-lg font-semibold text-white">Your basket is empty</h4>
              <p className="text-sm text-gray-400 max-w-xs">
                Click "Order Food" on any food item to add it to your basket.
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
                    <img src={item.img} alt={item.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
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

        {/* Footer with Total */}
        {groupedItems.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-[#181818] space-y-3">
            <div className="flex justify-between items-center text-base font-bold">
              <span className="text-gray-300">Total Price:</span>
              <span className="text-[#FDC55E] text-xl">₹{totalPrice}</span>
            </div>

            <button
              onClick={() => {
                alert(`Order confirmed for ₹${totalPrice}!`);
                setIsOpen(false);
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#F54748] hover:bg-[#e03839] text-white font-bold text-sm shadow-lg shadow-[#F54748]/30 transition-all cursor-pointer active:scale-98"
            >
              Order Now (₹{totalPrice})
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
