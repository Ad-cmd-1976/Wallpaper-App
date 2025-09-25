import { useEffect, useRef } from 'react';
import { useImageStore } from '../store/useImageStore.js';
import { useThemeStore } from '../store/useThemeStore.js';
import LoadingSpinner from './LoadingSpinner';
import { useAuthStore } from '../store/useAuthStore.js';
import { usePurchaseStore } from '../store/usePurchaseStore.js';
import ProgressiveImageCard from './ProgressiveImageCard.jsx';
import ComingSoon from './ComingSoon.jsx';

const Landingpage = () => {
  const { imageList, getImages, isLoading, downloadImage, page, hasMore } = useImageStore();
  const { purchaseIds, getPurchaseIds, buyImage } = usePurchaseStore();
  const { theme } = useThemeStore();
  const { user } = useAuthStore();

  const loaderRef=useRef(null);

  useEffect(() => {
    getImages(1);
    if (user) getPurchaseIds();
  }, []);

  useEffect(()=>{
     const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isLoading && hasMore) {
          getImages(page + 1);
        }
      },
      { threshold: 1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [page, getImages, isLoading, hasMore]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={`${theme ? "text-gray-400" : "bg-black text-white"} min-h-full px-14 pt-5`}>
      {imageList.length>0 && (
        <>
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

      <div ref={loaderRef} className='flex justify-center my-2'>
        { isLoading && <LoadingSpinner/>}
      </div>
      </>
      )}
      { imageList.length===0 && ( <ComingSoon/> )}
    </div>
  );
};

export default Landingpage;