import React, { useState } from 'react';
import './passwordupdate.css';

export default function PasswordUpdate(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isCredentialsConfirmed, setIsCredentialsConfirmed] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            //console.log('Data:', data);
            if (data.token) {
                localStorage.setItem('jwtToken', data.token);
                setMessage('Credentials confirmed. You can now update your password.');
                setIsCredentialsConfirmed(true);
            } else {
                setMessage(data.message || 'Error confirming credentials');
                setIsCredentialsConfirmed(false);
            }
        } catch (err) {
            console.log('Error:', err);
            setIsCredentialsConfirmed(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch('/api/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({newPassword}),
            });
            //const data = await response.json();
            /* if (data.success) {
                alert('Password updated successfully.');
                props.history.push('/authenticated-dashboard');
            } else {
                setMessage(data.message || 'Error updating password');
            } */
            alert('Password updated successfully.');
            props.history.push('/login');
        } catch (err) {
            console.log('Error:', err);
        }
    };

    return (
        <div className="login-container">
            <h2>Update Your Password</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Current Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Confirm Credentials</button>
            </form>
            {message && <p className="login-message">{message}</p>}

            <form className="update-form" onSubmit={handleUpdate}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={!isCredentialsConfirmed}
                />
                <button type="submit" disabled={!isCredentialsConfirmed}>Update Password</button>
            </form>
            <a href="/">Return to Home</a>
        </div>
    );
}

