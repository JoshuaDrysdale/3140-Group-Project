import { useEffect, useState } from "react";
import "./ProductCard.css";

export default function ReviewSection({ product, canReview = true }) {
    const [reviews, setReviews] = useState([]);
    const [userName, setUserName] = useState("");
    const [rating, setRating] = useState("5");
    const [comment, setComment] = useState(""); 

    async function loadReviews() {
        const res = await fetch(`/api/reviews/${product.id}`);
        const data = await res.json();
        setReviews(data);
    }

    useEffect(() => {
        loadReviews();
    }, [product.id]);

    async function handleSubmit(e) {
        e.preventDefault();

        await fetch("/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                product_id: String(product.id),
                product_name: product.name,
                user_name: userName,
                rating: Number(rating),
                comment
            })
        });

        setUserName("");
        setRating("5");
        setComment("");
        loadReviews();
    }

    const average =
        reviews.length > 0 
        ? (reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length).toFixed(1)
        : null;

    return (
        <div className="review-section">
            <h3>Reviews</h3>

            <p className="review-average">
                {average ? `${average} ★ average (${reviews.length})` : "No reviews yet"}
            </p>

            {canReview ? (
                <form onSubmit={handleSubmit} className="review-form">
                    <input
                        type="text"
                        placeholder="Your name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />

                    <select value={rating} onChange={(e) => setRating(e.target.value)}>
                        <option value="5">5 Stars</option>
                         <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                         <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                 </select>

                    <textarea
                        placeholder="Write a review..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                 />

                    <button type="submit">Post Review</button>
                </form>
                ) : (
                    <p className="review-locked">
                     Purchase this item to leave a review!
                    </p>
             )}

            <div className="review-list">
                {reviews.map((review) => (
                    <div key={review.id} className="review-item">
                        <strong>{review.user_name}</strong>
                        <span>{review.rating} ★</span>
                        <p>{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}