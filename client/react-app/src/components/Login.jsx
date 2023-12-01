import React, {useState, useEffect} from 'react';
import './login.css';
import { withRouter } from 'react-router-dom';


export default function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [verificationLink, setVerificationLink] = useState(''); // New state for verification link

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
        setVerificationLink('');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        //Call the API to login the user
        try{
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',//conetent to be received is json object
                },
                body: JSON.stringify({ email, password}),//must stringify both body fields
            });
            const data = await response.json();//make the response into JSON in order to bring it to front end 
            //console.log('Data:', data);
            // To save the token:
            if (data.token){
                localStorage.setItem('jwtToken', data.token);
                 if (data.isAdmin){
                    props.history.push('/admin-dashboard');//if the user is an admin redirecct them to their dashboard
                } else if (!data.isAdmin){
                    props.history.push('/authenticated-dashboard');//if a user isnt an admin, redirect them to the other dashboard
                }
                //if(data.is === 'Email has been verified.'){
                
            } 
            else{
                if(response.status === 403){
                setMessage(data.message || 'An error occured during registration');
            } else if(response.status === 401){
                const link = `http://localhost:5000/api/verify-email?email=${encodeURIComponent(email)}`;
                    setVerificationLink(link);
                    setMessage("Please verify your email. Click on the link we have provided.");
            } else{
                setMessage(data.message || 'An error occured during registration');
            }
            console.log(data);
        }
        }catch (err) {
            console.log('An error occurred while calling the API:', err);    
        }
    };
  
    return (
        <div className = "login-container">
            <h2 className="login-title">Login Now</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <input 
                type = "email"
                placeholder="myEmail@service.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <input
                type = "password"
                placeholder = "Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <button type="submit">Login</button>        
            </form> 
            {message && <p className="login-message">{message}</p>}
            <a href="/passwordUpdate">Update Password</a>
            <a href="/register">Register</a>
             {verificationLink && (
                <div>
                    <p>You must verify your email before logging in:</p>
                    <button onClick={handleVerificationClick}>Verify Email</button>
                </div>
            )} 
        </div>
  )
}
