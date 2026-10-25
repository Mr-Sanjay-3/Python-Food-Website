import React, { useEffect, useState, useRef } from 'react';
import { BadgePlus, Loader2, Sparkles, CheckCircle2, RefreshCw, AlertCircle, Search, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import LazyImage from './SubComponents/LazyImage';

export default function FoodMenu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFromBackend, setIsFromBackend] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const { cartItems, addToCart } = useCart();
  const observerTargetRef = useRef(null);

  // Fetch foods directly from Django backend
  const fetchFoods = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/foodlist/');
      if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to load food items`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setProducts(data);
        setIsFromBackend(true);
      } else {
        throw new Error('Received unexpected data format from backend');
      }
    } catch (err) {
      console.error('Backend fetch error:', err);
      setError(err.message || 'Unable to connect to backend server');
      setIsFromBackend(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Deduplicate categories and add 'All'
  const categories = [
    'All',
    ...new Set(
      allProducts
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  // Filter items based on active category selection
  const filteredProducts =
    activeCategory === 'All'
      ? allProducts
      : allProducts.filter((item) => item.category === activeCategory);

  // Reset lazy load counter when changing categories
  useEffect(() => {
    setVisibleCount(12);
  }, [activeCategory]);

  // Lazy loading Intersection Observer for progressive infinite scroll
  useEffect(() => {
    if (!observerTargetRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredProducts.length) {
          setVisibleCount((prev) => Math.min(prev + 12, filteredProducts.length));
        }
      },
      {
        root: null,
        rootMargin: '250px',
        threshold: 0.1,
      }
    );

    observer.observe(observerTargetRef.current);

    return () => observer.disconnect();
  }, [visibleCount, filteredProducts.length]);

  // Sliced items currently visible
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="bg-[#0e0001] w-[94%] max-w-7xl mx-auto mt-8 border-2 border-red-800/80 rounded-2xl pb-12 shadow-2xl overflow-hidden">
      {/* Backend Status & Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 pt-6 pb-2 border-b border-red-900/30 gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FDC55E]" />
          <h2 className="text-xl md:text-2xl font-bold font-sofia   text-white tracking-wide">
            Explore Our Menu
          </h2>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="p-4">
        <ul className="flex flex-wrap gap-3 sm:gap-4 justify-center items-center m-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 font-sofia rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeCategory === cat
                ? 'bg-[#B80707] text-white shadow-lg shadow-red-900/60 scale-105'
                : 'bg-[#220708] text-gray-300 hover:bg-[#380e10] hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </ul>
      </div>

      {/* Error & Retry State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-lg font-bold text-white">Failed to connect to backend server</h3>
          <p className="text-sm text-gray-400 max-w-md">{error}</p>
          <button
            onClick={fetchFoods}
            className="flex items-center gap-2 bg-[#B80707] hover:bg-red-700 text-white font-medium px-5 py-2.5 rounded-xl cursor-pointer transition-all shadow-lg active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading Skeleton State */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 py-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-900/80 rounded-2xl p-5 border border-white/5 animate-pulse flex flex-col items-center justify-center space-y-4 min-h-[220px]"
            >
              <div className="w-24 h-24 rounded-full bg-white/5" />
              <div className="h-4 w-3/4 bg-white/10 rounded" />
              <div className="h-4 w-1/3 bg-white/10 rounded" />
              <div className="h-8 w-24 bg-white/10 rounded-md" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Food Items Grid with Lazy Loaded Images */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-6">
            {visibleProducts.map((item) => {
              const inCartCount = cartItems.filter((p) => p.id === item.id).length;
              const imageSrc = item.imageuri || item.img;

              return (
                <section
                  key={item.id}
                  className="bg-gray-900 hover:bg-gray-800/90 rounded-2xl border-2 border-amber-50/20 hover:border-amber-400/50 transition-all duration-300 p-4 flex flex-col justify-between items-center text-center shadow-lg hover:shadow-2xl hover:-translate-y-1 group"
                >
                  <div className="flex flex-col items-center w-full">
                    {/* Lazy Loaded Food Cutout Image */}
                    <div className="w-full flex justify-center py-2">
                      <LazyImage
                        src={imageSrc}
                        alt={item.name}
                        className="h-28 w-28 sm:h-32 sm:w-32 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                        containerClassName="h-32 w-32"
                        fallback="🍔"
                      />
                    </div>

                    {/* Food Name & Price */}
                    <p className="font-mono mt-2 text-sm sm:text-base font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                      {item.name}
                    </p>
                    <span className="text-[11px] text-gray-400 font-sans mt-0.5">
                      {item.category}
                    </span>
                    <h6 className="font-bold text-amber-400 text-base sm:text-lg mt-1">
                      ₹{item.price}
                    </h6>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-medium text-xs sm:text-sm py-2 px-3 mt-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md shadow-orange-600/30"
                  >
                    <BadgePlus size={16} />
                    <span>Order</span>
                    {inCartCount > 0 && (
                      <span className="bg-white text-orange-600 text-xs px-1.5 py-0.5 rounded-full font-bold ml-1">
                        {inCartCount}
                      </span>
                    )}
                  </button>
                </section>
              );
            })}
          </div>

          {/* Lazy Loading Sentinel Target & Load Progress */}
          <div
            ref={observerTargetRef}
            className="w-full py-8 flex flex-col items-center justify-center text-center"
          >
            {visibleCount < filteredProducts.length ? (
              <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}