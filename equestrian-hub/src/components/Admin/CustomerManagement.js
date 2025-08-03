import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Users,
    Eye,
    Mail,
    Phone,
    Calendar,
    ShoppingCart,
    Search,
    Filter
} from 'lucide-react'
import { useAdmin } from '../../contexts/AdminContext'

const CustomerManagement = () => {
    const { getAllCustomers } = useAdmin()
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [showCustomerModal, setShowCustomerModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadCustomers()
    }, [])

    const loadCustomers = async () => {
        try {
            const data = await getAllCustomers()
            // Calculate customer stats
            const customersWithStats = data.map(customer => ({
                ...customer,
                totalOrders: customer.orders?.length || 0,
                totalBookings: customer.lesson_bookings?.length || 0,
                totalSpent: (customer.orders || []).reduce((sum, order) => sum + parseFloat(order.total_amount), 0) +
                    (customer.lesson_bookings || []).reduce((sum, booking) => sum + parseFloat(booking.total_amount), 0),
                lastActivity: getLastActivity(customer)
            }))
            setCustomers(customersWithStats)
        } catch (error) {
            console.error('Error loading customers:', error)
        } finally {
            setLoading(false)
        }
    }

    const getLastActivity = (customer) => {
        const allActivities = [
            ...(customer.orders || []).map(o => ({ date: o.created_at, type: 'order' })),
            ...(customer.lesson_bookings || []).map(b => ({ date: b.created_at, type: 'booking' }))
        ]

        if (allActivities.length === 0) return null

        const latest = allActivities.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
        return latest
    }

    const filteredCustomers = customers.filter(customer =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getCustomerTypeColor = (customer) => {
        if (customer.totalOrders > 5 || customer.totalSpent > 5000) {
            return 'bg-yellow-100 text-yellow-800' // VIP
        } else if (customer.totalOrders > 2 || customer.totalBookings > 2) {
            return 'bg-green-100 text-green-800' // Regular
        } else {
            return 'bg-blue-100 text-blue-800' // New
        }
    }

    const getCustomerType = (customer) => {
        if (customer.totalOrders > 5 || customer.totalSpent > 5000) {
            return 'VIP'
        } else if (customer.totalOrders > 2 || customer.totalBookings > 2) {
            return 'Regular'
        } else {
            return 'New'
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Customers</p>
                            <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                        </div>
                        <Users className="text-blue-600" size={24} />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">VIP Customers</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {customers.filter(c => getCustomerType(c) === 'VIP').length}
                            </p>
                        </div>
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-yellow-600 text-xs">👑</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Regular Customers</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {customers.filter(c => getCustomerType(c) === 'Regular').length}
                            </p>
                        </div>
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-xs">⭐</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">New Customers</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {customers.filter(c => getCustomerType(c) === 'New').length}
                            </p>
                        </div>
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-xs">✨</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Orders
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bookings
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total Spent
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Activity
                                </th>
                                <th className="px-6 py-3 relative">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCustomers.map((customer) => (
                                <motion.tr
                                    key={customer.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                                <span className="text-white font-medium">
                                                    {customer.name?.charAt(0) || customer.email.charAt(0)}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {customer.name} {customer.surname}
                                                </div>
                                                <div className="text-sm text-gray-500">{customer.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCustomerTypeColor(customer)}`}>
                                            {getCustomerType(customer)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {customer.totalOrders}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {customer.totalBookings}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        R{customer.totalSpent.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {customer.lastActivity ? (
                                            <div>
                                                <div>{new Date(customer.lastActivity.date).toLocaleDateString()}</div>
                                                <div className="text-xs capitalize">{customer.lastActivity.type}</div>
                                            </div>
                                        ) : (
                                            'No activity'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                setSelectedCustomer(customer)
                                                setShowCustomerModal(true)
                                            }}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Details Modal */}
            <AnimatePresence>
                {showCustomerModal && selectedCustomer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold">Customer Details</h3>
                                    <button
                                        onClick={() => setShowCustomerModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Customer Info */}
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                                            <span className="text-white text-xl font-medium">
                                                {selectedCustomer.name?.charAt(0) || selectedCustomer.email.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold text-gray-900">
                                                {selectedCustomer.name} {selectedCustomer.surname}
                                            </h4>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <span className="flex items-center text-gray-600">
                                                    <Mail size={14} className="mr-1" />
                                                    {selectedCustomer.email}
                                                </span>
                                                {selectedCustomer.contact_number && (
                                                    <span className="flex items-center text-gray-600">
                                                        <Phone size={14} className="mr-1" />
                                                        {selectedCustomer.contact_number}
                                                    </span>
                                                )}
                                            </div>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getCustomerTypeColor(selectedCustomer)}`}>
                                                {getCustomerType(selectedCustomer)} Customer
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-gray-900">{selectedCustomer.totalOrders}</div>
                                            <div className="text-sm text-gray-600">Orders</div>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-gray-900">{selectedCustomer.totalBookings}</div>
                                            <div className="text-sm text-gray-600">Bookings</div>
                                        </div>
                                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                                            <div className="text-2xl font-bold text-gray-900">R{selectedCustomer.totalSpent.toFixed(0)}</div>
                                            <div className="text-sm text-gray-600">Total Spent</div>
                                        </div>
                                    </div>

                                    {/* Recent Orders */}
                                    {selectedCustomer.orders && selectedCustomer.orders.length > 0 && (
                                        <div>
                                            <h5 className="font-medium text-gray-900 mb-3">Recent Orders</h5>
                                            <div className="space-y-2">
                                                {selectedCustomer.orders.slice(0, 5).map((order, index) => (
                                                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                                        <div>
                                                            <span className="text-sm font-medium">Order #{order.id.slice(0, 8)}</span>
                                                            <span className="text-xs text-gray-500 ml-2">
                                                                {new Date(order.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm font-medium">R{parseFloat(order.total_amount).toFixed(2)}</span>
                                                            <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-red-100 text-red-800'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Recent Bookings */}
                                    {selectedCustomer.lesson_bookings && selectedCustomer.lesson_bookings.length > 0 && (
                                        <div>
                                            <h5 className="font-medium text-gray-900 mb-3">Recent Bookings</h5>
                                            <div className="space-y-2">
                                                {selectedCustomer.lesson_bookings.slice(0, 5).map((booking, index) => (
                                                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                                        <div>
                                                            <span className="text-sm font-medium">Booking #{booking.id.slice(0, 8)}</span>
                                                            <span className="text-xs text-gray-500 ml-2">
                                                                {new Date(booking.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm font-medium">R{parseFloat(booking.total_amount).toFixed(2)}</span>
                                                            <span className={`text-xs px-2 py-1 rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                        'bg-red-100 text-red-800'
                                                                }`}>
                                                                {booking.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CustomerManagement
