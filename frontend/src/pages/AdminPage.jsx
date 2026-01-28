import { useState } from 'react';
import { useImageStore } from '../store/useImageStore';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/useThemeStore';
import { FileText, DollarSign, Loader, Percent } from 'lucide-react';

const AdminPage = () => {
    const { uploadImage, isLoading }=useImageStore();
    const { theme }=useThemeStore();
    const [selectedFile, setselectedFile]=useState(null);
    const [imageData, setimageData] = useState({
      title: '',
      imageUrl: '',
      previewUrl:'',
      price: 0,
      publicId:'',
      tags: '',
      discountPercentage: 0,
      isPremium: false,
    });
  
    const handleUpload = async (e) => {
      e.preventDefault();
      const success=await uploadImage(selectedFile,imageData);
      if(success){
        setimageData({ title:'', price:0, tags:'', discountPercentage:0, isPremium:false, imageUrl:'', publicId:'', previewUrl:'' });
        setselectedFile(null);
      }
    };

  return (
    <div 
      className={`flex justify-center gap-8 pt-7 sm:pt-11 min-h-screen min-w-full mx-auto ${theme?"bg-white text-gray-400":"bg-black text-white"} `}
    >
  <div className='flex gap-10 flex-col items-center w-full'>
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
      className="flex flex-col gap-5 items-center"
      >

        <div className='w-80 sm:w-96'>
          <label htmlFor="image-title" className='pl-2 text-md'>Image Title</label>
          <div className='relative'>
            <FileText className='size-6 absolute top-1 left-2 pointer-events-none text-gray-400'/>
            <input 
            onChange={(e)=>setimageData({...imageData,title:e.target.value})}
            type="text" 
            name="title" 
            id="title" 
            value={imageData.title}
            className={`border-2 w-full p-1 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme?"text-gray-400":"text-black"}`}
            />
          </div>
        </div>

        <div className='w-80 sm:w-96'>
          <label htmlFor="tags" className='pl-2 text-md'>Tags (comma separated)</label>
          <div className='relative'>
            <FileText className='size-6 absolute top-1 left-2 pointer-events-none text-gray-400' />
            <input
              onChange={(e) => setimageData({ ...imageData, tags: e.target.value })}
              type="text"
              name="tags"
              id="tags"
              value={imageData.tags}
              placeholder="Nature, Dark, Abstract"
              className={`border-2 w-full p-1 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme ? "text-gray-400" : "text-black"}`}
            />
          </div>
        </div>

        <div className='w-80 sm:w-96'>
          <label htmlFor="price" className='pl-2 text-md'>Price</label>
          <div className='relative'>
            <DollarSign className='size-6 absolute top-1 left-2 pointer-events-none text-gray-400'/>
            <input 
            onChange={(e)=>setimageData({...imageData,price:e.target.value})}
            type="number" 
            name="price" 
            id="price" 
            value={imageData.price}
            className={`border-2 w-full p-1 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme?"text-gray-400":"text-black"}`}
            />
          </div>
        </div>

        <div className="w-80 sm:w-96 flex items-center gap-2">
          <input
            type="checkbox"
            name="isPremium"
            id="isPremium"
            checked={imageData.isPremium}
            onChange={(e) => setimageData({ ...imageData, isPremium: e.target.checked })}
          />
          <label htmlFor="isPremium" className='text-md'>Is Premium?</label>
        </div>

        <div className='w-80 sm:w-96'>
          <label htmlFor="discountPercentage" className='pl-2 text-md'>Discount % (for Plus users)</label>
          <div className='relative'>
            <Percent className='size-6 absolute top-1 left-2 pointer-events-none text-gray-400' />
            <input
              onChange={(e) => setimageData({ ...imageData, discountPercentage: e.target.value })}
              type="number"
              name="discountPercentage"
              id="discountPercentage"
              value={imageData.discountPercentage}
              className={`border-2 w-full p-1 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme ? "text-gray-400" : "text-black"}`}
            />
          </div>
        </div>

        <div className="w-80 sm:w-96">
          <label htmlFor="file" className="pl-2 text-md">Upload File</label>
          <div className="relative flex items-center justify-center border-2 border-dashed rounded-lg p-3 transition-all hover:border-blue-500 hover:shadow-md">
            <input
              type="file"
              accept="image/*"
              onChange={(e)=> setselectedFile(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className={`text-sm z-10 pointer-events-none ${theme ? "text-gray-700" : "text-white"}`}>
              {
                selectedFile 
                ? `Selected: ${selectedFile.name}` 
                : "Click or drag an image to upload"
              }
            </span>
          </div>
        </div>


        <div className='flex flex-col justify-center items-center mt-6 w-80 sm:w-96'>
          <button 
          type="submit"
          onSubmit={handleUpload}
          className='bg-blue-600 text-white font-semibold hover:bg-blue-500 hover:scale-105 transition-all ease-in-out rounded-lg w-full py-2 flex justify-center items-center'
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
      </motion.form>
    </div>
  </div>
</div>

  )
}

export default AdminPage