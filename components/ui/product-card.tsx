"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';
import { useWishlistStore } from '@/stores/wishlist-store';
import { Product } from '@/types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  showStore?: boolean;
}

export default function ProductCard({ product, showStore = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist!');
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        storeId: product.storeId,
        storeName: product.storeName
      });
      toast.success('Added to wishlist!');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const renderRating = () => {
    const stars = [];
    const rating = product.rating || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      );
    }
    
    return (
      <div className="flex items-center space-x-1">
        {stars}
        <span className="text-sm text-gray-600 dark:text-gray-400">
          ({product.reviewCount || 0})
        </span>
      </div>
    );
  };

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 ${
          isWishlisted
            ? 'bg-red-500 text-white'
            : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 hover:bg-red-500 hover:text-white'
        }`}
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Quick View Button */}
      <Link
        href={`/products/${product.id}`}
        className={`absolute top-3 left-3 z-10 p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-600 hover:bg-orange-500 hover:text-white transition-all duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Eye className="w-4 h-4" />
      </Link>

      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3] sm:aspect-[4/3] overflow-hidden">
          <img
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </div>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-2 sm:p-3 md:p-4">
        {showStore && (
          <p className="text-sm text-orange-600 hover:text-orange-700 font-medium mb-1">
            {product.storeName}
          </p>
        )}
        
        <div className="mb-2">
          {renderRating()}
        </div>

        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 hover:text-orange-600 transition-colors text-xs sm:text-sm md:text-base">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full"
          variant={product.stock === 0 ? "outline" : "brand"}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
} 