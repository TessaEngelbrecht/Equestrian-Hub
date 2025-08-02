import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import ProductGrid from '../components/Products/ProductGrid'
import CartDrawer from '../components/Cart/CartDrawer'

const ShopPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-green-50 to-pink-100">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h1
                        className="text-4xl md:text-5xl font-display font-bold text-primary mb-4"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <ShoppingBag className="inline-block mr-3 mb-2" size={48} />
                        Equestrian Shop
                    </motion.h1>

                    <motion.p
                        className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Discover our premium collection of horse feed, equipment, clothing, and accessories.
                        Everything you need to care for your equine companions.
                    </motion.p>

                    {/* Feature highlights */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-6 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-md">
                            <span className="text-green-500 mr-2">🌾</span>
                            <span className="text-sm font-medium">Premium Feed</span>
                        </div>
                        <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-md">
                            <span className="text-blue-500 mr-2">🏇</span>
                            <span className="text-sm font-medium">Quality Equipment</span>
                        </div>
                        <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-md">
                            <span className="text-pink-500 mr-2">🧽</span>
                            <span className="text-sm font-medium">Horse Care</span>
                        </div>
                        <div className="flex items-center bg-white rounded-full px-6 py-3 shadow-md">
                            <span className="text-purple-500 mr-2">👕</span>
                            <span className="text-sm font-medium">Riding Apparel</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Product Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <ProductGrid />
                </motion.div>
            </main>

            <Footer />
            <CartDrawer />
        </div>
    )
}

export default ShopPage
