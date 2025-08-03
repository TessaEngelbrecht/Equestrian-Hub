import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    TrendingUp,
    DollarSign,
    ShoppingCart,
    Calendar,
    Users,
    Package,
    BarChart3,
    PieChart
} from 'lucide-react'
import { useAdmin } from '../../contexts/AdminContext'

const Analytics = () => {
    const { getAnalytics } = useAdmin()
    const [analytics, setAnalytics] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAnalytics()
    }, [])

    const loadAnalytics = async () => {
        try {
            const data = await getAnalytics()
            setAnalytics(data)
        } catch (error) {
            console.error('Error loading analytics:', error)
        } finally {
            setLoading(false)
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

    if (!analytics) {
        return (
            <div className="text-center py-12">
                <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data</h3>
                <p className="text-gray-600">Start getting orders and bookings to see analytics!</p>
            </div>
        )
    }

    const statCards = [
        {
            title: 'Total Revenue',
            value: `R${analytics.totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            color: 'green',
            change: '+12%'
        },
        {
            title: 'Monthly Revenue',
            value: `R${analytics.monthlyRevenue.toFixed(2)}`,
            icon: TrendingUp,
            color: 'blue',
            change: '+8%'
        },
        {
            title: 'Total Orders',
            value: analytics.totalOrders.toString(),
            icon: ShoppingCart,
            color: 'purple',
            change: '+15%'
        },
        {
            title: 'Total Bookings',
            value: analytics.totalBookings.toString(),
            icon: Calendar,
            color: 'orange',
            change: '+10%'
        }
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
                <button
                    onClick={loadAnalytics}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors"
                >
                    Refresh Data
                </button>
            </div>

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
                {/* Monthly Trends Chart */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
                    <div className="space-y-4">
                        {analytics.monthlyTrends.map((trend, index) => (
                            <div key={trend.month} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                                    <span className="text-sm font-medium text-gray-900">{trend.month}</span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span>{trend.orders} orders</span>
                                    <span>{trend.bookings} bookings</span>
                                    <span className="font-medium text-gray-900">R{trend.revenue.toFixed(0)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Products */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
                    <div className="space-y-4">
                        {analytics.topProducts.map((product, index) => (
                            <div key={product.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-xs font-bold text-gray-600">#{index + 1}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 truncate">{product.name}</span>
                                </div>
                                <span className="text-sm text-gray-600">{product.quantity} sold</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Category Performance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h3>
                    <div className="space-y-4">
                        {analytics.topCategories.map((category, index) => {
                            const maxRevenue = Math.max(...analytics.topCategories.map(c => c.revenue))
                            const percentage = (category.revenue / maxRevenue) * 100

                            return (
                                <div key={category.category} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-900 capitalize">{category.category}</span>
                                        <span className="text-gray-600">R{category.revenue.toFixed(0)}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* Status Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Overview</h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Orders</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-yellow-600">{analytics.ordersByStatus.pending}</div>
                                    <div className="text-xs text-gray-600">Pending</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-green-600">{analytics.ordersByStatus.completed}</div>
                                    <div className="text-xs text-gray-600">Completed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-red-600">{analytics.ordersByStatus.cancelled}</div>
                                    <div className="text-xs text-gray-600">Cancelled</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-3">Bookings</h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center">
                                    <div className="text-lg font-bold text-yellow-600">{analytics.bookingsByStatus.pending}</div>
                                    <div className="text-xs text-gray-600">Pending</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-blue-600">{analytics.bookingsByStatus.confirmed}</div>
                                    <div className="text-xs text-gray-600">Confirmed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-lg font-bold text-green-600">{analytics.bookingsByStatus.completed}</div>
                                    <div className="text-xs text-gray-600">Completed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Analytics
