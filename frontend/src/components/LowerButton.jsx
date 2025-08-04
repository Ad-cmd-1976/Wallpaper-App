import { useImageStore } from "../store/useImageStore.js";
import { useThemeStore } from "../store/useThemeStore.js";

const LowerButton = ({content}) => {
    const { theme }=useThemeStore();
    const { searchImages }=useImageStore();
  return (
    <span onClick={()=>searchImages(content)} className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'} min-w-fit`}>
        {content}
    </span>
  )
}

export default LowerButton