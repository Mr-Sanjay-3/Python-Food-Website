import React, { useState } from 'react'

//Images
import TrustHeart from '../assets/svg/trust-heart.svg'
import Ellipse from '../assets/images/Ellipse 44-1.png'
import Girl from '../assets/images/girl.png'
import RedFireStrike from '../assets/svg/Vector.svg'

//Meals
import Meal1 from '../assets/svg/Meal1.svg'
import Meal2 from '../assets/svg/Meal2.svg'
import Meal3 from '../assets/svg/Meal3.svg'
import Meal4 from '../assets/svg/Meal4.svg'
import FireIcon from '../assets/svg/emojione_fire.svg'
import GlassStrikRight from '../assets/svg/Group8431.svg'
import GlassStrikLeft from '../assets/svg/Group8432.svg'
import Seekleav from '../assets/svg/SeekPng.svg'
import SearchBar from './SubComponents/SearchBar'

const Home = () => {

  return (
  

 <>

 <div className='w-full min-h-screen flex flex-col lg:flex-row relative overflow-hidden p-4 '>
  
  {/* Slogan Section */}
  <div className='text-white mt-10 w-full lg:w-1/2 z-10' id='slogon'>
   <div className="bg-[rgba(246,95,95,0.05)] flex ml-6 mb-4 rounded-3xl w-48 justify-start items-center p-1" >
    <img src={TrustHeart} alt="" className='ml-2 w-5 h-5' />
    <p className='font-sans pl-2 text-white text-sm'>People Trust us</p> 

   </div>
   
   {/* Quotes */}
   <h2 className=' md:text-6xl text-4xl font-sofia font-bold ml-6 lg:ml-7 leading-tight'>
     <span className='text-white'>We're </span>
     <span className='text-[#F54748]'>Serious </span>
     <span className='text-white'>For </span> 
     <br />
     <span className='text-[#F54748]'>Food </span> 
     <span className='text-white'>& </span> 
     <span className='text-[#FDC55E]'>Delivery</span>
     <span className='text-white'>.</span>
     <img src={RedFireStrike} size={"12px"} className='  w-36' alt="" />
   </h2>


   <p className=' ml-7 mt-4 text-[13px] md:text-base'> Best cooks and best delivery gus all at your servic.<br /> Hot tasty food reach you in 30 minutes.</p>
<SearchBar />
  </div>

  {/* Visuals / Images Section */}
  <div className="w-full lg:w-1/2 flex justify-center items-center mt-10 lg:mt-0 min-h-[450px]  " id='1'>
    {/* Background Circle - Scales scaling dynamically using aspect-square */}

    <div className="bg-[#F65F5F] rounded-full  w-72 sm:w-80 md:w-[400px] aspect-square rounded-b-full  relative flex items-center justify-center">

 
       {/* Main Character Image Group */}
       <div className="absolute bottom-6 w-[85%] z-10 flex justify-center ">
 <img 
      src={Ellipse} 
      alt="" 
      className="absolute bottom-[-50px] w-[350px] sm:w-[350px] md:w-[480px] max-w-none aspect-square z-10"  
    />
             <img src={Girl} alt="girl Holding Pizza" className='w-full  max-w-[340px]  rounded-[23%]  ' />
         <img src={FireIcon} alt="" className='absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-8' />
         <img src={GlassStrikRight} alt="FireStork" className='absolute md:top-[70px] md:right-20 top-12 sm:right-16 sm:top-14  right-14 w-6 z-10' />
         <img src={GlassStrikLeft} alt="FireStrok" className='absolute md:top-20   md:left-20 left-12 top-14   w-6' />
         {/* Punidha */}
         <img src={Seekleav} className='absolute sm:w-28 w-24 -right-12 top-6' alt="" />

         
       </div> 

       {/* Floating Meals  */}
       <div className="absolute inset-0 w-full h-full pointer-events-none">
         <img src={Meal1} alt="" className='absolute -left-10 z-10 top-2/4 w-16 sm:w-20 md:w-24' />
         <img src={Meal2} alt="" className='absolute left-16 z-10 -bottom-8 w-16 sm:w-20 md:w-24' />
         <img src={Meal3} alt="" className='absolute bottom-[-20px] left-2/3 w-20 sm:w-20 md:w-24 z-10' />
         <img src={Meal4} alt="" className='absolute -right-10 bottom-1/3 w-20 sm:w-20 md:w-24 z-10' />
       </div>

    </div>
  </div>

 </div>
</>

 

  
  )
}

export default Home
