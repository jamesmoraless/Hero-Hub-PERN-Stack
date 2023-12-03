import React, { useState, useEffect } from 'react';
import './mylists.css'; // Create and import your CSS file for styling
import EditLists from './EditLists';
import DeleteList from './DeleteList';
import CommentsList from './CommentsList';

export default function MyLists() {
    const [editingList, setEditingList] = useState(null); // State to track which list is being edited
    const [deletingList, setDeleteList] = useState(null); // State to track which list is being edited
    const [lists, setLists] = useState([]);
    const [expandedListName, setExpandedListName] = useState(null);
    const [heroDetails, setHeroDetails] = useState({});

    const handleEditClick = (list) => {
        setEditingList(list); // Set the current list to be edited
    };

    const handleDeleteClick = (list) => {
        setDeleteList(list); // Set the current list to be edited
    };

    

    useEffect(() => {        
        fetchLists();
    }, []);

    const fetchLists = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('/api/secure/my-hero-lists', {
                headers: {
                    'x-auth-token': token // Include the JWT token
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setLists(data.lists);
        } catch (error) {
            console.error('Error fetching my hero lists:', error);
        }
    };
    


    const fetchHeroDetails = async (listName) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`/api/secure/my-hero-lists/${listName}`, {
                headers: {
                    'x-auth-token': token // Include the JWT token
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setHeroDetails(prevDetails => ({...prevDetails, [listName]: data.heroes}));
        } catch (error) {
            console.error('Error fetching hero details:', error);
        }
    };

    return (
        <div className="my-lists-container">

            {editingList && (
                <EditLists 
                    listName={editingList.name}
                    existingDescription={editingList.description}
                    existingSuperheroIds={editingList.superheroIds}
                    existingVisibility={editingList.visibility}
                    onListUpdated={() => {
                        setEditingList(null); // Hide component after update
                        fetchLists()// Refresh lists 
                    }}
                />
            )}

            {deletingList && (
                <DeleteList 
                    listName={deletingList.name}
                    onListUpdated={() => {
                        setDeleteList(null); // Hide component after update
                        fetchLists()// Refresh lists 
                    }}
                />
            )}

            {lists.map(list => (
                <div key={list.id} className="my-list">
                    <h3>{list.name}</h3>
                    <p>Last Edit: {new Date(list.lastModified).toLocaleDateString("en-US", { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })}</p>
                    <p>Created by: {list.creatorNickname}</p>
                    <p>Number of Heroes: {list.numberOfHeroes}</p>
                    <p>Average Rating: {list.averageRating != null ? list.averageRating : 'None'}</p>
                    <p>Visibility: {list.visibility ? 'Public' : 'Private'}</p>

                    <button href="#edit-list-container" onClick={() => handleEditClick(list)}>Edit List</button>
                    
                    <button href="#delete-list-container" onClick={() => handleDeleteClick(list)}>Delete</button>

                    <button onClick={() => fetchHeroDetails(list.name) && setExpandedListName(list.name === expandedListName ? null : list.name)}>
                        {expandedListName === list.name ? 'Hide Details' : 'Show Details'}
                    </button>

                    {expandedListName === list.name && (
                        <div className="expanded-list-details">
                            <p>Description: {list.description}</p>
                            {heroDetails[list.name] && heroDetails[list.name].map(hero => (
                                <div key={hero.id} className="hero-detail">
                                    <h4>{hero.name}</h4>
                                    <p>Gender: {hero.Gender}</p>
                                    <p>Eye Color: {hero['Eye color']}</p>
                                    <p>Race: {hero.Race}</p>
                                    <p>Hair Color: {hero['Hair color']}</p>
                                    <p>Height: {hero.Height} cm</p>
                                    <p>Publisher: {hero.Publisher}</p>
                                    <p>Skin Color: {hero['Skin color']}</p>
                                    <p>Alignment: {hero.Alignment}</p>
                                    <p>Weight: {hero.Weight} kg</p>
                                    <p>Powers: {hero.powers.join(', ')}</p>
                                </div>
                            ))}
                            <CommentsList listName={list.name} />
                        </div>
                        
                    )}

                </div>
            ))}
        </div>
    );
}


//Currently, I'm not showing the comments from reivews but I'm showing everything else 
//So maybe, I'll add comments below every list by fetching comments, rating nickname
//I'll make this a sepereate component where I can render comments under each MyList, MyPublicList, PublicList
