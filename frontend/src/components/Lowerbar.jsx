import { useState } from 'react'
import Line from '../assets/line';
import { Link } from 'react-router-dom';
import LowerButton from './LowerButton';
import { useThemeStore } from '../store/useThemeStore';
import { useImageStore } from '../store/useImageStore';

const Lowerbar = () => {
  const [scroll, setScroll] = useState(0);
  const { getImages }=useImageStore();
  const {theme}=useThemeStore();
  
  return (
    <div className={`${theme ? "text-gray-400" : "bg-black text-white"} flex p-3 gap-4 border-2 border-red-600 h-[5%]`}>
      <div className='flex items-center gap-5'>
        <Link to='/plus' 
        className={`${theme ? 'decoration-gray-400' : 'decoration-white'} font-bold bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent text-md lg:text-lg`}
        >
        Freepixz+
        </Link>
        <div 
        className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}
        onClick={()=>getImages(1)}
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
  )
}

export default Lowerbar