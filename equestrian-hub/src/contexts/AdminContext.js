import React, { createContext, useContext, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const AdminContext = createContext()

export const useAdmin = () => {
    const context = useContext(AdminContext)
    if (!context) {
        throw new Error('useAdmin must be used within an AdminProvider')
    }
    return context
}

export const AdminProvider = ({ children }) => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)

    // Check if user is admin
    const isAdmin = () => {
        const adminEmails = (process.env.REACT_APP_ADMIN_EMAILS || '').split(',')
        return user && adminEmails.includes(user.email)
    }

    // Analytics functions
    const getAnalytics = async () => {
        try {
            setLoading(true)

            // Get orders data
            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select(`
          *,
          order_items!inner(quantity, price, products!inner(name, category))
        `)

            if (ordersError) throw ordersError

            // Get bookings data
            const { data: bookings, error: bookingsError } = await supabase
                .from('lesson_bookings')
                .select(`
          *,
          lesson_types!inner(name, price_per_hour)
        `)

            if (bookingsError) throw bookingsError

            // Calculate analytics
            const analytics = calculateAnalytics(orders, bookings)
            return analytics

        } catch (error) {
            console.error('Error fetching analytics:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const calculateAnalytics = (orders, bookings) => {
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth()
        const currentYear = currentDate.getFullYear()

        // Revenue analytics
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0)
        const monthlyRevenue = orders
            .filter(order => {
                const orderDate = new Date(order.created_at)
                return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
            })
            .reduce((sum, order) => sum + parseFloat(order.total_amount), 0)

        // Product analytics
        const productSales = {}
        const categorySales = {}

        orders.forEach(order => {
            order.order_items.forEach(item => {
                const productName = item.products.name
                const category = item.products.category
                const revenue = item.price * item.quantity

                productSales[productName] = (productSales[productName] || 0) + item.quantity
                categorySales[category] = (categorySales[category] || 0) + revenue
            })
        })

        // Top products and categories
        const topProducts = Object.entries(productSales)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, quantity]) => ({ name, quantity }))

        const topCategories = Object.entries(categorySales)
            .sort(([, a], [, b]) => b - a)
            .map(([category, revenue]) => ({ category, revenue }))

        // Booking analytics
        const totalBookings = bookings.length
        const bookingRevenue = bookings.reduce((sum, booking) => sum + parseFloat(booking.total_amount), 0)

        // Monthly trends (last 6 months)
        const monthlyTrends = []
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentYear, currentMonth - i, 1)
            const monthOrders = orders.filter(order => {
                const orderDate = new Date(order.created_at)
                return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear()
            })

            const monthBookings = bookings.filter(booking => {
                const bookingDate = new Date(booking.created_at)
                return bookingDate.getMonth() === date.getMonth() && bookingDate.getFullYear() === date.getFullYear()
            })

            monthlyTrends.push({
                month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                orders: monthOrders.length,
                bookings: monthBookings.length,
                revenue: monthOrders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) +
                    monthBookings.reduce((sum, booking) => sum + parseFloat(booking.total_amount), 0)
            })
        }

        return {
            totalRevenue,
            monthlyRevenue,
            totalOrders: orders.length,
            totalBookings,
            bookingRevenue,
            topProducts,
            topCategories,
            monthlyTrends,
            ordersByStatus: {
                pending: orders.filter(o => o.status === 'pending').length,
                completed: orders.filter(o => o.status === 'completed').length,
                cancelled: orders.filter(o => o.status === 'cancelled').length
            },
            bookingsByStatus: {
                pending: bookings.filter(b => b.status === 'pending').length,
                confirmed: bookings.filter(b => b.status === 'confirmed').length,
                completed: bookings.filter(b => b.status === 'completed').length
            }
        }
    }

    // Get all customers
    const getAllCustomers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select(`
          *,
          orders(id, total_amount, status, created_at),
          lesson_bookings(id, total_amount, status, created_at)
        `)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error fetching customers:', error)
            throw error
        }
    }

    // Existing functions from previous implementation
    const getAllOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
          *,
          users!inner(name, surname, email, contact_number),
          order_items!inner(
            quantity,
            price,
            products!inner(name, price, cost_price)
          )
        `)
                .order('created_at', { ascending: false })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error fetching orders:', error)
            throw error
        }
    }

    const getAllBookings = async () => {
        try {
            const { data, error } = await supabase
                .from('lesson_bookings')
                .select(`
          *,
          users!inner(name, surname, email, contact_number),
          lesson_types!inner(name, description, price_per_hour, duration_minutes)
        `)
                .order('booking_date', { ascending: false })

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error fetching bookings:', error)
            throw error
        }
    }

    const markOrderCompleted = async (orderId) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'completed'})
                .eq('id', orderId)

            if (error) throw error
        } catch (error) {
            console.error('Error completing order:', error)
            throw error
        }
    }

    const confirmBooking = async (bookingId) => {
        try {
            const { error } = await supabase
                .from('lesson_bookings')
                .update({ status: 'confirmed'})
                .eq('id', bookingId)

            if (error) throw error
        } catch (error) {
            console.error('Error confirming booking:', error)
            throw error
        }
    }

    const deleteOrder = async (orderId) => {
        try {
            // First delete order items
            const { error: itemsError } = await supabase
                .from('order_items')
                .delete()
                .eq('order_id', orderId)

            if (itemsError) throw itemsError

            // Then delete the order
            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('id', orderId)

            if (error) throw error
        } catch (error) {
            console.error('Error deleting order:', error)
            throw error
        }
    }

    const deleteBooking = async (bookingId) => {
        try {
            const { error } = await supabase
                .from('lesson_bookings')
                .delete()
                .eq('id', bookingId)

            if (error) throw error
        } catch (error) {
            console.error('Error deleting booking:', error)
            throw error
        }
    }

    const addOrderNotes = async (orderId, notes) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ notes })
                .eq('id', orderId)

            if (error) throw error
        } catch (error) {
            console.error('Error adding order notes:', error)
            throw error
        }
    }

    const addBookingNotes = async (bookingId, notes) => {
        try {
            const { error } = await supabase
                .from('lesson_bookings')
                .update({ notes})
                .eq('id', bookingId)

            if (error) throw error
        } catch (error) {
            console.error('Error adding booking notes:', error)
            throw error
        }
    }

    const getAllProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('name')

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error fetching products:', error)
            throw error
        }
    }

    const createProduct = async (productData) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert({
                    ...productData,
                    created_at: new Date().toISOString(),
                    //updated_at: new Date().toISOString()
                })
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error creating product:', error)
            throw error
        }
    }

    const updateProduct = async (productId, productData) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({
                    ...productData,
                    //updated_at: new Date().toISOString()
                })
                .eq('id', productId)

            if (error) throw error
        } catch (error) {
            console.error('Error updating product:', error)
            throw error
        }
    }

    const deleteProduct = async (productId) => {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', productId)

            if (error) throw error
        } catch (error) {
            console.error('Error deleting product:', error)
            throw error
        }
    }

    const calculateSummary = (orders) => {
        const totalOrders = orders.length
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0)
        const totalProfit = orders.reduce((sum, order) => {
            const profit = order.order_items.reduce((itemProfit, item) => {
                const costPrice = item.products.cost_price || 0
                const sellingPrice = item.price
                return itemProfit + ((sellingPrice - costPrice) * item.quantity)
            }, 0)
            return sum + profit
        }, 0)
        const completedOrders = orders.filter(order => order.status === 'completed').length

        return {
            totalOrders,
            totalRevenue,
            totalProfit,
            completedOrders
        }
    }

    const getUserOrders = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                *,
                order_items!inner(quantity, price, products!inner(name, category))
            `)
                .eq('user_id', userId)  // Make sure the user_id is correct
                .order('created_at', { ascending: false })

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching orders for user:', error);
            throw error;
        }
    };


    // Fetch bookings specifically for the logged-in user
    const getUserBookings = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('lesson_bookings')
                .select(`
                    *,
                    lesson_types!inner(name, price_per_hour, duration_minutes)
                `)
                .eq('user_id', userId)  // Filter by user ID
                .order('booking_date', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching bookings for user:', error);
            throw error;
        }
    };

    const value = {
        loading,
        setLoading,
        isAdmin,
        getAllOrders,
        getAllBookings,
        getAllCustomers,
        getAnalytics,
        markOrderCompleted,
        confirmBooking,
        deleteOrder,
        deleteBooking,
        addOrderNotes,
        addBookingNotes,
        getAllProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        calculateSummary,
        getUserOrders,
        getUserBookings
    }

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    )
}
