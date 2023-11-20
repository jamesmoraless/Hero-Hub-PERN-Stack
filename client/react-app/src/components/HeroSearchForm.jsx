import React, { useState } from 'react';
import "./herosearchform.css";
//import axios from 'axios';

export default function HeroSearchForm() {
    const [searchResults, setSearchResults] = useState([]);
    const [expandedHeroId, setExpandedHeroId] = useState(null);
    const [searchTerms, setSearchTerms] = useState({
        name: '',
        race: '',
        power: '',
        publisher: '',
        resultsLimit: '10'
    });

    const handleInputChange = (event) => {
        setSearchTerms({ ...searchTerms, [event.target.name]: event.target.value });
    };

    const clearResults = () => {
        setSearchResults([]);
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

      const handleSubmit = async (event) => {
        event.preventDefault();
    
        const queryParameters = new URLSearchParams({
            name: sanitize(searchTerms.name),
            race: sanitize(searchTerms.race),
            power: sanitize(searchTerms.power),
            publisher: sanitize(searchTerms.publisher),
            n: sanitize(searchTerms.resultsLimit)
        });
    
        try {
            const response = await fetch(`http://localhost:5000/api/open/search2.0?${queryParameters}`);//call the API {Will have to change this by removing before the /api when running npm run build and serving react app ass static files}
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            //console.log('Search results:', data.heroes);
            setSearchResults(data.heroes); // Update the state with the new search results
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    

    return (
        <div>
        <form className="hero-search-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                placeholder="Hero Name"
                value={searchTerms.name}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="race"
                placeholder="Race"
                value={searchTerms.race}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="power"
                placeholder="Power"
                value={searchTerms.power}
                onChange={handleInputChange}
            />
            <input
                type="text"
                name="publisher"
                placeholder="Publisher"
                value={searchTerms.publisher}
                onChange={handleInputChange}
            />
            <input
                type="number"
                name="resultsLimit"
                placeholder="Number of Results"
                value={searchTerms.resultsLimit}
                onChange={handleInputChange}
                min="1"
            />
            <div className="form-actions">
                <button type="submit">Search</button>
                <button type="button" onClick={clearResults}>Clear All Results</button>
            </div>
        </form>

        <div className="search-results">
    {searchResults.map((hero) => (
        <div key={hero.id} className="search-result">
            <p><strong>Name:</strong> {hero.name}</p>
            <p><strong>Publisher:</strong> {hero.Publisher}</p>
            
            <button onClick={() => setExpandedHeroId(hero.id === expandedHeroId ? null : hero.id)}>
                {expandedHeroId === hero.id ? 'Hide Details' : 'Show Details'}
            </button>

            <button onClick={() => window.open(`https://duckduckgo.com/?q=${encodeURIComponent(hero.name)}`, '_blank')}>
                Search on DDG
            </button>

            {expandedHeroId === hero.id && (
                <div className="hero-details">
                <p><strong>Gender:</strong> {hero.Gender}</p>
                <p><strong>Eye Color:</strong> {hero['Eye color']}</p>
                <p><strong>Race:</strong> {hero.Race}</p>
                <p><strong>Hair Color:</strong> {hero['Hair color']}</p>
                <p><strong>Height:</strong> {hero.Height} cm</p>
                <p><strong>Weight:</strong> {hero.Weight} kg</p>
                <p><strong>Skin Color:</strong> {hero['Skin color']}</p>
                <p><strong>Alignment:</strong> {hero.Alignment}</p>
                <p><strong>Powers:</strong> {hero.powers && hero.powers.join(', ')}</p>
            </div>
            
            )}
        </div>
    ))}
</div>
        </div>
    );
}

