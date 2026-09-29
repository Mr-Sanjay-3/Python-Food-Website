import React, { useEffect, useState } from 'react';
import { BadgePlus } from 'lucide-react';
import Cart from './SubComponents/Cart';
import DummyData from './DummyData.json';

const FOOD_DATA = DummyData;

// Extract unique categories and add 'All'
const CATEGORIES = ['All', ...new Set(FOOD_DATA.map((item) => item.category))];

export default function FoodMenu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cartProduct, setCartProducts] = useState([]);
  const [allProducts, setProducts] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/foodlist/');
        if (!response.ok) throw new Error('Fetch failed');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.log('Error on fetch :', error);
        setProducts(FOOD_DATA);
      }
    };
    fetchdata();
  }, []);

  const addToCart = (product) => {
    setCartProducts((prevItem) => {
      return [
        ...prevItem,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          img: product.imageuri || product.img || '',
        },
      ];
    });
  };

  // Filter items based on active category row selection
  const filteredFood =
    activeCategory === 'All'
      ? FOOD_DATA
      : FOOD_DATA.filter((item) => item.category === activeCategory);

  return (
    <>
      <div className="bg-[#0e0001] w-[90%] mt-12 ml-12 border-2 border-red-800 rounded-lg">
        <div>
          <ul className="flex flex-wrap gap-10 justify-center align-middle m-4">
            {allProducts.map((items) => (
              <button
                key={items.id || items.category}
                className="text-white bg-[#B80707] p-[4px] font-sofia rounded-md"
              >
                {items.category}
              </button>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-2">
          {allProducts.map((items) => (
            <section
              key={items.id}
              className="bg-gray-900 m-9 h-auto rounded-r-[14px] border-2 border-amber-50"
            >
              <div className="flex h-auto w-full flex-col text-center m-4 justify-center items-center">
                <img
                  src={items.imageuri}
                  alt={items.name}
                  className="transition-transform h-auto rounded-[40%] md:w-[40%] w-[60%] hover:scale-75 hover:opacity-45 duration-1000"
                />
                <p className="font-mono mt-2 text-l font-bold text-white">{items.name}</p>
                <h6 className="font-bold text-white">₹{items.price}</h6>
                <button
                  onClick={() => addToCart(items)}
                  className="bg-orange-600 hover:bg-orange-700 active:scale-95 text-white font-medium px-4 py-1.5 mt-4 rounded-md flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
                >
                  <BadgePlus size={18} />
                  <span>Order</span>
                  {cartProduct.filter((p) => p.id === items.id).length > 0 && (
                    <span className="bg-white text-orange-600 text-xs px-1.5 py-0.5 rounded-full font-bold ml-1">
                      {cartProduct.filter((p) => p.id === items.id).length}
                    </span>
                  )}
                </button>
                <h1 className=""></h1>
              </div>
            </section>
          ))}
        </div>
      </div>

      <Cart items={cartProduct} setItems={setCartProducts} />
    </>
  );

}