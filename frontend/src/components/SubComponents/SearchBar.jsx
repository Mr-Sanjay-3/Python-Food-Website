import React, { useState, useRef, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import DummyData from '../DummyData.json';

const SearchBar = ({ placeholder = "Search it ..." }) => {
  const [foods, setFoods] = useState(DummyData);
  const [searchVal, setSearchVal] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Reusable search function
  const executeSearch = (textValue) => {
    if (textValue.trim() === "") {
      setFoods(DummyData);
      return;
    }
    const filterBySearch = DummyData.filter((item) => {
      return item.name.toLowerCase().includes(textValue.toLowerCase());
    });
    setFoods(filterBySearch);
  };

  // Triggers instantly on typing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchVal(value);
    executeSearch(value);
    setIsOpen(true); // Open dropdown when typing
  };

  // Triggers when clicking the yellow search button
  const handleButtonClick = () => {
    executeSearch(searchVal);
    setIsOpen(true);
  };

  // Close dropdown if user clicks outside the search bar component
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
    <div ref={dropdownRef} className="relative ml-4 w-80 mt-10 z-10">
      {/* Search Input Box */}
      <div className="flex w-full items-center gap-1 h-12 bg-[#0D0D0D] border-[2px] rounded-3xl border-solid border-white transition-all focus-within:border-[#FDCE77]">
        <input
          value={searchVal}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)} // Open when clicking into input
          type="search"
          name="search"
          placeholder={placeholder}
          className="w-[93%] border-none py-4 px-4 text-[#939AAD] outline-none h-10 bg-transparent"
        />
        <button
          type="button" 
          onClick={handleButtonClick}
          className="flex h-10 w-11 shrink-0 items-center justify-center gap-3 rounded-full bg-[#FDCE77] text-black md:h-10 md:w-14 md:rounded-full mr-1 cursor-pointer transition-transform active:scale-95"
        >
          <SearchIcon className="h-4 w-4 md:h-6 md:w-6 lg:h-6 lg:w-6" />
        </button>
      </div>

      {/* Floating Glassmorphism Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 max-h-64 overflow-y-auto z-50 bg-[#0d0d0d]/85 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl custom-scrollbar animate-fadeIn">
          {foods.length > 0 ? (
            foods.map((food) => (
              <div 
                key={food.id} 
                className="p-3 border-b border-white/5 flex gap-3 items-center hover:bg-white/10 cursor-pointer transition-colors"
                onClick={() => {
                  setSearchVal(food.name);
                  executeSearch(food.name);
                  setIsOpen(false); // Close box on item select
                }}
              >
                <span className="text-xl">{food.img}</span>
                <div className="flex flex-col">
                  <strong className="text-white text-sm">{food.name}</strong>
                  <span className="text-xs text-gray-400">{food.category} • ₹{food.price} <button className='bg-white'>add</button></span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm italic p-4 text-center">No matching foods found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
