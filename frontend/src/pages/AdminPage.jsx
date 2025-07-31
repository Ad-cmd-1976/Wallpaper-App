import { useState } from 'react';
import { useImageStore } from '../store/useImageStore';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { FileText, Link, DollarSign, Loader } from 'lucide-react';

const AdminPage = () => {
    const { uploadImage, isLoading }=useImageStore();
    const { theme }=useThemeStore();
    const [imageData, setimageData] = useState({
      title: '',
      imageUrl: '',
      price: 0,
    });
  
    const handleUpload = async (e) => {
      e.preventDefault();
      uploadImage(imageData);
      setimageData({title:"",imageUrl:"",price:""});
    };

  return (
    <div 
    className={`flex justify-center border-2 border-yellow-300 gap-8 pt-7 sm:pt-11 min-h-screen min-w-full mx-auto ${theme?"bg-white text-gray-400":"bg-black text-white"} `}
    >
      <div className='border-2 border-red-500 flex gap-10 flex-col items-center w-full'>
        <div className='flex flex-col gap-4 justify-center items-center w-full'>
          <motion.p 
          initial={{opacity:0,y:-20}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.5,delay:0.25}}
          className='text-xl font-bold'
          >Admin Dashboard</motion.p>
          <motion.form 
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.5,delay:0.25}}
          onSubmit={handleUpload} 
          className="flex flex-col gap-4"
          >

            <div>
              <label htmlFor="image-title" className='pl-2 text-md'>Image Title</label>
              <div className='relative'>
                <FileText className='size-6 absolute top-1 left-2 pointer-events-none text-gray-400'/>
                <input 
                onChange={(e)=>setimageData({...imageData,title:e.target.value})}
                type="text" 
                name="title" 
                id="title" 
                value={imageData.title}
                className={`border-2 w-80 sm:w-96 p-1 pl-10 rounded-lg focus:outline-none focus:ring-gray-400 ${theme?"text-gray-400":"text-black"}`}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="imageUrl" className='pl-2 text-md'>Image Url</label>
              <div className='relative'>
                <Link className='size-6 absolute top-1 left-2 pointer-events-none text-gray-400'/>
                <input 
                onChange={(e)=>setimageData({...imageData,imageUrl:e.target.value})}
                type="text" 
                name="imageUrl" 
                id="imageUrl" 
                value={imageData.imageUrl}
                className={`border-2 w-80 sm:w-96 p-1 pl-10 rounded-lg focus:outline-none focus:ring-gray-400 ${theme?"text-gray-400":"text-black"}`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="price" className='pl-2 text-md'>Price</label>
              <div className='relative'>
                <DollarSign className='size-6 absolute top-1 left-2 pointer-events-none text-gray-400'/>
                <input 
                onChange={(e)=>setimageData({...imageData,price:e.target.value})}
                type="number" 
                name="price" 
                id="price" 
                value={imageData.price}
                className={`border-2 w-80 sm:w-96 p-1 pl-10 rounded-lg focus:outline-none focus:ring-gray-400 ${theme?"text-gray-400":"text-black"}`}
                />
              </div>
            </div>

          <div className='flex flex-col justify-center items-center mt-7'>
            <div>
              <button 
              type="submit"
              className='bg-blue-600 flex justify-center hover:bg-blue-500 hover:scale-105 transition-all ease-in-out rounded-lg w-80 sm:w-96 py-1'
              disabled={isLoading}
              >
                { isLoading ?
                  <>
                    <Loader className='size-6 animate-spin mr-2'/>
                    Loading...
                  </>
                  :
                  <span>Upload</span>
                }
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </div>
  </div>
  )
}

export default AdminPage