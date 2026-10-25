import React, { useState, useRef, useEffect, useMemo } from 'react';
import { SearchIcon, BadgePlus, Loader2, Sparkles, X, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import LazyImage from './LazyImage';
import { API_BASE_URL } from '../../config/api';

const SearchBar = ({ placeholder = "Search food, burger, pizza, biryani..." }) => {
  const [allFoods, setAllFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [justAddedId, setJustAddedId] = useState(null);
  const dropdownRef = useRef(null);

  const { addToCart, cartItems } = useCart();

  // Load foods directly from backend API
  useEffect(() => {
    let isMounted = true;
    const fetchFoods = async () => {
      setIsLoading(true);
      try {
        const url = (
          import.meta.env.VITE_API_URI ||
          import.meta.env.API_URI ||
          API_BASE_URL ||
          'https://foodweb-aaoi.onrender.com'
        ).replace(/\/+$/, '');
        const response = await fetch(`${url}/api/foodlist/`);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const data = await response.json();
        if (isMounted && Array.isArray(data)) {
          setAllFoods(data);
        }
      } catch (error) {
        console.warn('Backend fetch failed for SearchBar:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchFoods();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute matching or recommended foods
  const displayedFoods = useMemo(() => {
    if (!allFoods || allFoods.length === 0) return [];

    const query = searchVal.trim().toLowerCase();
    if (!query) {
      // When input is empty, return top 8 popular dishes as recommendations
      return allFoods.slice(0, 8);
    }

    return allFoods.filter((item) => {
      const nameMatch = item.name && item.name.toLowerCase().includes(query);
      const catMatch = item.category && item.category.toLowerCase().includes(query);
      return nameMatch || catMatch;
    });
  }, [searchVal, allFoods]);

  // Handle Add to Cart with quick animated visual confirmation
  const handleAdd = (food, e) => {
    e.stopPropagation();
    addToCart(food);
    setJustAddedId(food.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 1200);
  };

  // Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative ml-4 md:ml-7 w-full max-w-md sm:max-w-lg mt-8 z-40">
      {/* Search Input Box */}
      <div 
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center gap-1 h-12 bg-[#0D0D0D]/90 backdrop-blur-md border-[2px] rounded-3xl border-white/80 transition-all focus-within:border-[#FDCE77] focus-within:shadow-[0_0_20px_rgba(253,206,119,0.3)] shadow-lg"
      >
        <input
          value={searchVal}
          onChange={(e) => {
            setSearchVal(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          type="text"
          name="food-search"
          autoComplete="off"
          placeholder={placeholder}
          className="w-[90%] border-none py-3 px-5 text-[#E0E0E0] placeholder-gray-400 outline-none h-10 bg-transparent text-sm"
        />

        {searchVal && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSearchVal('');
            }}
            className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer mr-1"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className="flex h-10 w-11 shrink-0 items-center justify-center rounded-full bg-[#FDCE77] text-black md:h-10 md:w-14 mr-1 cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-md"
          title="Search"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin text-black" />
          ) : (
            <SearchIcon className="h-4 w-4 md:h-5 md:w-5" />
          )}
        </button>
      </div>

      {/* Dropdown Results Box */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-full bg-[#121212]/98 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl space-y-3 max-h-[420px] overflow-y-auto custom-scrollbar z-50 animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center px-1 pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-300 font-bold">
              <Sparkles size={13} className="text-[#FDCE77]" />
              <span>
                {searchVal.trim()
                  ? `Found ${displayedFoods.length} items for "${searchVal}"`
                  : `Popular Dishes (${allFoods.length} on menu)`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer px-1 py-0.5 rounded hover:bg-white/10"
            >
              ✕ Close
            </button>
          </div>

          {/* Loading Skeleton */}
          {isLoading && allFoods.length === 0 ? (
            <div className="space-y-3 py-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 animate-pulse">
                  <div className="w-12 h-12 rounded-xl bg-white/10 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                    <div className="h-3 bg-white/10 rounded w-1/3" />
                  </div>
                  <div className="h-8 w-16 bg-white/10 rounded-lg shrink-0" />
                </div>
              ))}
            </div>
          ) : displayedFoods.length > 0 ? (
            /* Food Cards List */
            <div className="space-y-2.5">
              {displayedFoods.map((food) => {
                const inCartCount = cartItems.filter((p) => p.id === food.id).length;
                const imgSrc = food.imageuri || food.img;
                const isJustAdded = justAddedId === food.id;

                return (
                  <div
                    key={food.id}
                    className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-xl bg-[#1A1A1A] border border-white/5 hover:border-[#FDCE77]/40 hover:bg-[#222222] transition-all group"
                  >
                    {/* Food Thumbnail & Information */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1 shrink-0 overflow-hidden">
                        <LazyImage
                          src={imgSrc}
                          alt={food.name}
                          eager={true}
                          className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
                          containerClassName="w-10 h-10"
                          fallback="🍔"
                        />
                      </div>

                      <div className="min-w-0">
                        <strong className="text-white text-sm block truncate group-hover:text-[#FDCE77] transition-colors">
                          {food.name}
                        </strong>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="bg-[#B80707]/30 text-[#F54748] px-2 py-0.5 rounded text-[10px] font-semibold">
                            {food.category}
                          </span>
                          <span className="text-[#FDC55E] font-bold text-xs">
                            ₹{food.price}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleAdd(food, e)}
                      className={`shrink-0 text-xs font-semibold py-2 px-3.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 ${
                        isJustAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-orange-600/30'
                      }`}
                      title="Add to cart"
                    >
                      {isJustAdded ? (
                        <>
                          <Check size={14} className="animate-bounce" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <BadgePlus size={15} />
                          <span>Order</span>
                          {inCartCount > 0 && (
                            <span className="bg-white text-orange-600 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ml-0.5">
                              {inCartCount}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* No Results Found */
            <div className="text-center py-8 text-gray-400 text-sm space-y-2">
              <span className="text-4xl block">🍽️</span>
              <p className="font-medium text-white">No dishes found for "{searchVal}"</p>
              <p className="text-xs text-gray-400">
                Try searching for "burger", "pizza", "chicken", "biryani", or "salad"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
