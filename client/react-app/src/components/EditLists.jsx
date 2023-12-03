import React, { useState } from 'react';
import './editlists.css'; 


export default function EditLists({ listName, existingDescription, existingSuperheroIds, existingVisibility, onListUpdated }) {
    const [description, setDescription] = useState(existingDescription || '');
    const [superheroIds, setSuperheroIds] = useState(existingSuperheroIds || '');
    const [visibility, setVisibility] = useState(existingVisibility || 'false');
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

            // Convert superheroIds string to an array of integers
            const superheroIdsArray = superheroIds.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));

            const listData = {
                superheroIds: JSON.stringify(superheroIdsArray),
                description: sanitize(description),
                visibility,
            };
    
        try {
            const formattedListName = listName.trim().replace(/\s+/g, '');
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`/api/secure/superhero-list/${formattedListName}`, {
                method: 'PUT',
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
            setMessage('Error updating list');
        }
    };

    const handleCancel = () => {
        setMessage('');
        if (onListUpdated) {
            onListUpdated(false); // Pass 'false' to indicate that no update was made
        }
    };

    return (
        <div className="edit-list-container">
            <h2>Edit List</h2>
            <form onSubmit={handleSubmit} className="edit-list-form">
                <h3>{listName}</h3>
                <textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Superhero IDs (comma-separated)"
                    value={superheroIds}
                    onChange={(e) => setSuperheroIds(e.target.value)}
                    required
                />
                <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                    <option value="false">Private</option>
                    <option value="true">Public</option>
                </select>
                <button type="submit">Done</button>
                <button onClick={handleCancel}>Cancel</button>
            </form>
            {message && <p className="edit-list-message">{message}</p>}
        </div>
    );
}
