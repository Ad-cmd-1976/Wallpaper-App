import { useThemeStore } from "../store/useThemeStore.js";
import { useImageStore } from "../store/useImageStore.js";

const reqImages=async (expression)=>{
        const { searchImages, setimageList, setnextCursor }=useImageStore();
        try{
            const response=await searchImages(expression);
            setimageList(response.resources);
            setnextCursor(response.next_cursor);
        }
        catch(error){
            toast.error(error.response?.data?.message || "Failed to fetch images");
        }
    }

const LowerButton = ({content}) => {
    const { theme }=useThemeStore();
  return (
    <span onClick={()=>reqImages({content})} className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'} min-w-fit`}>
        {content}
    </span>
  )
}

export default LowerButton