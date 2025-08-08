import { useState } from 'react'
import Line from '../assets/line';
import { Link } from 'react-router-dom';
import LowerButton from './LowerButton';
import { Search } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useImageStore } from '../store/useImageStore';

const Lowerbar = () => {
  const [scroll, setScroll] = useState(0);
  const { resetToHome, searchImages, searchVal, setsearchVal }=useImageStore();
  const {theme}=useThemeStore();

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
    <div className={`${theme ? "text-gray-400" : "bg-black text-white"} flex-col p-3 border-2 border-red-600 h-[5%]`}>
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
          <Link to='/plus' 
          className={`${theme ? 'decoration-gray-400' : 'decoration-white'} font-bold bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent text-md lg:text-lg`}
          >
          Freepixz+
          </Link>
          <div 
          className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}
          onClick={()=>resetToHome()}
          >
            Home
          </div>
        </div>

        <div>
          <Line/>
        </div>

        <div className="flex gap-9 justify-between items-center overflow-x-auto scrollbar-hide">
          <LowerButton content="Anime"/>
          <LowerButton content="Nature"/>
          <LowerButton content="3D Renders"/>
          <LowerButton content="Film"/>
          <LowerButton content="Experimental"/>
          <LowerButton content="Travel"/>
          <LowerButton content="Fashion"/>
          <LowerButton content="Beauty"/>
          <LowerButton content="Archival"/>
          <LowerButton content="Animals"/>
          <LowerButton content="Spirituality"/>
          <LowerButton content="Sports"/>
          <LowerButton content="Sports"/>
          <LowerButton content="AI Generated"/>
        </div>
      </div>
  </div>
  )
}

export default Lowerbar