import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';  // Assuming you have AuthContext
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { useAdmin } from '../contexts/AdminContext';

const MyOrdersPage = () => {
    const { user } = useAuth();  // Assuming you are using AuthContext
    const { getUserOrders } = useAdmin();  // Access the new method
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadOrders();
        }
    }, [user]);

    const loadOrders = async () => {
        try {
            const data = await getUserOrders(user.id);  // Fetch orders for the current user
            //('Fetched orders:', data);  // Log the fetched orders to check the data
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header />

            <div className="container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h2>

                {orders.length === 0 ? (
                    <p className="text-lg text-gray-600">You have no orders yet.</p>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-xl shadow-md mb-6">
                            <div className="flex justify-between mb-4">
                                <h3 className="text-2xl font-medium text-gray-800">Order #{order.id.slice(0, 8)}</h3>
                                <span className={`text-sm font-semibold ${order.status === 'pending' ? 'text-yellow-600' : order.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-700">
                                    <span className="font-semibold">Total</span>
                                    <span className="text-xl font-bold">R{parseFloat(order.total_amount).toFixed(2)}</span>
                                </div>

                                {/* Display order items */}
                                <ul className="space-y-3">
                                    {order.order_items?.map((item, index) => (
                                        <li key={index} className="flex justify-between items-center text-gray-600">
                                            <div>
                                                <span className="font-medium">{item.products.name}</span>
                                                <span className="text-sm text-gray-500">({item.products.category})</span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-gray-900">R{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default MyOrdersPage;