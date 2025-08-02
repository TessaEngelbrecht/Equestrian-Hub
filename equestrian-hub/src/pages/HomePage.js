import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingBag, Calendar, Award, Heart } from 'lucide-react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import HorseQuiz from '../components/ HorseQuiz'

const HomePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-green-50 to-pink-100">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h1
                        className="text-5xl md:text-6xl font-display font-bold text-primary mb-4"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        Meadowbrook Equestrian
                    </motion.h1>

                    <motion.p
                        className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Your premier destination for equestrian excellence, quality horse supplies, and professional riding instruction
                    </motion.p>

                    {/* Hero Image */}
                    <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&h=400&fit=crop&crop=center"
                            alt="Beautiful horses in meadow"
                            className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
                        />
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        <Link
                            to="/lessons"
                            className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:bg-primary-light transition-all hover:scale-105"
                        >
                            <Calendar className="mr-2" size={20} />
                            Book a Lesson
                        </Link>
                        <Link
                            to="/shop"
                            className="inline-flex items-center bg-secondary text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:bg-secondary-light transition-all hover:scale-105"
                        >
                            <ShoppingBag className="mr-2" size={20} />
                            Shop Supplies
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Horse Quiz */}
                <HorseQuiz />

                {/* Features Section */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                        <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Expert Instruction</h3>
                        <p className="text-gray-600">Professional riding lessons from certified instructors</p>
                    </div>

                    <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                        <ShoppingBag className="w-16 h-16 text-secondary mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Quality Supplies</h3>
                        <p className="text-gray-600">Premium horse feed, equipment, and accessories</p>
                    </div>

                    <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                        <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Horse Care</h3>
                        <p className="text-gray-600">Complete care solutions for your beloved horses</p>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    )
}

export default HomePage
