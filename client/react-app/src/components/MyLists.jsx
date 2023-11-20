import React, { useState, useEffect } from 'react';
import './mylists.css'; // Create and import your CSS file for styling

export default function MyLists() {
    const [lists, setLists] = useState([]);
    const [expandedListName, setExpandedListName] = useState(null);
    const [heroDetails, setHeroDetails] = useState({});

    
    

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch('http://localhost:5000/api/secure/my-hero-lists', {
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
        

        fetchLists();
    }, []);


    const fetchHeroDetails = async (listName) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`http://localhost:5000/api/secure/my-hero-lists/${listName}`, {
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
            {lists.map(list => (
                <div key={list.id} className="my-list">
                    <h3>{list.name}</h3>
                    <p>Created at: {list.lastModified}</p>
                    <p>Created by: {list.creatorNickname}</p>
                    <p>Number of Heroes: {list.numberOfHeroes}</p>
                    <p>Average Rating: {list.averageRating}</p>

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
