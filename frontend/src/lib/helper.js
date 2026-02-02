export const getPriceInfo = (image) => {
  const hasDiscount=image.discountPercentage > 0;

  const discountedPrice=hasDiscount ? Math.round(image.price - (image.price * image.discountPercentage) / 100) : null;

  return {
    hasDiscount,
    discountedPrice,
    originalPrice: image.price,
  };
};
