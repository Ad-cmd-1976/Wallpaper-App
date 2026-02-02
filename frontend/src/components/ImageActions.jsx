import { Download, ShoppingCart } from 'lucide-react';
import { usePurchaseStore } from '../store/usePurchaseStore.js';
import { useImageStore } from '../store/useImageStore.js';
import { useAuthStore } from '../store/useAuthStore.js';

const ImageActions = ({ image, isPurchased }) => {
    const { downloadImage }=useImageStore();
    const { buyImage }=usePurchaseStore();
    const { user }=useAuthStore();
  if ((user && image.isPremium && isPurchased) || !image.isPremium) {
    return (
      <button
        onClick={() => downloadImage(image.publicId)}
        className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 rounded-full text-white transition"
      >
        <Download className="w-6 h-6" />
      </button>
    );
  }

  return (
    <button
      onClick={() => buyImage(image._id)}
      className="
        bg-gradient-to-tr from-pink-500 to-purple-600
        hover:from-pink-400 hover:to-purple-500
        text-white font-medium px-6 py-3 rounded-full
        flex items-center gap-3 shadow-lg
        transition-all hover:scale-105 active:scale-95
      "
    >
      <ShoppingCart className="w-6 h-6" />
      Buy Now
    </button>
  );
};

export default ImageActions;
