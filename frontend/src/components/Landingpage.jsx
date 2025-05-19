import React from 'react'
import { useState, useEffect } from 'react'
import { getImages } from '../lib/util';
import { useImageStore } from '../store/useImageStore';
import { useThemeStore } from '../store/useThemeStore';
const Landingpage = (props) => {
  const {imageList,setimageList,nextCursor,setnextCursor}=useImageStore();
  const{theme}=useThemeStore();
  
  useEffect(() => {
    const fetchData=async ()=>{
      const response=await getImages();
      setimageList(response.resources);
      setnextCursor(response.next_cursor);
    }
    fetchData();
  }, [])
  const handleloadbutton=async ()=>{
    console.log(nextCursor);
    const response=await getImages(nextCursor);
    setimageList([...imageList,...response.resources]);
    setnextCursor(response.next_cursor);
  }
  return (
    <>
    <div className={`${theme ? "text-gray-400" : "bg-black text-white"} border-2 border-violet-700 h-fit px-14 pt-10`}>
      <div className='grid grid-cols-auto gap-2'>
      {imageList.map((image)=>(
        <img key={image.public_id} src={image.url} className='w-full h-full object-cover'></img>
      ))}
      </div>
    <div id='footer' className='flex justify-center my-2'>
      {nextCursor && <button onClick={handleloadbutton} className='bg-blue-700 p-2 rounded-lg hover:bg-blue-600'>Load More</button>}
    </div>
    </div>
    </>
  )
}

export default Landingpage