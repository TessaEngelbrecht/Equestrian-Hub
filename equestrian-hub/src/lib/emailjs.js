import emailjs from '@emailjs/browser'
import { supabase } from './supabase'

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY

// Universal email sending function
const sendUniversalEmail = async (templateParams) => {
    try {
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY
        )
        //('Email sent successfully:', response)
        return { success: true, response }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error }
    }
}

export const sendOrderEmail = async (orderData, userInfo, orderId, verificationResult = null) => {
    try {
        // Get payment proof URL if available
        let paymentProofUrl = null
        if (orderId) {
            const { data: order } = await supabase
                .from('orders')
                .select('payment_proof_url, verification_result')
                .eq('id', orderId)
                .single()

            if (order && order.payment_proof_url) {
                paymentProofUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/payment-proofs/${order.payment_proof_url}`
            }

            // Use verification result from database if not provided
            if (!verificationResult && order.verification_result) {
                try {
                    verificationResult = JSON.parse(order.verification_result)
                } catch (e) {
                    console.error('Error parsing verification result:', e)
                }
            }
        }

        // Process verification data
        let verificationSummary = 'No AI verification performed'
        let verificationDetails = ''

        if (verificationResult && verificationResult.success && verificationResult.verification) {
            const v = verificationResult.verification
            const confidence = v.confidence || 0
            const isValid = v.isValid && v.amountMatches

            if (isValid && confidence >= 70) {
                verificationSummary = `✅ AI VERIFIED (${confidence}% confidence)`
            } else if (confidence >= 50) {
                verificationSummary = `⚠️ LOW CONFIDENCE (${confidence}% confidence)`
            } else {
                verificationSummary = `❌ VERIFICATION FAILED (${confidence}% confidence)`
            }

            verificationDetails = `
AI Verification Details:
• Payment Proof Valid: ${v.isPaymentProof ? 'Yes' : 'No'}
• Amount Matches: ${v.amountMatches ? 'Yes' : 'No'}
• Detected Amount: R${v.detectedAmount || 'Not detected'}
• Bank Name: ${v.bankName || 'Not detected'}
• Document Type: ${v.documentType || 'Unknown'}
• Confidence Score: ${confidence}%
${v.issues && v.issues.length > 0 ? `• Issues Found: ${v.issues.join(', ')}` : ''}
            `.trim()
        }

        // Format order items
        const itemsList = orderData.items ? orderData.items.map(item =>
            `• ${item.name} × ${item.quantity} - R${(item.price * item.quantity).toFixed(2)}`
        ).join('\n') : 'No items'

        // Prepare email template parameters for ORDER
        const templateParams = {
            to_email: 'tessa.engelbrecht@gmail.com',
            email_type: 'New Order Received',
            subject_line: `Order #${orderId?.slice(0, 8) || 'Pending'}`,
            customer_name: `${userInfo.name} ${userInfo.surname}`,
            customer_email: userInfo.email,
            customer_phone: userInfo.contact_number,
            // Order-specific fields
            order_items: itemsList,
            total_amount: `R${orderData.total.toFixed(2)}`,
            pickup_location: orderData.pickup_location || 'Meadowbrook Equestrian',
            order_date: new Date().toLocaleString(),
            payment_proof_url: paymentProofUrl || 'No payment proof uploaded',
            ai_verification_summary: verificationSummary,
            ai_verification_details: verificationDetails,
            order_id: orderId || 'Pending',
            // Empty other fields
            lesson_type: '',
            lesson_date: '',
            lesson_time: '',
            weeks_booked: '',
            booking_id: '',
            contact_message: '',
            subject: '',
            date: ''
        }

        return await sendUniversalEmail(templateParams)
    } catch (error) {
        console.error('Error sending order email:', error)
        return { success: false, error }
    }
}

export const sendLessonBookingEmail = async (bookingData, userInfo, bookingId, verificationResult = null) => {
    try {
        // Process verification data for lesson booking
        let verificationSummary = 'No AI verification performed'

        if (verificationResult && verificationResult.success && verificationResult.verification) {
            const v = verificationResult.verification
            const confidence = v.confidence || 0
            const isValid = v.isValid && v.amountMatches

            if (isValid && confidence >= 70) {
                verificationSummary = `✅ AI VERIFIED (${confidence}% confidence)`
            } else if (confidence >= 50) {
                verificationSummary = `⚠️ LOW CONFIDENCE (${confidence}% confidence)`
            } else {
                verificationSummary = `❌ VERIFICATION FAILED (${confidence}% confidence)`
            }
        }

        const templateParams = {
            to_email: 'tessa.engelbrecht@gmail.com',
            email_type: 'New Lesson Booking',
            subject_line: `Booking #${bookingId?.slice(0, 8) || 'Pending'}`,
            customer_name: `${userInfo.name} ${userInfo.surname}`,
            customer_email: userInfo.email,
            customer_phone: userInfo.contact_number,
            // Lesson-specific fields
            lesson_type: bookingData.lessonType.name,
            lesson_date: bookingData.selectedDate,
            lesson_time: `${bookingData.selectedSlot.start_time} - ${bookingData.selectedSlot.end_time}`,
            weeks_booked: bookingData.weeksBooked || 1,
            total_amount: `R${bookingData.total.toFixed(2)}`,
            ai_verification_summary: verificationSummary,
            booking_id: bookingId || 'Pending',
            // Empty other fields
            order_items: '',
            pickup_location: '',
            order_date: '',
            payment_proof_url: '',
            ai_verification_details: '',
            order_id: '',
            contact_message: '',
            subject: '',
            date: ''
        }

        return await sendUniversalEmail(templateParams)
    } catch (error) {
        console.error('Error sending lesson booking email:', error)
        return { success: false, error }
    }
}

export const sendContactEmail = async (formData) => {
    try {
        const templateParams = {
            to_email: 'tessa.engelbrecht@gmail.com',
            email_type: 'Contact Form Submission',
            subject_line: formData.subject,
            customer_name: formData.name,
            customer_email: formData.email,
            customer_phone: formData.phone || 'Not provided',
            // Contact-specific fields
            contact_message: formData.message,
            subject: formData.subject,
            date: new Date().toLocaleString(),
            // Empty other fields
            order_items: '',
            total_amount: '',
            pickup_location: '',
            order_date: '',
            payment_proof_url: '',
            ai_verification_summary: '',
            ai_verification_details: '',
            order_id: '',
            lesson_type: '',
            lesson_date: '',
            lesson_time: '',
            weeks_booked: '',
            booking_id: ''
        }

        return await sendUniversalEmail(templateParams)
    } catch (error) {
        console.error('Error sending contact email:', error)
        return { success: false, error }
    }
}

export const sendCustomerConfirmationEmail = async (orderData, userInfo, orderId, orderStatus) => {
    try {
        const templateParams = {
            to_email: userInfo.email,
            email_type: 'Order Confirmation',
            subject_line: `Your Order #${orderId?.slice(0, 8)} - ${orderStatus}`,
            customer_name: `${userInfo.name} ${userInfo.surname}`,
            customer_email: userInfo.email,
            customer_phone: userInfo.contact_number,
            order_id: orderId,
            order_date: new Date().toLocaleString(),
            total_amount: `R${orderData.total.toFixed(2)}`,
            // Empty other fields as needed
            order_items: '',
            pickup_location: '',
            payment_proof_url: '',
            ai_verification_summary: '',
            ai_verification_details: '',
            lesson_type: '',
            lesson_date: '',
            lesson_time: '',
            weeks_booked: '',
            booking_id: '',
            contact_message: '',
            subject: '',
            date: ''
        }

        return await sendUniversalEmail(templateParams)
    } catch (error) {
        console.error('Error sending customer confirmation email:', error)
        return { success: false, error }
    }
}
