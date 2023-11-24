import React, { useState, useEffect } from 'react';
import './reviewstable.css'; // Assuming you have a CSS file for styling

export default function ReviewsTable() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReviews() {
            setLoading(true);
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch('http://localhost:5000/api/admin/reviews', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchReviews();
    }, []);

    const toggleReviewVisibility = async (id, isCurrentlyHidden) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`http://localhost:5000/api/admin/reviews/${id}/hidden`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ hidden: !isCurrentlyHidden }) // Toggle the hidden status
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // Update the state to reflect the change
            setReviews(reviews.map(review => 
                review.id === id ? { ...review, hidden: !isCurrentlyHidden } : review
            ));
        } catch (error) {
            console.error('Error toggling review visibility:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="reviews-table-container">
            <table>
                <thead>
                    <tr>
                        <th>Review ID</th>
                        <th>Nickname</th>
                        <th>List Name</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review, index) => (
                        <tr key={index}>
                            <td>{review.id}</td>
                            <td>{review.nickname}</td>
                            <td>{review.name}</td>
                            <td>{review.rating}</td>
                            <td>{review.comment}</td>
                            <td>{new Date(review.created_at).toLocaleDateString()}</td>
                            <td>
                                <button onClick={() => toggleReviewVisibility(review.id, review.hidden)}>
                                    {review.hidden ? 'Unhide' : 'Hide'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
