import { useEffect, useState } from 'react';
import { Download, ShoppingCart, Lock } from 'lucide-react';

const ProgressiveImageCard = ({ image, user, purchaseIds, downloadImage, buyImage }) => {
  const [src, setSrc] = useState(image.previewUrl);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = image.imageUrl;
    img.onload = () => {
      setSrc(image.imageUrl);
      setIsLoaded(true);
      setIsLandscape(img.width >= img.height);
    };
  }, [image.imageUrl]);

  // Dynamic card size classes
  const aspectClass = isLandscape
    ? "aspect-[16/9]" // Landscape
    : "aspect-[9/16]"; // Portrait

  return (
    <div
      className={`relative group overflow-hidden rounded-xl shadow-lg border border-gray-800 bg-black/10 backdrop-blur-sm ${aspectClass}`}
    >
      {/* Image */}
      <img
        src={src}
        alt={image.title || "Image"}
        className={`w-full h-full object-cover cursor-pointer transition-transform duration-500 ease-out group-hover:scale-105 ${
          !isLoaded ? 'blur-lg' : 'blur-0'
        }`}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />

      {/* Title */}
      {image.title && (
        <div className="absolute bottom-3 left-3 text-white text-sm sm:text-base font-medium drop-shadow-lg">
          {image.title}
        </div>
      )}

      {/* Download Button */}
      {((user && image.isPremium && purchaseIds.includes(image._id)) || !image.isPremium) ? (
        <button
          onClick={() => downloadImage(image.publicId)}
          className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 bg-white/10 hover:bg-white/20 border border-white/30 text-white
          p-3 rounded-full cursor-pointer shadow-lg backdrop-blur-md 
          sm:translate-y-8 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100
          transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <Download className="w-6 h-6" />
        </button>
      ) : (
        <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 flex flex-col items-end gap-2">
          {/* Locked Icon */}
          <div className="bg-white/10 border border-white/30 backdrop-blur-md p-3 rounded-full cursor-not-allowed shadow-lg">
            <Lock className="w-6 h-6 text-white" />
          </div>

          {/* Buy Button */}
          <button
            onClick={() => buyImage(image._id)}
            className="bg-gradient-to-tr from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 shadow-lg hover:shadow-xl text-white font-medium
            px-4 py-2 rounded-full cursor-pointer flex items-center gap-2
            sm:translate-y-4 sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:translate-y-0
            transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Buy</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProgressiveImageCard;
