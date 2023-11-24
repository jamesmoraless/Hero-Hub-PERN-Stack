import React from 'react'
import AuthenticatedUserDashboard from './AuthenticatedUserDashboard'
import UsersTable from './UsersTable'
import ReviewsTable from './ReviewsTable'



export default function AdminDashboard() {
  return (
    <div>

      <h1>Admin Dashboard</h1>
      <h2>Users</h2>
      <UsersTable />
      <h2>Reviews</h2>
      <ReviewsTable />
      <AuthenticatedUserDashboard />
    </div>
  )
}
