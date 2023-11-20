import React, {useState, useEffect} from 'react';
import './login.css';
import { withRouter } from 'react-router-dom';


export default function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Call the API to register the user
        try{
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',//conetent to be received is json object
                },
                body: JSON.stringify({ email, password}),//must stringify both body fields
            });
            //console.log(response);
            const data = await response.json();//make the response into JSON in order to bring it to front end 
            console.log('Data:', data);
            // To save the token:
            if (data.token){
                localStorage.setItem('jwtToken', data.token);
                //console.log(localStorage.getItem('jwtToken'));
                setMessage('Login succesful!');//send a hyperlink through 'login'
                props.history.push('/shortener');//must be the next page which is authenticated funcionality page
                
            } else{
                setMessage(data.message || 'An error occured during login');
            }
        }catch(err){
            console.log('An error occured while calling the API.');
        }
    };
  
    return (
        <div className = "login-container">
            <h2 className="login-title">Login Now :)</h2>
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
        </div>
  )
}
