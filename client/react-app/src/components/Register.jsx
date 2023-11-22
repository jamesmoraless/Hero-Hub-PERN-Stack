import React, {useState, useEffect} from 'react';
import './register.css';
import { withRouter } from 'react-router-dom';


export default function Register(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');
    const [verificationLink, setVerificationLink] = useState(''); // New state for verification link
    const [showLoginButton, setShowLoginButton] = useState(false);

    const handleVerificationClick = async (e) => {
        e.preventDefault();
        alert('Email has been verified.');
        try{
            const response = await fetch(`http://localhost:5000/api/verify-email?email=${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

        }catch(err){
            console.log('An error occured while calling the API.');
        }

        setShowLoginButton(true);
    };

    const redirectToLogin = () => {
        props.history.push('/login');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        //Call the API to register the user
        try{
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, nickname}),
            });
            const data = await response.json();
            //console.log('Data:', data);

            if (data.email){
                const link = `http://localhost:5000/api/verify-email?email=${encodeURIComponent(email)}`;
                setVerificationLink(link);
                setMessage('Registration succesful! Please click on the button to verify.');//send a hyperlink through 'login' props.history.push('/login');
                
            } else{
                setMessage(data.message || 'An error occured during registration');
            }
        }catch(err){
            console.log('An error occured while calling the API.');
        }
    };

  return (
    
    <div className = "register-container">
        <h2 className="register-title">Register Now</h2>
        <form className="register-form" onSubmit={handleSubmit}>
            <input 
            type = "email"
            placeholder="myEmail@service.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
            <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e)=>{setNickname(e.target.value)}}
            required
            />

            <input
            type = "password"
            placeholder = "Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <button type="submit">Register</button>
            </form> 
            {message && <p className="register-message">{message}</p>}
            {verificationLink && (
                <div>
                    <p>Please click the button below to verify your email:</p>
                    <button onClick={handleVerificationClick}>Verify Email</button>
                </div>
            )}

            {showLoginButton && (
                <button onClick={redirectToLogin}>Go to Login</button>
            )}
            
    </div>
    
  )
}

//on submission of the form, I want to check if the email is valid by doing email verification (2points on the table)
//If the account is flagged as disabled, show a message asking to contact the site administrator and not allow logging in. {1 point}

