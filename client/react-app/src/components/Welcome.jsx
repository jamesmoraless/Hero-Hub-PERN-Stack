import React, {useState, useEffect} from 'react';
import "./welcome.css";
import HeroSearchForm from "./HeroSearchForm"; 
import PublicLists from './PublicLists';


export default function Welcome(props) {
    const handleLoginBtn = () => {
        try {
          //get redirected to login
          props.history.push('/login');

        } catch (err) {
          console.log('Button Failed:', err);
        }
      };
    const handleRegisterBtn = () => {
        try {
          //get redirected to register
          props.history.push('/register');

        } catch (err) {
          console.log('Button Failed:', err);
        }
      };

      
    return (
    <div className="welcome-container">
        <div className="top-page-box">
      <h1 className="welcome-title">Welcome to Lab4 of Webtech</h1>
      </div>
      <div className="about-me-box">
        <h2>About</h2>
          <p>Hi! My name is <b><i>James Morales</i></b> and I am a Software Engineering student with a passion for 
      developing innovative web applications. This project, a comprehensive superhero database, 
      showcases a full-stack web application built using the "PERN" stack. The backend is powered 
      by <b>PostgreSQL</b> for database management, <b>Express.js</b> for API development, and <b>Node.js</b> for server-side logic. 
      The frontend leverages the dynamic capabilities of <b>React</b>, combined with traditional <b>JavaScript</b>, 
      <b>HTML</b>, and <b>CSS</b>. This application allows users to explore a vast array of superheroes, 
      manage personalized hero lists, and engage with a community through reviews and ratings. <br/><br/>
      Dive into the world of heroes, discover their powers, origins, and publishers. You can start 
      by searching for your favorite heroes or exploring public hero lists. If you wish to create 
      your own lists and leave reviews, please register or log in. I hope this application provides 
      an enjoyable and informative experience. Check out my personal links in the footer for more 
      information and other projects.</p>
      </div>
      
      <div className="button-group">
        <button className="button register-button" onClick={handleRegisterBtn}>
            Register Now
        </button>
        <button className="button login-button" onClick={handleLoginBtn}>
            Login Now
        </button>
      </div>

      <div className="hero-search-section">
          <h2>Explore Available Superheroes</h2>
          <p>Search for heroes by name, race, power, or publisher.</p>
          <HeroSearchForm />
      </div>

      
      <div className="public-hero-lists-section">
          <h2>Public Hero Lists</h2>
          <p>Discover lists of heroes created by other users.</p>
          <PublicLists />
      </div>

    </div>
        
      );
    };
    