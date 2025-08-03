import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Calendar,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    BarChart3
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const AdminLayout = ({ children, currentPage, setCurrentPage }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user, signOut } = useAuth()
    const navigate = useNavigate()

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'bookings', label: 'Bookings', icon: Calendar },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings }
    ]

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    const handleBackToSite = () => {
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile menu overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <span className="text-primary text-2xl">🐎</span>
                        <span className="text-lg font-bold text-gray-900">Admin Panel</span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="mt-8">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setCurrentPage(item.id)
                                setSidebarOpen(false)
                            }}
                            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${currentPage === item.id
                                    ? 'bg-primary-50 text-primary border-r-2 border-primary'
                                    : 'text-gray-700'
                                }`}
                        >
                            <item.icon className="mr-3" size={20} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Back to Site Button */}
                <div className="absolute bottom-16 w-full px-4">
                    <button
                        onClick={handleBackToSite}
                        className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                        ← Back to Site
                    </button>
                </div>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <span className="text-sm font-medium text-gray-700 truncate">
                                {user?.email}
                            </span>
                        </div>
                        <button
                            onClick={handleSignOut}
                            className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-red-600"
                            title="Sign out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-6">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                        >
                            <Menu size={20} />
                        </button>

                        <h1 className="text-xl font-semibold text-gray-900 capitalize">
                            {currentPage}
                        </h1>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Welcome back, Admin
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">
                    <motion.div
                        key={currentPage}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
