import React, { useState, useEffect } from 'react';
import MyPublicLists from './MyPublicLists';
import CreateList from './CreateList';
import MyLists from './MyLists';
import Footer from './Footer';
import AdminIndicator from './AdminIndicator';

export default function AuthenticatedUserDashboard(props) {
    const [listsKey, setListsTableKey] = useState(0); // state to keep track of key for ListTable component


    const refreshLists = () => {
        setListsTableKey(listsKey + 1); // update key to trigger re-render of MyLists.jsx table component
    };




    const isAdmin = async (e) => {
        try {
            const token = localStorage.getItem('jwtToken'); // retrieve token from local storage
            const response = await fetch('http://localhost:5000/api/isAdmin', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token // Include the JWT token
                },            });
            if (!response.ok) {
                return false;
            }
            return true;
        }
          catch (error) {
            return false;
        }
    } 

    return (
        <div className="authenticated-dashboard">
            <h2>Authenticated User Dashboard</h2>
            <AdminIndicator isAdmin={isAdmin} />
                <CreateList refreshLists={refreshLists} />
                <h3>View Your Lists</h3>
                <MyLists key={listsKey}/>
                <h3>View Community's Public Lists</h3>
                <MyPublicLists refreshLists={refreshLists} />
                <Footer />
            
        </div>
    );
}
