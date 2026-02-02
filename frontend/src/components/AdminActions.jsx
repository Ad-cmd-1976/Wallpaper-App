import { Edit3, Trash2 } from 'lucide-react';
import { useImageStore } from '../store/useImageStore';

const AdminActions = ({ image }) => {
    const { deleteImage, editImage }=useImageStore();
  return (
    <div className="flex items-center gap-2">
      {/* EDIT */}
      <button
        onClick={()=>editImage(image._id)}
        className="
          w-9 h-9 flex items-center justify-center
          bg-blue-500/20 hover:bg-blue-500/30
          border border-blue-400/40 text-blue-300
          rounded-full backdrop-blur-md shadow-lg
          transition-all duration-300 hover:scale-110 active:scale-95
        "
      >
        <Edit3 className="w-4 h-4" />
      </button>

      {/* DELETE */}
      <button
        onClick={()=>deleteImage(image._id)}
        className="
          w-9 h-9 flex items-center justify-center
          bg-red-500/20 hover:bg-red-500/30
          border border-red-400/40 text-red-300
          rounded-full backdrop-blur-md shadow-lg
          transition-all duration-300 hover:scale-110 active:scale-95
        "
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default AdminActions;
