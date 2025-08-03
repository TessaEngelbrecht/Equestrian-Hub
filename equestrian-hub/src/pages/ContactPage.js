import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, AlertCircle } from 'lucide-react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import { sendContactEmail } from '../lib/emailjs'

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        // Clear error when user starts typing
        if (error) setError('')
    }

    const validateForm = () => {
        if (!formData.name.trim()) return 'Please enter your name'
        if (!formData.email.trim()) return 'Please enter your email'
        if (!formData.subject) return 'Please select a subject'
        if (!formData.message.trim()) return 'Please enter your message'

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) return 'Please enter a valid email address'

        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        // Validate form
        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            setLoading(false)
            return
        }

        try {
            const result = await sendContactEmail(formData)

            if (result.success) {
                setSuccess(true)
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                })

                // Auto-hide success message after 10 seconds
                setTimeout(() => {
                    setSuccess(false)
                }, 10000)
            } else {
                setError('Failed to send message. Please try again or contact us directly.')
            }
        } catch (err) {
            console.error('Contact form error:', err)
            setError('An error occurred. Please try again later or contact us directly.')
        } finally {
            setLoading(false)
        }
    }

    const contactInfo = [
        {
            icon: MapPin,
            title: 'Visit Us',
            details: [
                '123 Country Lane',
                'Meadowbrook, Gauteng 1234',
                'South Africa'
            ]
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: [
                '+27 12 345 6789',
                '+27 82 123 4567',
                'WhatsApp Available'
            ]
        },
        {
            icon: Mail,
            title: 'Email Us',
            details: [
                'tessa.engelbrecht@gmail.com',
                'lessons@meadowbrookequestrian.com',
                'shop@meadowbrookequestrian.com'
            ]
        },
        {
            icon: Clock,
            title: 'Opening Hours',
            details: [
                'Mon - Fri: 7:00 AM - 6:00 PM',
                'Saturday: 7:00 AM - 5:00 PM',
                'Sunday: 8:00 AM - 4:00 PM'
            ]
        }
    ]

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
                        className="text-4xl md:text-5xl font-display font-bold text-primary mb-4"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        Get In Touch
                    </motion.h1>

                    <motion.p
                        className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-xl p-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <h2 className="text-2xl font-display font-bold text-primary mb-6">Send Us a Message</h2>

                        {/* Success Message */}
                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6"
                                >
                                    <div className="flex items-center">
                                        <Send className="mr-2 flex-shrink-0" size={18} />
                                        <div>
                                            <p className="font-medium">Message sent successfully!</p>
                                            <p className="text-sm mt-1">We'll get back to you as soon as possible.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6"
                                >
                                    <div className="flex items-center">
                                        <AlertCircle className="mr-2 flex-shrink-0" size={18} />
                                        <span>{error}</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                        placeholder="+27 12 345 6789"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="Riding Lessons">Riding Lessons</option>
                                        <option value="Product Inquiry">Product Inquiry</option>
                                        <option value="Facility Tour">Facility Tour</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="General Question">General Question</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={6}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                                    placeholder="Tell us how we can help you..."
                                />
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2
                  ${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-primary hover:bg-primary-light shadow-lg hover:shadow-xl'
                                    } text-white`}
                            >
                                {loading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={info.title}
                                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="bg-primary-100 p-3 rounded-full">
                                        <info.icon className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                                        {info.details.map((detail, i) => (
                                            <p key={i} className="text-gray-600 text-sm">{detail}</p>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Quick Contact */}
                        <motion.div
                            className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg p-6 text-white"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.4, duration: 0.6 }}
                        >
                            <MessageSquare className="mb-4" size={32} />
                            <h3 className="text-xl font-bold mb-2">Need Immediate Help?</h3>
                            <p className="text-sm mb-4">
                                For urgent matters or immediate assistance, don't hesitate to call us directly during business hours.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <a
                                    href="tel:+27123456789"
                                    className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-center hover:bg-gray-100 transition-colors"
                                >
                                    Call Now
                                </a>
                                <a
                                    href="https://wa.me/27821234567"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-opacity-30 transition-colors"
                                >
                                    WhatsApp
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Map Section */}
                <motion.section
                    className="mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 0.8 }}
                >
                    <h2 className="text-3xl font-display font-bold text-primary text-center mb-8">Find Us</h2>
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="aspect-w-16 aspect-h-9">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3589.144!2d28.0473!3d-26.2041!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDEyJzE0LjgiUyAyOMKwMDInNTAuMyJF!5e0!3m2!1sen!2sza!4v1234567890"
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Meadowbrook Equestrian Location"
                            ></iframe>
                        </div>
                        <div className="p-6 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Meadowbrook Equestrian</h3>
                                    <p className="text-gray-600 text-sm">123 Country Lane, Meadowbrook, Gauteng 1234</p>
                                </div>
                                <a
                                    href="https://goo.gl/maps/your-location-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-light transition-colors"
                                >
                                    Get Directions
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </main>

            <Footer />
        </div>
    )
}

export default ContactPage
