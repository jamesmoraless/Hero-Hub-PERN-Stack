import React from 'react';

const AdminIndicator = ({ isAdmin }) => {
    if (isAdmin) {
        return (
            <div className="admin-indicator">
                <p>You are logged in as an Admin.</p>
            </div>
        );
    }

    return null;
};

export default AdminIndicator;
