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

    // Get all orders with related data
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

    // Get all lesson bookings
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

    // Mark order as completed
    const markOrderCompleted = async (orderId) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'completed' })
                .eq('id', orderId)

            if (error) throw error
        } catch (error) {
            console.error('Error completing order:', error)
            throw error
        }
    }

    // Mark booking as confirmed
    const confirmBooking = async (bookingId) => {
        try {
            const { error } = await supabase
                .from('lesson_bookings')
                .update({ status: 'confirmed' })
                .eq('id', bookingId)

            if (error) throw error
        } catch (error) {
            console.error('Error confirming booking:', error)
            throw error
        }
    }

    // Delete order
    const deleteOrder = async (orderId) => {
        try {
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

    // Delete booking
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

    // Add order notes
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

    // Add booking notes
    const addBookingNotes = async (bookingId, notes) => {
        try {
            const { error } = await supabase
                .from('lesson_bookings')
                .update({ notes })
                .eq('id', bookingId)

            if (error) throw error
        } catch (error) {
            console.error('Error adding booking notes:', error)
            throw error
        }
    }

    // Get products for management
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

    // Create product
    const createProduct = async (productData) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert(productData)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (error) {
            console.error('Error creating product:', error)
            throw error
        }
    }

    // Update product
    const updateProduct = async (productId, productData) => {
        try {
            const { error } = await supabase
                .from('products')
                .update(productData)
                .eq('id', productId)

            if (error) throw error
        } catch (error) {
            console.error('Error updating product:', error)
            throw error
        }
    }

    // Delete product
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

    // Calculate dashboard stats
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

    const value = {
        loading,
        setLoading,
        isAdmin,
        getAllOrders,
        getAllBookings,
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
        calculateSummary
    }

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    )
}
