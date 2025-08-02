import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { CreditCard, CheckCircle, AlertTriangle, ArrowLeft, ShoppingBag, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { supabase } from '../lib/supabase'
import { sendOrderEmail, sendLessonBookingEmail } from '../lib/emailjs'
import { verifyPaymentProof } from '../lib/paymentVerification'
import Header from '../components/Layout/Header'
import PaymentProof from '../components/Payment/PaymentProof'

const PaymentPage = () => {
    const { state } = useLocation()
    const navigate = useNavigate()
    const { user } = useAuth()
    const { cartItems, clearCart } = useCart()

    const [paymentFile, setPaymentFile] = useState(null)
    const [verificationResult, setVerificationResult] = useState(null)
    const [isVerifying, setIsVerifying] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [orderComplete, setOrderComplete] = useState(false)
    const [orderId, setOrderId] = useState(null)

    const bookingData = state?.bookingData
    const orderData = state?.orderData
    const type = state?.type // 'lesson' or 'shop'

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        if (!bookingData && !orderData && cartItems.length === 0) {
            navigate('/')
            return
        }
    }, [user, bookingData, orderData, cartItems, navigate])

    // Auto-verify payment when file is selected
    useEffect(() => {
        if (paymentFile && !isVerifying) {
            handleVerifyPayment()
        }
    }, [paymentFile])

    const handleVerifyPayment = async () => {
        if (!paymentFile) return

        setIsVerifying(true)
        try {
            const expectedAmount = getExpectedAmount()
            const result = await verifyPaymentProof(paymentFile, expectedAmount)
            setVerificationResult(result)
        } catch (error) {
            console.error('Error verifying payment:', error)
        } finally {
            setIsVerifying(false)
        }
    }

    const getExpectedAmount = () => {
        if (bookingData) {
            return bookingData.total
        } else if (orderData) {
            return orderData.total
        } else {
            return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
        }
    }

    const uploadPaymentProof = async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}_${Date.now()}.${fileExt}`

        const { error } = await supabase.storage
            .from('payment-proofs')
            .upload(fileName, file)

        if (error) throw error
        return fileName
    }

    const handleProcessPayment = async () => {
        if (!paymentFile) {
            alert('Please upload your payment proof first')
            return
        }

        setIsProcessing(true)
        try {
            // Upload payment proof file
            const paymentProofUrl = await uploadPaymentProof(paymentFile)

            let newOrderId = null
            let userInfo = {
                name: user.user_metadata?.name || '',
                surname: user.user_metadata?.surname || '',
                email: user.email,
                contact_number: user.user_metadata?.contact_number || ''
            }

            if (type === 'lesson' && bookingData) {
                // Create lesson booking
                const { data, error } = await supabase
                    .from('lesson_bookings')
                    .insert({
                        user_id: user.id,
                        lesson_type_id: bookingData.lessonType.id,
                        booking_date: bookingData.selectedDate,
                        start_time: bookingData.selectedSlot.start_time,
                        end_time: bookingData.selectedSlot.end_time,
                        weeks_booked: bookingData.weeksBooked,
                        total_amount: bookingData.total,
                        payment_proof_url: paymentProofUrl,
                        verification_result: JSON.stringify(verificationResult),
                        status: 'pending'
                    })
                    .select()
                    .single()

                if (error) throw error
                newOrderId = data.id

                // Send booking email
                await sendLessonBookingEmail(bookingData, userInfo, newOrderId, verificationResult)

            } else {
                // Create shop order
                const items = orderData?.items || cartItems.map(item => ({
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity
                }))

                const totalAmount = getExpectedAmount()

                // Create order
                const { data: order, error: orderError } = await supabase
                    .from('orders')
                    .insert({
                        user_id: user.id,
                        total_amount: totalAmount,
                        payment_proof_url: paymentProofUrl,
                        verification_result: JSON.stringify(verificationResult),
                        status: 'pending'
                    })
                    .select()
                    .single()

                if (orderError) throw orderError
                newOrderId = order.id

                // Create order items
                const orderItems = items.map(item => ({
                    order_id: newOrderId,
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))

                const { error: itemsError } = await supabase
                    .from('order_items')
                    .insert(orderItems)

                if (itemsError) throw itemsError

                // Send order email
                const processedOrderData = {
                    items,
                    total: totalAmount,
                    pickup_location: orderData?.pickup_location || 'Meadowbrook Equestrian'
                }

                await sendOrderEmail(processedOrderData, userInfo, newOrderId, verificationResult)

                // Clear cart
                clearCart()
            }

            setOrderId(newOrderId)
            setOrderComplete(true)

        } catch (error) {
            console.error('Error processing payment:', error)
            alert('Error processing payment. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    const getOrderSummary = () => {
        if (bookingData) {
            return {
                title: 'Lesson Booking Summary',
                items: [{
                    name: bookingData.lessonType.name,
                    details: `${format(new Date(bookingData.selectedDate), 'EEEE, MMMM d, yyyy')} 
                   at ${bookingData.selectedSlot.start_time} - ${bookingData.selectedSlot.end_time}`,
                    quantity: bookingData.weeksBooked,
                    price: bookingData.total / bookingData.weeksBooked,
                    total: bookingData.total
                }],
                total: bookingData.total
            }
        } else {
            const items = orderData?.items || cartItems.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                total: item.product.price * item.quantity
            }))

            return {
                title: 'Order Summary',
                items,
                total: getExpectedAmount()
            }
        }
    }

    if (orderComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-green-50 to-pink-100">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <motion.div
                        className="max-w-2xl mx-auto text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <CheckCircle className="text-white" size={40} />
                            </motion.div>

                            <h1 className="text-3xl font-display font-bold text-primary mb-4">
                                {type === 'lesson' ? 'Booking Confirmed!' : 'Order Placed!'}
                            </h1>

                            <p className="text-gray-600 mb-6">
                                Your {type === 'lesson' ? 'lesson booking' : 'order'} has been submitted successfully.
                                We'll verify your payment and send you a confirmation email shortly.
                            </p>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                                <p className="text-green-800 font-medium">
                                    Order ID: {orderId}
                                </p>
                                <p className="text-green-700 text-sm mt-1">
                                    {verificationResult?.success && verificationResult?.verification?.isValid
                                        ? '✅ Payment automatically verified by AI'
                                        : '⏳ Payment pending manual verification'
                                    }
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => navigate('/')}
                                    className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-light transition-colors"
                                >
                                    Back to Home
                                </button>
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    View My {type === 'lesson' ? 'Bookings' : 'Orders'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        )
    }

    const summary = getOrderSummary()

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-green-50 to-pink-100">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4 flex items-center justify-center">
                        <CreditCard className="mr-3" size={36} />
                        Complete Payment
                    </h1>
                    <p className="text-gray-700">
                        Upload your payment proof to complete your {type === 'lesson' ? 'booking' : 'order'}
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <motion.div
                        className="bg-white rounded-xl shadow-lg p-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            {type === 'lesson' ? <Calendar className="mr-2" /> : <ShoppingBag className="mr-2" />}
                            {summary.title}
                        </h2>

                        <div className="space-y-4">
                            {summary.items.map((item, index) => (
                                <div key={index} className="flex justify-between py-3 border-b border-gray-200">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                                        {item.details && (
                                            <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                                        )}
                                        {item.quantity > 1 && (
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity} × R{item.price?.toFixed(2)}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="font-medium">
                                            R{(item.total || item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between py-4 text-lg font-bold text-primary border-t-2 border-primary">
                                <span>Total Amount</span>
                                <span>R{summary.total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Payment Instructions */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Payment Instructions</h4>
                            <div className="text-sm text-blue-800 space-y-1">
                                <p>Bank: Standard Bank</p>
                                <p>Account: Meadowbrook Equestrian</p>
                                <p>Account Number: 123456789</p>
                                <p>Branch Code: 051001</p>
                                <p><strong>Reference: Your email address</strong></p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Payment Proof Upload */}
                    <motion.div
                        className="bg-white rounded-xl shadow-lg p-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                            Upload Payment Proof
                        </h2>

                        <PaymentProof
                            onFileSelect={setPaymentFile}
                            verificationResult={verificationResult}
                            isVerifying={isVerifying}
                        />

                        {/* Processing Button */}
                        <div className="mt-8">
                            <motion.button
                                onClick={handleProcessPayment}
                                disabled={!paymentFile || isProcessing}
                                whileHover={{ scale: !paymentFile || isProcessing ? 1 : 1.02 }}
                                whileTap={{ scale: !paymentFile || isProcessing ? 1 : 0.98 }}
                                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2
                  ${!paymentFile || isProcessing
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary text-white hover:bg-primary-light shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        <span>Complete {type === 'lesson' ? 'Booking' : 'Order'}</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Back Button */}
                <div className="max-w-4xl mx-auto mt-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>
                </div>
            </main>
        </div>
    )
}

export default PaymentPage
