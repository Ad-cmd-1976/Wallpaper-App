import { useEffect } from 'react';
import { useImageStore } from '../store/useImageStore.js';
import { useThemeStore } from '../store/useThemeStore.js';
import LoadingSpinner from './LoadingSpinner';
import { useAuthStore } from '../store/useAuthStore.js';
import { usePurchaseStore } from '../store/usePurchaseStore.js';
import ProgressiveImageCard from './ProgressiveImageCard.jsx';

const Landingpage = () => {
  const { imageList, getImages, isLoading, downloadImage, page } = useImageStore();
  const { purchaseIds, getPurchaseIds, buyImage } = usePurchaseStore();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();

  useEffect(() => {
    getImages(1);
    if (user) getPurchaseIds();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={`${theme ? "text-gray-400" : "bg-black text-white"} border-2 border-violet-700 min-h-full px-14 pt-10`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {imageList.map((image) => (
          <ProgressiveImageCard
            key={image._id}
            image={image}
            user={user}
            purchaseIds={purchaseIds}
            downloadImage={downloadImage}
            buyImage={buyImage}
          />
        ))}
      </div>

      <div id='footer' className='flex justify-center my-2'>
        <button
          className='bg-blue-700 p-2 rounded-lg hover:bg-blue-600'
          disabled={isLoading}
          onClick={() => getImages(page + 1)}
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default Landingpage;