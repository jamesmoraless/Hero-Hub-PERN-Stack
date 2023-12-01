import React, { useState, useEffect } from 'react';
import './commentslist.css';

export default function ReviewsTable({ listName }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const apiUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch(`/api/secure/reviews/${listName}`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [listName]); // Depend on listName to re-fetch when it changes

    if (loading) {
        return <div>Loading reviews...</div>;
    }

    return (
        <div className="comments-table-container">
            <h3>Reviews for {listName}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nickname</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review, index) => (
                        <tr key={index}>
                            <td>{review.nickname}</td>
                            <td>{review.rating}</td>
                            <td>{review.comment}</td>
                            <td>{new Date(review.created_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
