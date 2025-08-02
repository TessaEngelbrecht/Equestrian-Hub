import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingCart, Calendar, User, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import CartDrawer from '../Cart/CartDrawer'

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const { user, signOut } = useAuth()
    const { cartItems, openCart } = useCart()
    const navigate = useNavigate()

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
        setShowUserMenu(false)
    }

    const menuItems = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Lessons', path: '/lessons' },
    ]

    return (
        <>
            <header className="bg-white shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-display font-bold text-primary">
                                Meadowbrook Equestrian
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="text-gray-700 hover:text-primary transition-colors font-medium"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            <button
                                onClick={openCart}
                                className="relative p-2 text-gray-700 hover:text-primary transition-colors"
                            >
                                <ShoppingCart size={24} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-secondary text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </button>

                            {user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <User size={20} />
                                        <span className="text-sm font-medium">{user.email}</span>
                                    </button>

                                    <AnimatePresence>
                                        {showUserMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                                            >
                                                <Link
                                                    to="/admin"
                                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <Calendar className="mr-2" size={16} />
                                                    My Bookings
                                                </Link>
                                                <button
                                                    onClick={handleSignOut}
                                                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                                                >
                                                    <LogOut className="mr-2" size={16} />
                                                    Sign Out
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-primary hover:text-primary-light transition-colors font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary-light transition-colors font-medium"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="md:hidden border-t border-gray-200 py-4"
                            >
                                <nav className="flex flex-col space-y-4">
                                    {menuItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            className="text-gray-700 hover:text-primary transition-colors font-medium"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}

                                    {/* Mobile Cart Button */}
                                    <button
                                        onClick={() => {
                                            openCart()
                                            setIsOpen(false)
                                        }}
                                        className="flex items-center text-gray-700 hover:text-primary transition-colors font-medium"
                                    >
                                        <ShoppingCart className="mr-2" size={16} />
                                        Cart ({totalItems})
                                    </button>

                                    {user ? (
                                        <>
                                            <Link
                                                to="/admin"
                                                className="text-gray-700 hover:text-primary transition-colors font-medium"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                My Account
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleSignOut()
                                                    setIsOpen(false)
                                                }}
                                                className="text-left text-gray-700 hover:text-primary transition-colors font-medium"
                                            >
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                className="text-gray-700 hover:text-primary transition-colors font-medium"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/signup"
                                                className="text-gray-700 hover:text-primary transition-colors font-medium"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Sign Up
                                            </Link>
                                        </>
                                    )}
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>
            <CartDrawer />
        </>
    )
}

export default Header
