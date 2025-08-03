import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    ShoppingCart,
    Calendar,
    Package,
    TrendingUp,
    DollarSign,
    Users,
    Clock,
    CheckCircle,
    Plus,
    BarChart3
} from 'lucide-react'
import { useAdmin } from '../../contexts/AdminContext'

const AdminDashboard = ({ setCurrentPage }) => {
    const { getAllOrders, getAllBookings, calculateSummary } = useAdmin()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalBookings: 0,
        pendingOrders: 0
    })
    const [recentActivity, setRecentActivity] = useState([])

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            setLoading(true)
            const [ordersData, bookingsData] = await Promise.all([
                getAllOrders(),
                getAllBookings()
            ])

            // Calculate stats
            const orderStats = calculateSummary(ordersData)
            const pendingOrders = ordersData.filter(order => order.status === 'pending').length
            const totalBookings = bookingsData.length

            setStats({
                totalRevenue: orderStats.totalRevenue,
                totalOrders: orderStats.totalOrders,
                totalBookings,
                pendingOrders
            })

            // Recent activity
            const recentOrders = ordersData.slice(0, 3).map(order => ({
                type: 'order',
                id: order.id,
                customer: `${order.users.name} ${order.users.surname}`,
                amount: order.total_amount,
                status: order.status,
                date: order.created_at
            }))

            const recentBookings = bookingsData.slice(0, 3).map(booking => ({
                type: 'booking',
                id: booking.id,
                customer: `${booking.users.name} ${booking.users.surname}`,
                lesson: booking.lesson_types.name,
                date: booking.booking_date,
                status: booking.status
            }))

            setRecentActivity([...recentOrders, ...recentBookings].slice(0, 5))

        } catch (error) {
            console.error('Error loading dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const statCards = [
        {
            title: 'Total Revenue',
            value: `R${stats.totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            color: 'green',
            change: '+12%'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders.toString(),
            icon: ShoppingCart,
            color: 'blue',
            change: '+5%'
        },
        {
            title: 'Lesson Bookings',
            value: stats.totalBookings.toString(),
            icon: Calendar,
            color: 'purple',
            change: '+8%'
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders.toString(),
            icon: Clock,
            color: 'orange',
            change: '-2%'
        }
    ]

    // Enhanced Quick Actions with onClick handlers
    const quickActions = [
        {
            title: 'Add New Product',
            description: 'Add new products to your inventory',
            icon: Package,
            color: 'primary',
            onClick: () => setCurrentPage('products')
        },
        {
            title: 'Process Orders',
            description: 'Review and process pending orders',
            icon: CheckCircle,
            color: 'green',
            onClick: () => setCurrentPage('orders')
        },
        {
            title: 'Manage Bookings',
            description: 'View and confirm lesson bookings',
            icon: Calendar,
            color: 'blue',
            onClick: () => setCurrentPage('bookings')
        },
        {
            title: 'View Analytics',
            description: 'See detailed business analytics',
            icon: BarChart3,
            color: 'purple',
            onClick: () => setCurrentPage('analytics')
        }
    ]

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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                                <p className={`text-sm mt-1 ${card.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {card.change} from last month
                                </p>
                            </div>
                            <div className={`p-3 rounded-full bg-${card.color}-100`}>
                                <card.icon className={`text-${card.color}-600`} size={24} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enhanced Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        {quickActions.map((action, index) => (
                            <motion.button
                                key={action.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                onClick={action.onClick}
                                className={`w-full flex items-center justify-between p-4 bg-${action.color}-50 rounded-lg hover:bg-${action.color}-100 transition-colors group`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 bg-${action.color}-500 rounded-lg group-hover:scale-110 transition-transform`}>
                                        <action.icon className="text-white" size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium text-gray-900">{action.title}</div>
                                        <div className="text-sm text-gray-600">{action.description}</div>
                                    </div>
                                </div>
                                <span className={`text-${action.color}-600 group-hover:translate-x-1 transition-transform`}>→</span>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-full ${activity.type === 'order' ? 'bg-blue-100' : 'bg-purple-100'
                                        }`}>
                                        {activity.type === 'order' ?
                                            <ShoppingCart className={`${activity.type === 'order' ? 'text-blue-600' : 'text-purple-600'}`} size={16} /> :
                                            <Calendar className="text-purple-600" size={16} />
                                        }
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {activity.customer}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {activity.type === 'order'
                                                ? `Order #${activity.id.slice(0, 8)}`
                                                : activity.lesson
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {activity.type === 'order' && (
                                        <p className="text-sm font-medium text-gray-900">
                                            R{parseFloat(activity.amount).toFixed(2)}
                                        </p>
                                    )}
                                    <p className={`text-xs px-2 py-1 rounded-full ${activity.status === 'completed' || activity.status === 'confirmed'
                                            ? 'bg-green-100 text-green-800'
                                            : activity.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                        {activity.status}
                                    </p>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="text-center py-8 text-gray-500">
                                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>No recent activity</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default AdminDashboard
