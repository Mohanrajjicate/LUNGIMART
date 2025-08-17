
import React, { useState, useEffect } from 'react';
import StarInput from './StarInput';

interface ReviewModalProps {
    productName: string;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ productName, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    // Prevent body scroll when overlay is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating > 0) {
            onSubmit(rating, comment);
        } else {
            alert('Please select a rating.');
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden p-6 sm:p-8 text-left"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800" 
                    aria-label="Close review modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold text-slate-900">Write a Review</h2>
                <p className="text-slate-600 mt-1">For: <span className="font-semibold">{productName}</span></p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Your Rating</label>
                        <StarInput rating={rating} setRating={setRating} />
                    </div>
                     <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-slate-700">Your Review</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            placeholder="Share your thoughts on the product..."
                            className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-slate-100 text-slate-800 font-bold py-2.5 px-6 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-slate-300"
                            disabled={rating === 0}
                        >
                            Submit Review
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;