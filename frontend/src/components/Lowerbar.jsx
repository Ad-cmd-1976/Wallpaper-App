import { useState } from 'react'
import Line from '../assets/line';
import { Link } from 'react-router-dom';
import LowerButton from './LowerButton';
import { Search } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore.js';
import { useImageStore } from '../store/useImageStore.js';
import { usePurchaseStore } from '../store/usePurchaseStore.js';

const Lowerbar = () => {
  const [scroll, setScroll] = useState(0);
  const { resetToHome, searchImages, searchVal, setsearchVal }=useImageStore();
  const {theme}=useThemeStore();
  const { buyPlus }=usePurchaseStore();

  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{
      await searchImages(searchVal);
    }
    catch(error){
      toast.error(error.response.data.message || "Failed to load images!");
    }
  }
  
  return (
    <div className={`${theme ? "text-gray-400" : "bg-black text-white"} flex-col p-3`}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full px-4 pb-4">
          <div className={`flex items-center bg-white rounded-2xl w-full sm:w-[75%] px-2 py-1 border-2 ${theme?"border-gray-300": "border-white"}`}>
            <Search color={theme ? "gray" : "black"} />
            <input
              onChange={(e) => setsearchVal(e.target.value)}
              className="w-full bg-white text-gray-400 outline-none ml-2 text-sm"
              value={searchVal}
              type="search"
              placeholder="Search Photos and Wallpapers"
            />
          </div>
          <div className="w-full sm:w-auto">
            <button
              className="bg-blue-700 w-full hidden sm:block sm:w-auto px-3 py-1 rounded-xl hover:bg-blue-600"
              type="submit"
            >
              Search
            </button>
          </div>
      </form>

      <div className="flex gap-4">
        <div className='flex items-center gap-5'>
          <div onClick={buyPlus} 
          className={`${theme ? 'decoration-gray-400' : 'decoration-white'} cursor-pointer font-bold bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent text-md lg:text-lg`}
          >
          Freepixz+
          </div>
          <div 
          className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'} cursor-pointer select-none`}
          onClick={()=>resetToHome()}
          >
            Home
          </div>
        </div>

        <div>
          <Line/>
        </div>

        <div className="flex gap-9 justify-between items-center overflow-x-auto scrollbar-hide">
          <LowerButton content="Mobile"/>
          <LowerButton content="Desktop"/>
          <LowerButton content="Nature"/>
          <LowerButton content="Anime"/>
          <LowerButton content="Gaming"/>
          <LowerButton content="Super-Hero"/>
          <LowerButton content="Aesthetic"/>
          <LowerButton content="Flowers"/>
          <LowerButton content="Dark"/>
          <LowerButton content="Animals"/>
          <LowerButton content="Motivational"/>
          <LowerButton content="Sports"/>
        </div>
      </div>
  </div>
  )
}

export default Lowerbar