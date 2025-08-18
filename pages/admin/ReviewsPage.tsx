import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import StarRating from '../../components/StarRating';
import { Product } from '../../types';

const ReviewsPage: React.FC = () => {
    const { reviews, products, acknowledgeReview, deleteReview } = useAppContext();

    // Create a map for quick product lookup
    const productMap = new Map<number, Product>(products.map(p => [p.id, p]));

    const handleDelete = (reviewId: number) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            deleteReview(reviewId);
        }
    };
    
    // Sort to show new reviews first, then by date
    const sortedReviews = React.useMemo(() => {
        return [...reviews].sort((a, b) => {
            if (a.acknowledged !== b.acknowledged) {
                return a.acknowledged ? 1 : -1;
            }
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [reviews]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Review Management ({reviews.length})</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Product</th>
                            <th scope="col" className="px-6 py-3">Author</th>
                            <th scope="col" className="px-6 py-3">Rating</th>
                            <th scope="col" className="px-6 py-3">Comment</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedReviews.map(review => {
                            const product = productMap.get(review.productId);
                            return (
                                <tr key={review.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-800 whitespace-nowrap">{product?.name || 'Unknown Product'}</td>
                                    <td className="px-6 py-4">{review.author}</td>
                                    <td className="px-6 py-4"><StarRating rating={review.rating} /></td>
                                    <td className="px-6 py-4 max-w-sm" title={review.comment}>
                                        <p className="truncate">{review.comment}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${review.acknowledged ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {review.acknowledged ? 'Acknowledged' : 'New'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        {!review.acknowledged && (
                                            <button onClick={() => acknowledgeReview(review.id)} className="font-medium text-blue-600 hover:underline">Acknowledge</button>
                                        )}
                                        <button onClick={() => handleDelete(review.id)} className="font-medium text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {reviews.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                    No reviews have been submitted yet.
                </div>
            )}
        </div>
    );
};

export default ReviewsPage;