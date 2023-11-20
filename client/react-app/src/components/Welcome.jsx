//Preview Image of the shortener 
import React, {useState, useEffect} from 'react';
import "./welcome.css";


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
      <h1 className="welcome-title">Welcome to My URL Shortener</h1>
      <p className="intro-text">This is a URL shortener project that helps you create 
      shorter URLs for easy sharing and improved user experience.<br/><br/>
      <b>Snippet of the shortener:</b>
      </p>
      </div>
      <div className="about-me-box">
        <h2>About Me and My Project</h2>
        <p>Hi! My name is <b><i>James Morales</i></b> and I am a Software Engineering student with a passion for 
            creating web applications that have a purpose tied to making my life and the lives of 
            others easier. In this full-stack web application, I used a "PERN" stack back-end
            which includes <b>Postgresql</b> for creating my database, <b>SQL</b> to interact 
            with the database, <b>Express.js</b> to build my API, and <b>Node.js</b> to execute Javascript. For 
            the front-end I used <b>React</b> as my JS framework and good ol' <b>Javascript</b>, 
            <b>HTML</b> and <b>CSS</b>. <br/>
            I hope you find this web app useful and please checkout my personals in the footer.
            </p> <br/>
            <br/>
            <p>
                If you would like to try this out, feel free to register, login and then start using 
                the shortener. If you already have an account, simply login. 
            </p>
      </div>
      
      <div className="button-group">
        <button className="button register-button" onClick={handleRegisterBtn}>
            Register Now
        </button>
        <button className="button login-button" onClick={handleLoginBtn}>
            Login Now
        </button>
      </div>

    </div>
        
      );
    };
    