import { useEffect } from 'react';
import { Download } from 'lucide-react';
import { useImageStore } from '../store/useImageStore.js';
import { useThemeStore } from '../store/useThemeStore.js';
import { toast } from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import { useAuthStore } from '../store/useAuthStore.js';
const Landingpage = () => {
  const {imageList, getImages, isLoading, downloadImage, page}=useImageStore();
  const{theme}=useThemeStore();
  const {user}=useAuthStore();
  
  useEffect(() => {
    getImages(1);
  }, [])

  if(isLoading) return (<LoadingSpinner/>)

  return (
    <>
    <div className={`${theme ? "text-gray-400" : "bg-black text-white"} border-2 border-violet-700 min-h-full px-14 pt-10`}>
      <div 
      className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'
      >
        {imageList.map((image)=>(
          <div key={image._id} 
          className='relative group overflow-hidden rounded-lg shadow-md'
          >
            <img src={image.imageUrl} className='w-full h-full object-cover cursor-pointer transition-all ease-in-out hover:scale-110'></img>
            <div
            className='absolute bottom-4 right-4 sm:bottom-5 sm:right-5 bg-black/60 backdrop-blur-md p-2 rounded-full cursor-pointer w-fit -translate-y-10 lg:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all ease-in-out duration-200'
            >
              <Download className='size-9' onClick={()=>downloadImage(image.publicId)}/>
            </div>
          </div>
        ))}
      </div>

      <div id='footer' className='flex justify-center my-2'>
        <button 
        className='bg-blue-700 p-2 rounded-lg hover:bg-blue-600'
        disabled={isLoading}
        onClick={()=>getImages(page+1)}
        >Load More
        </button>
      </div>
    </div>
    </>
  )
}

export default Landingpage