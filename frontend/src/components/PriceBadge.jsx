import { getPriceInfo } from '../lib/helper.js';

const PriceBadge = ({ image, isPurchased }) => {
  const { hasDiscount, discountedPrice, originalPrice } = getPriceInfo(image);

  if (isPurchased || (!hasDiscount && originalPrice <= 0)) return null;

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center gap-2">
      {hasDiscount && (
        <div className="bg-pink-600/90 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-md">
          FreePixz+ {image.discountPercentage}% off · ₹ {discountedPrice}
        </div>
      )}

      <div className="ml-auto bg-black/70 text-white text-xs sm:text-sm font-semibold px-3 py-1 rounded-full shadow-md">
        ₹ {originalPrice}
      </div>
    </div>
  );
};

export default PriceBadge;
