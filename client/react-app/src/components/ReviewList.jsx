import React, { useState } from 'react';
import './reviewlist.css'; // Create and import your CSS file for styling


export default function ReviewList({ listName, onListUpdated }) {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState('');
    const [message, setMessage] = useState('');

    function sanitize(string) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            "/": '&#x2F;',
        };
        const reg = /[&<>"'/]/ig;
        return string.replace(reg, (match)=>(map[match]));
      }

    const handleSubmit = async (e) => {
        e.preventDefault();

            const listData = {
                listName,
                rating, 
                comment: sanitize(comment),
            };
            
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`http://localhost:5000/api/secure/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify(listData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setMessage('List updated successfully');
            if (onListUpdated) onListUpdated();//Must work on this to update the list
        } catch (error) {
            console.error('Error updating list:', error);
            setMessage('Rating must be between 1 and 5.');
        }
    };


    return (
        <div className="review-list-container">
            <h2>Review List</h2>
            <form onSubmit={handleSubmit} className="review-list-form">
                <h3>{listName}</h3>
                <textarea
                    placeholder="Comments (optional)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Rating (1-5)"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                />
                <button type="submit">Done</button>
            </form>
            {message && <p className="rating-list-message">{message}</p>}
        </div>
    );
}
