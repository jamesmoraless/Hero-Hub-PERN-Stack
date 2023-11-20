import React, { useState } from 'react';
import './createlist.css'; 

export default function CreateList(props) {
    const [listName, setListName] = useState('');
    const [description, setDescription] = useState('');
    const [superheroIds, setSuperheroIds] = useState(''); // Assuming a comma-separated list of IDs
    const [visibility, setVisibility] = useState('false');
    const [message, setMessage] = useState('');

    const clearResults = () => {
        setListName('');
        setDescription('');
        setSuperheroIds('');
        setMessage('');
    }; 

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
            listName: sanitize(listName),
            superheroIds: JSON.stringify(superheroIdsArray),
            description: sanitize(description),
            visibility,
        };

        try {
            const token = localStorage.getItem('jwtToken'); // retrieve token from local storage
            const response = await fetch('http://localhost:5000/api/secure/superhero-list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token // Include the JWT token
                },
                body: JSON.stringify(listData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            props.refreshLists(); //refresh the list
            
            setMessage('List created successfully');
            

            alert('List created successfully');//might wan to clear form fields once the list is created 
            clearResults();
        } catch (error) {
            console.error('Error creating list:', error);
            alert('Error creating list');
        }
    };

    return (
        <div className="create-list-container">
            <h2>Create New Hero List</h2>
            <form onSubmit={handleSubmit} className="create-list-form">
                <input
                    type="text"
                    placeholder="List Name"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    required
                />
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
                <button type="submit">Create List</button>
            </form>
            {message && <p className="create-list-message">{message}</p>}
        </div>
    );
}
