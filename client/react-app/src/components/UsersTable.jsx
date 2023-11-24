import React, { useState, useEffect } from 'react';
import './userstable.css'; 


export default function UsersTable() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch('http://localhost:5000/api/admin/users', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const formattedUsers = data.map(user => ({
                    ...user,
                    isDisabled: user.isdisabled // Set isDisabled based on isdisabled status
                }));
                setUsers(formattedUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
            
        }

        fetchUsers();
    }, []);

    const toggleUserAccount = async (email, isCurrentlyDisabled) => {
        try {
            const token = localStorage.getItem('jwtToken');
            //console.log(`Toggling account for ${email}: ${isCurrentlyDisabled}`);
            const response = await fetch(`http://localhost:5000/api/admin/users/${email}/disable`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ disable: isCurrentlyDisabled }) // Toggle the status
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // Update the state to reflect the change
            setUsers(users.map(user => 
                user.email === email ? { ...user, isDisabled: isCurrentlyDisabled } : user
            ));
        } catch (error) {
            console.error('Error toggling user account:', error);
        }
    };

    const toggleUserAdmin = async (email, isCurrentlyAdmin) => {
        try {
            const token = localStorage.getItem('jwtToken');
            //console.log(`Toggling account for ${email}: ${isCurrentlyDisabled}`);
            const response = await fetch(`http://localhost:5000/api/admin/users/${email}/isadmin`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ admin: isCurrentlyAdmin }) // Toggle the status
            });
            console.log("Toggling changes for: email, isCurrentlyAdmin", email, isCurrentlyAdmin);
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // Update the state to reflect the change
            setUsers(users.map(user => 
                user.email === email ? { ...user, isAdmin: isCurrentlyAdmin } : user
            ));
        } catch (error) {
            console.error('Error toggling user account:', error);
        }
    };
    

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="users-table-container">
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Nickname</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.email}</td>
                            <td>{user.nickname}</td>
                            <td>
                                <button onClick={() => toggleUserAccount(user.email, !user.isDisabled)}>
                                    {user.isDisabled ? 'Enable' : 'Disable'}
                                </button>
                                <button onClick={() => toggleUserAdmin(user.email, !user.isAdmin)}>
                                    {user.isAdmin ? 'Remove Admin' : 'Add Admin'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}