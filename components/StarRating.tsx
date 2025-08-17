
import React from 'react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  onReviewClick?: () => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, reviewCount, onReviewClick }) => {
  const mainContent = (
    <>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < Math.round(rating) ? 'text-yellow-400' : 'text-slate-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-sm text-slate-500">
          ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
        </span>
      )}
    </>
  );

  return (
    <div className="flex items-center gap-2">
      {onReviewClick && reviewCount > 0 ? (
        <button onClick={onReviewClick} className="flex items-center gap-2 group">
          {mainContent}
          <span className="text-sm text-slate-500 group-hover:underline">Read reviews</span>
        </button>
      ) : (
         <div className="flex items-center gap-2">{mainContent}</div>
      )}
    </div>
  );
};

export default StarRating;