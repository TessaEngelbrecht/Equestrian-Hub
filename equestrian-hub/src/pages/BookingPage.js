import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { Calendar, Clock, CreditCard, ArrowLeft, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import BookingCalendar from '../components/Lessons/BookingCalendar'
import TimeSlotPicker from '../components/Lessons/TimeSlotPicker'

const BookingPage = () => {
    const { state } = useLocation()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [weeksBooked, setWeeksBooked] = useState(1)
    const [totalAmount, setTotalAmount] = useState(0)

    const lessonType = state?.lessonType

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { redirect: '/book-lesson', lessonType } })
            return
        }

        if (!lessonType) {
            navigate('/lessons')
            return
        }
    }, [user, lessonType, navigate])

    useEffect(() => {
        if (lessonType && weeksBooked) {
            const pricePerLesson = parseFloat(lessonType.price_per_hour) * (lessonType.duration_minutes / 60)
            setTotalAmount(pricePerLesson * weeksBooked)
        }
    }, [lessonType, weeksBooked])

    const handleDateSelect = (date) => {
        setSelectedDate(date)
        setSelectedSlot(null) // Reset slot when date changes
        if (currentStep === 1) {
            setCurrentStep(2)
        }
    }

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot)
    }

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        } else {
            navigate('/lessons')
        }
    }

    const handleProceedToPayment = () => {
        const bookingData = {
            lessonType,
            selectedDate: format(selectedDate, 'yyyy-MM-dd'),
            selectedSlot,
            weeksBooked,
            total: totalAmount
        }

        navigate('/payment', {
            state: {
                bookingData,
                type: 'lesson'
            }
        })
    }

    const canProceedToNext = () => {
        if (currentStep === 1) return selectedDate
        if (currentStep === 2) return selectedSlot
        if (currentStep === 3) return weeksBooked > 0
        return false
    }

    if (!lessonType) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-green-50 to-pink-100">
                <Header />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h2>
                        <button
                            onClick={() => navigate('/lessons')}
                            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-light transition-colors"
                        >
                            Back to Lessons
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const steps = [
        { number: 1, title: 'Select Date', icon: Calendar },
        { number: 2, title: 'Choose Time', icon: Clock },
        { number: 3, title: 'Confirm Details', icon: CreditCard }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-green-50 to-pink-100">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
                        Book Your Lesson
                    </h1>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        Complete your booking for <span className="font-semibold text-primary">{lessonType.name}</span>
                    </p>
                </motion.div>

                {/* Progress Steps */}
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                  ${currentStep >= step.number
                                        ? 'bg-primary border-primary text-white'
                                        : 'bg-white border-gray-300 text-gray-400'
                                    }`}>
                                    <step.icon size={18} />
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-full h-0.5 mx-4 
                    ${currentStep > step.number ? 'bg-primary' : 'bg-gray-300'}
                  `} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2">
                        {steps.map(step => (
                            <div key={step.number} className="text-center flex-1">
                                <p className={`text-sm font-medium 
                  ${currentStep >= step.number ? 'text-primary' : 'text-gray-500'}
                `}>
                                    {step.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                            >
                                <BookingCalendar
                                    selectedDate={selectedDate}
                                    onDateSelect={handleDateSelect}
                                    lessonType={lessonType}
                                />
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                            >
                                <TimeSlotPicker
                                    selectedDate={selectedDate}
                                    lessonType={lessonType}
                                    onSlotSelect={handleSlotSelect}
                                    selectedSlot={selectedSlot}
                                />
                            </motion.div>
                        )}

                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="space-y-6"
                            >
                                {/* Booking Summary */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Booking Summary</h3>

                                    <div className="space-y-4">
                                        <div className="flex justify-between py-3 border-b">
                                            <span className="text-gray-600">Lesson Type</span>
                                            <span className="font-medium">{lessonType.name}</span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b">
                                            <span className="text-gray-600">Date</span>
                                            <span className="font-medium">
                                                {selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b">
                                            <span className="text-gray-600">Time</span>
                                            <span className="font-medium">
                                                {selectedSlot && `${selectedSlot.start_time} - ${selectedSlot.end_time}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-3 border-b">
                                            <span className="text-gray-600">Duration</span>
                                            <span className="font-medium">{lessonType.duration_minutes} minutes</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Weekly Booking Options */}
                                <div className="bg-white rounded-xl shadow-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        How many weeks would you like to book?
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Book multiple weeks in advance for the same time slot and get consistency in your training.
                                    </p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[1, 2, 4, 8].map(weeks => (
                                            <button
                                                key={weeks}
                                                onClick={() => setWeeksBooked(weeks)}
                                                className={`p-4 rounded-lg border-2 text-center transition-all
                          ${weeksBooked === weeks
                                                        ? 'border-primary bg-primary text-white'
                                                        : 'border-gray-200 hover:border-primary'
                                                    }`}
                                            >
                                                <div className="font-semibold">{weeks} Week{weeks > 1 ? 's' : ''}</div>
                                                <div className="text-sm mt-1 opacity-75">
                                                    {weeks === 1 ? 'Single lesson' :
                                                        weeks === 2 ? 'Bi-weekly' :
                                                            weeks === 4 ? 'Monthly' : 'Long-term'}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-green-800 font-semibold">Total Amount</span>
                                                <div className="text-sm text-green-600">
                                                    R{lessonType.price_per_hour}/hour × {weeksBooked} week{weeksBooked > 1 ? 's' : ''}
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-green-800">
                                                R{totalAmount.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleBack}
                            className="flex items-center space-x-2 px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft size={18} />
                            <span>Back</span>
                        </motion.button>

                        {currentStep < 3 ? (
                            <motion.button
                                whileHover={{ scale: canProceedToNext() ? 1.02 : 1 }}
                                whileTap={{ scale: canProceedToNext() ? 0.98 : 1 }}
                                onClick={handleNext}
                                disabled={!canProceedToNext()}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all
                  ${canProceedToNext()
                                        ? 'bg-primary text-white hover:bg-primary-light shadow-lg'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <span>Next</span>
                                <ArrowRight size={18} />
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleProceedToPayment}
                                className="flex items-center space-x-2 px-8 py-3 bg-primary text-black rounded-lg font-semibold hover:bg-primary-light transition-all shadow-lg"
                            >
                                <CreditCard size={18} />
                                <span>Proceed to Payment</span>
                            </motion.button>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default BookingPage
