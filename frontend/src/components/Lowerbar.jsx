import React, { useState } from 'react'
import Line from '../assets/line'
import { searchImages } from '../lib/util';
import { useThemeStore } from '../store/useThemeStore';
import { useImageStore } from '../store/useImageStore';

const Lowerbar = (props) => {
  const [scroll, setScroll] = useState(0);
  const {theme}=useThemeStore();
  const {imageList,setimageList,nextCursor,setnextCursor}=useImageStore();

  const reqImages=async (expression)=>{
    const response=await searchImages(expression,nextCursor);
    setimageList(response.resources);
    setnextCursor(response.next_cursor);
  }
  return (
    <div className={`${theme ? "text-gray-400" : "bg-black text-white"} flex p-3 gap-4 border-2 border-red-600`}>
      <div className='flex gap-5'>
        <div><a href="#" className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}>Photos</a></div>
        <div><a href="#" className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}>IIIlustrations</a></div>
        <div><a href="#" className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}>Freepixz+</a></div>
      </div>

      <div>
        <Line/>
      </div>

      <div className="flex gap-9 justify-between overflow-x-auto scrollbar-hide">
        <button onClick={()=>reqImages('Anime')} className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}>Anime</button>
        <button  className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}>Nature</button>
        <button  className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'} min-w-fit`}>3D Renders</button>
        <button  className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}>Film</button>
        <button  className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}>Experimental</button>
        <button  className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}>Travel</button>
        <button  className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}>Fashion</button>
        <button  className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}>Beauty</button>
        <button  className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}>Archival</button>
        <button  className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}>Animals</button>
        <button  className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}>Spirituality</button>
        <button  className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'}`}>Sports</button>
        <button  className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'} min-w-fit`}>AI Generated</button>
      </div>
    </div>
  )
}

export default Lowerbar