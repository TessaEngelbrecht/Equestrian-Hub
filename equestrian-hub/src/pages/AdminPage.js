import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useAdmin } from '../contexts/AdminContext'
import { Navigate } from 'react-router-dom'
import AdminLayout from '../components/Admin/AdminLayout'
import AdminDashboard from '../components/Admin/AdminDashboard'
import OrderManagement from '../components/Admin/OrderManagement'
import BookingManagement from '../components/Admin/BookingManagement'
import ProductManagement from '../components/Admin/ProductManagement'

const AdminPage = () => {
    const { user, loading: authLoading } = useAuth()
    const { isAdmin } = useAdmin()
    const [currentPage, setCurrentPage] = useState('dashboard')

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-16 h-16 bg-primary rounded-lg shadow-lg animate-pulse" />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    if (!isAdmin()) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                </div>
            </div>
        )
    }

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <AdminDashboard />
            case 'orders':
                return <OrderManagement />
            case 'bookings':
                return <BookingManagement />
            case 'products':
                return <ProductManagement />
            default:
                return <AdminDashboard />
        }
    }

    return (
        <AdminLayout currentPage={currentPage} setCurrentPage={setCurrentPage}>
            {renderCurrentPage()}
        </AdminLayout>
    )
}

export default AdminPage
