import emailjs from '@emailjs/browser'
import { supabase } from './supabase'

const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY

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

        // Prepare email template parameters
        const templateParams = {
            to_email: 'tessa.engelbrecht@gmail.com',
            customer_name: `${userInfo.name} ${userInfo.surname}`,
            customer_email: userInfo.email,
            customer_phone: userInfo.contact_number,
            order_items: itemsList,
            total_amount: `R${orderData.total.toFixed(2)}`,
            pickup_location: orderData.pickup_location || 'Meadowbrook Equestrian',
            order_date: new Date().toLocaleString(),
            payment_proof_url: paymentProofUrl || 'No payment proof uploaded',
            ai_verification_summary: verificationSummary,
            ai_verification_details: verificationDetails,
            order_id: orderId || 'Pending'
        }

        // Send email
        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY
        )

        console.log('Email sent successfully:', response)
        return { success: true, response }
    } catch (error) {
        console.error('Error sending email:', error)
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
            customer_name: `${userInfo.name} ${userInfo.surname}`,
            customer_email: userInfo.email,
            customer_phone: userInfo.contact_number,
            lesson_type: bookingData.lessonType.name,
            lesson_date: bookingData.selectedDate,
            lesson_time: `${bookingData.selectedSlot.start_time} - ${bookingData.selectedSlot.end_time}`,
            weeks_booked: bookingData.weeksBooked || 1,
            total_amount: `R${bookingData.total.toFixed(2)}`,
            ai_verification_summary: verificationSummary,
            booking_id: bookingId || 'Pending'
        }

        const response = await emailjs.send(
            SERVICE_ID,
            'template_lesson_booking', // You'll need to create this template in EmailJS
            templateParams,
            PUBLIC_KEY
        )

        return { success: true, response }
    } catch (error) {
        console.error('Error sending lesson booking email:', error)
        return { success: false, error }
    }
}

export const sendCustomerConfirmationEmail = async (orderData, userInfo, orderId, orderStatus) => {
    try {
        const templateParams = {
            to_email: userInfo.email,
            customer_name: `${userInfo.name} ${userInfo.surname}`,
            order_id: orderId,
            order_status: orderStatus,
            total_amount: `R${orderData.total.toFixed(2)}`,
            order_date: new Date().toLocaleString()
        }

        const response = await emailjs.send(
            SERVICE_ID,
            'template_customer_confirmation', // You'll need to create this template
            templateParams,
            PUBLIC_KEY
        )

        return { success: true, response }
    } catch (error) {
        console.error('Error sending customer confirmation email:', error)
        return { success: false, error }
    }
}
