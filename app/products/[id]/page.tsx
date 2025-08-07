"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Heart, Star, ShoppingCart, Truck, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import ReviewSection from '@/components/reviews/review-section';
import { Product, ProductVariant } from '@/types';
import toast from 'react-hot-toast';

interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  brand?: string;
  tags: string[];
  variants?: Array<{
    name: string;
    value: string;
    price: number;
    stock: number;
  }>;
  store: {
    _id: string;
    name: string;
    slug: string;
    logo: string;
    rating: number;
    reviewCount: number;
  };
  category: {
    _id: string;
    name: string;
    slug: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      
      if (response.ok) {
        setProduct(data.data);
      } else {
        setError(data.error || 'Failed to load product');
      }
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // No automatic redirect - let user decide where to go
      toast.error('Please login to add items to cart');
      return;
    }

    if (!product) return;

    try {
      setAddingToCart(true);
      
      const productData: Product = {
        id: product._id,
        name: product.name,
        description: product.description,
        price: selectedVariant?.price || product.price,
        originalPrice: product.originalPrice,
        images: product.images,
        category: product.category.name,
        subcategory: product.category.name,
        brand: product.brand,
        tags: product.tags,
        variants: (product.variants || []).map((variant, index) => ({
          id: `${product._id}-variant-${index}`,
          name: variant.name,
          value: variant.value,
          price: variant.price,
          stock: variant.stock
        })),
        stock: product.stock,
        storeId: product.store._id,
        storeName: product.store.name,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      addItem(productData, quantity, selectedVariant || undefined);
      
      // Show success message
      toast.success('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleVariantSelect = (variant: NonNullable<ApiProduct['variants']>[0]) => {
    const productVariant: ProductVariant = {
      id: `${product?._id}-variant-${variant.value}`,
      name: variant.name,
      value: variant.value,
      price: variant.price,
      stock: variant.stock
    };
    setSelectedVariant(productVariant);
    setQuantity(1); // Reset quantity when variant changes
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 rounded"></div>
              <div className="bg-gray-200 h-6 rounded w-1/2"></div>
              <div className="bg-gray-200 h-4 rounded"></div>
              <div className="bg-gray-200 h-4 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice ? ((product.originalPrice - product.price) / product.originalPrice) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-brand-600">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/categories" className="hover:text-brand-600">Categories</Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/categories/${product.category.slug}`} className="hover:text-brand-600">
              {product.category.name}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-brand-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Store Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={product.store.logo}
              alt={product.store.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-gray-900">{product.store.name}</h3>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{product.store.rating.toFixed(1)}</span>
                <span>({product.store.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Product Title */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.brand && (
              <p className="text-gray-600 mb-2">Brand: {product.brand}</p>
            )}
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                    {discount.toFixed(0)}% OFF
                  </span>
                </>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className={`text-sm ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Select Options:</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => handleVariantSelect(variant)}
                    className={`p-3 border rounded-lg text-left ${
                      selectedVariant?.value === variant.value
                        ? 'border-brand-600 bg-brand-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{variant.value}</div>
                    <div className="text-sm text-gray-600">
                      {formatPrice(variant.price)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {variant.stock} in stock
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Quantity:</h3>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= (selectedVariant?.stock || product.stock)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              className="flex-1"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
            
            <Button variant="outline" size="lg">
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-sm text-gray-600">Free Delivery</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-sm text-gray-600">Secure Payment</p>
            </div>
            <div className="text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-sm text-gray-600">Quality Assured</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h2>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="mt-8">
          <h3 className="font-medium text-gray-900 mb-3">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <ReviewSection
        productId={product._id}
        productName={product.name}
        currentRating={product.rating}
        reviewCount={product.reviewCount}
      />
    </div>
  );
}