import React, {useState, useEffect} from 'react';
import './register.css';
import { withRouter } from 'react-router-dom';


export default function Register(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        //Call the API to register the user
        try{
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password}),
            });
            //console.log(response);
            const data = await response.json();
            //console.log('Data:', data);

            if (data.email){
                setMessage('Registration succesful! Please login.');//send a hyperlink through 'login'
                props.history.push('/login');
                
            } else{
                setMessage(data.message || 'An error occured during registration');
            }
        }catch(err){
            console.log('An error occured while calling the API.');
        }
    };

  return (
    
    <div className = "register-container">
        <h2 className="register-title">Register Now :)</h2>
        <form className="register-form" onSubmit={handleSubmit}>
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
            <button type="submit">Register</button>        
            </form> 
            {message && <p className="register-message">{message}</p>}
    </div>
    
  )
}
