import { useImageStore } from "../store/useImageStore.js";
import { useThemeStore } from "../store/useThemeStore.js";

const LowerButton = ({content}) => {
    const { theme }=useThemeStore();
    const { searchImages, setsearchVal }=useImageStore();

    const handleClick=()=>{
      setsearchVal("");
      searchImages(content, 1);
    };

  return (
    <span onClick={handleClick} className={`hover:underline-offset-8 hover:underline ${theme ? 'decoration-gray-400' : 'decoration-white'} min-w-fit cursor-pointer select-none`}>
        {content}
    </span>
  )
}

export default LowerButton