import React, { useState, useEffect } from 'react';
import MyPublicLists from './MyPublicLists';
import CreateList from './CreateList';
import MyLists from './MyLists';
import Footer from './Footer';

export default function AuthenticatedUserDashboard(props) {
    const [listsKey, setListsTableKey] = useState(0); // state to keep track of key for ListTable component


    const refreshLists = () => {
        setListsTableKey(listsKey + 1); // update key to trigger re-render of MyLists.jsx table component
    };

    return (
        <div className="authenticated-dashboard">
            <h2>Authenticated User Dashboard</h2>
                <CreateList refreshLists={refreshLists} />
                <h3>View Your Lists</h3>
                <MyLists key={listsKey}/>
                <h3>View Community's Public Lists</h3>
                <MyPublicLists refreshLists={refreshLists} />
                <Footer />
            
        </div>
    );
}
