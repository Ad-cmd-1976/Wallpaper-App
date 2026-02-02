import { useEffect, useState } from 'react';
import { Download, ShoppingCart, Lock, Trash2 } from 'lucide-react';
import AdminActions from './AdminActions';

const ProgressiveImageCard = ({
  image,
  user,
  purchaseIds,
  downloadImage,
  onPreview
}) => {
  const [src, setSrc] = useState(image.previewUrl);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = image.previewUrl;
    img.onload = () => {
      setSrc(image.previewUrl);
      setIsLoaded(true);
      setIsLandscape(img.width >= img.height);
    };
  }, [image.previewUrl]);

  const aspectClass = isLandscape ? 'aspect-[16/9]' : 'aspect-[9/16]';
  const isPurchased = purchaseIds.includes(image._id);

  const hasDiscount = image.discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? Math.round(image.price - (image.price * image.discountPercentage) / 100)
    : null;

  return (
    <div
      className={`relative group overflow-hidden rounded-xl shadow-lg border border-gray-800 bg-black/10 backdrop-blur-sm ${aspectClass}`}
    >
      <img
        src={src}
        alt={image.title || 'Image'}
        onClick={onPreview}
        className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ring-1 ring-white/10 ${
          !isLoaded ? 'blur-lg' : 'blur-0'
        }`}
      />

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-3">
        {image.title && (
          <div className="text-white text-sm sm:text-base font-medium truncate max-w-[65%]">
            {image.title}
          </div>
        )}

        {((user && image.isPremium && isPurchased) || !image.isPremium) ? (
          <div className="flex items-center gap-2 sm:opacity-0 sm:translate-y-3 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300">
            {user && user.role === 'admin' && (
              <AdminActions image={image}/>
            )}

            <button
              onClick={() => downloadImage(image.publicId)}
              className="
                w-10 h-10 flex items-center justify-center
                bg-white/10 hover:bg-white/20
                border border-white/30 text-white
                rounded-full backdrop-blur-md shadow-lg
                transition-all duration-300 hover:scale-110 active:scale-95
              "
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:opacity-0 sm:translate-y-3 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300">
            {user && user.role === 'admin' && (
              <AdminActions image={image}/>
            )}

            <div
              className="
                w-10 h-10 flex items-center justify-center
                bg-white/10 border border-white/30
                rounded-full backdrop-blur-md shadow-lg
              "
            >
              <Lock className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressiveImageCard;