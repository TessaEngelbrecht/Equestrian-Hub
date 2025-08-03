import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { AdminProvider } from './contexts/AdminContext'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import LessonsPage from './pages/LessonsPage'
import BookingPage from './pages/BookingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import PaymentPage from './pages/PaymentPage'
import AdminPage from './pages/AdminPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import MyBookingsPage from './pages/MyBookingsPage'
import MyOrderPage from './pages/MyOrdersPage'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AdminProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/lessons" element={<LessonsPage />} />
                <Route path="/book-lesson" element={<BookingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/admin/*" element={<AdminPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
                <Route path="/my-orders" element={<MyOrderPage />} />
              </Routes>
            </div>
          </Router>
        </AdminProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
