import React, { useState, useEffect } from 'react';
import './mypubliclists.css';
import ReviewList from './ReviewList';
 

export default function PublicLists() {
    const [lists, setLists] = useState([]);
    const [reviewingList, setReviewList] = useState(null); // State to track which list is being edited
    const [expandedListName, setExpandedListName] = useState(null);
    const [heroDetails, setHeroDetails] = useState({});

    const handleReviewClick = (list) => {
        setReviewList(list); // Set the current list to be edited
    };
    


    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('/api/secure/public-hero-lists', {
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
            console.error('Error fetching public hero lists:', error);
        }
    };

    const fetchHeroDetails = async (listName) => {
        try {
            const response = await fetch(`/api/open/public-hero-lists/${listName}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            //console.log(data);
            setHeroDetails(prevDetails => ({...prevDetails, [listName]: data.heroes}));
        } catch (error) {
            console.error('Error fetching hero details:', error);
        }
    };
    
    return (
        <div className="public-lists-container">
            {reviewingList && (
                        <ReviewList  
                            listName={reviewingList.name}
                            onListUpdated={() => {
                                setReviewList(null); // Hide component after update
                                fetchLists()// Refresh public lists 
                            }}
                        />
                    )}
            
            {lists.map(list => (
                <div key={list.id} className="public-list">
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
                    <p>Average Rating: {list.averageRating}</p>

                    <button onClick={() => setReviewList(list)}>Add Review</button>

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
                        </div>
                    )}

                </div>
            ))}
        </div>
    );
}
