"use client";

import { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth-store';
import { formatDate } from '@/lib/utils';

interface Review {
  _id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
  helpfulCount: number;
  isVerified: boolean;
}

interface ReviewSectionProps {
  productId: string;
  productName: string;
  currentRating: number;
  reviewCount: number;
}

export default function ReviewSection({ 
  productId, 
  productName, 
  currentRating, 
  reviewCount 
}: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews?productId=${productId}&limit=10`);
      const data = await response.json();
      
      if (response.ok) {
        setReviews(data.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please login to submit a review');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a review comment');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const { token } = useAuthStore.getState();
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          productId,
          rating,
          title: title.trim() || undefined,
          comment: comment.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setReviews(prev => [data.data, ...prev]);
        setShowReviewForm(false);
        setRating(5);
        setTitle('');
        setComment('');
        // Refresh the page to update product rating
        window.location.reload();
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (error) {
      setError('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: string, helpful: boolean) => {
    if (!isAuthenticated) {
      setError('Please login to mark reviews as helpful');
      return;
    }

    try {
      const { token } = useAuthStore.getState();
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ helpful })
      });

      if (response.ok) {
        // Update the review in the list
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { ...review, helpfulCount: review.helpfulCount + (helpful ? 1 : -1) }
            : review
        ));
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => onRatingChange?.(star) : undefined}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
            }`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12">
      {/* Review Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Customer Reviews
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {renderStars(currentRating)}
              <span className="text-lg font-medium">{currentRating.toFixed(1)}</span>
            </div>
            <span className="text-gray-600">({reviewCount} reviews)</span>
          </div>
        </div>
        
        {isAuthenticated && (
          <Button onClick={() => setShowReviewForm(!showReviewForm)}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-4">Write a Review for {productName}</h3>
          
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating</label>
              {renderStars(rating, true, setRating)}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title (Optional)</label>
                             <Input
                 value={title}
                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                 placeholder="Brief summary of your experience"
                 maxLength={100}
               />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Review</label>
                             <Textarea
                 value={comment}
                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                 placeholder="Share your experience with this product..."
                 rows={4}
                 required
               />
            </div>

            {error && (
              <p className="text-red-600 text-sm mb-4">{error}</p>
            )}

            <div className="flex space-x-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {review.user.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium">
                      {review.user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">{review.user.name}</span>
                    {review.isVerified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  
                  {review.title && (
                    <h4 className="font-medium mb-2">{review.title}</h4>
                  )}
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {review.comment}
                  </p>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleHelpful(review._id, true)}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({review.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        )}
      </div>

      {/* Load More Reviews */}
      {reviews.length >= 10 && (
        <div className="text-center mt-6">
          <Button variant="outline">
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
} 