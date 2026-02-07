import { useState, useEffect } from 'react';
import PriceBadge from './PriceBadge';
import ImageActions from './ImageActions';
import { useImageStore } from '../store/useImageStore';
import { usePurchaseStore } from '../store/usePurchaseStore';
import { useAuthStore } from '../store/useAuthStore';
import { X } from "lucide-react";

const PreviewOverlay = ({ image, onClose }) => {
  const { downloadImage } = useImageStore();
  const { purchaseIds, buyImage } = usePurchaseStore();
  const { user } = useAuthStore();
  const [show, setShow] = useState(false);
  const isPurchased = purchaseIds.includes(image._id);

  useEffect(() => {
    setShow(true);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  if (!image) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      className="fixed inset-0 z-[9000] bg-black/80 backdrop-blur-sm flex items-center justify-center"
    >
      <button
        onClick={handleClose}
        className="absolute top-4 sm:top-5 right-4 sm:right-5
          w-10 h-10 flex items-center justify-center
          rounded-full bg-white/10 hover:bg-white/20
          text-white transition"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className={`
          relative max-w-[95vw] sm:max-w-[90vw]
          max-h-[90vh]
          px-3 sm:px-4
          py-5 sm:py-6
          flex flex-col items-center
          gap-2 sm:gap-3
          transition-all duration-300
          ${show ? "scale-100 opacity-100" : "scale-90 opacity-0"}
        `}
      >

        <div className="w-full max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] flex justify-between items-center px-1">
          <PriceBadge image={image} isPurchased={isPurchased} />
        </div>

        <div className='flex justify-center'>
          <img
            src={image.imageUrl || image.previewUrl}
            alt={image.title || "Preview"}
            className="
              max-w-full
              max-h-[55vh] sm:max-h-[65vh] lg:max-h-[70vh]
              w-auto h-auto
              object-contain
              rounded-2xl
              shadow-2xl
              ring-1 ring-white/10
            "
          />
        </div>

        <div className="flex justify-center pt-1">
          <ImageActions
            image={image}
            user={user}
            isPurchased={isPurchased}
            buyImage={buyImage}
            downloadImage={downloadImage}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewOverlay;
