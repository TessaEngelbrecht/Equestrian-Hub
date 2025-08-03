import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';  // Assuming you have AuthContext
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { useAdmin } from '../contexts/AdminContext';

const MyBookings = () => {
    const { user } = useAuth();
    const { getUserBookings } = useAdmin();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadBookings();
        }
    }, [user]);

    const loadBookings = async () => {
        try {
            const data = await getUserBookings(user.id);  // Fetch bookings from the database
            setBookings(data);
        } catch (error) {
            console.error('Error loading bookings:', error);
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
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-green-50 to-pink-100">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <motion.h2
                    className="text-2xl font-bold text-center mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    My Bookings
                </motion.h2>

                <div className="space-y-6">
                    {bookings.length === 0 ? (
                        <p>No bookings found.</p>
                    ) : (
                        bookings.map((booking) => (
                            <div key={booking.id} className="bg-white shadow-md rounded-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">{booking.lessonType}</h3>
                                    <span className={`text-sm ${booking.status === 'confirmed' ? 'text-green-500' : 'text-yellow-500'}`}>
                                        {booking.status}
                                    </span>
                                </div>
                                <div>
                                    <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                                    <p><strong>Time:</strong> {booking.start_time} - {booking.end_time}</p>
                                    <p><strong>Total:</strong> R{booking.totalAmount}</p>
                                </div>
                                <div className="mt-4 flex gap-4">
                                    {booking.status === 'pending' && (
                                        <button className="bg-green-500 text-white py-2 px-4 rounded-md">
                                            Confirm Booking
                                        </button>
                                    )}
                                    <button className="bg-red-500 text-white py-2 px-4 rounded-md">
                                        Cancel Booking
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MyBookings;
