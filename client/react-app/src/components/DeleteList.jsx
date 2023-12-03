import React, { useState } from 'react';
import './deletelist.css'; 


export default function DeleteList({ listName, onListUpdated }) {
    const [message, setMessage] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;

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

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`/api/secure/superhero-list/${encodeURIComponent(listName)}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setMessage('List updated successfully');
            if (onListUpdated) onListUpdated();//Must work on this to update the list
        } catch (error) {
            console.error('Error updating list:', error);
            setMessage('Error updating list');
        }
    };

    const handleCancel = () => {
        setMessage('');
        if (onListUpdated) {
            onListUpdated(false); //  'false' to indicate that no update was made
        }
    };
    

    return (
        <div className="delete-list-container">
            <h2>Delete List</h2>
            <form onSubmit={handleSubmit} className="delete-list-form">
                <h3>{listName}</h3>
                
                <button type="submit">Continue</button>
                <button onClick={handleCancel}>Cancel</button>
            </form>
            {message && <p className="delete-list-message">{message}</p>}
        </div>
    );
}
