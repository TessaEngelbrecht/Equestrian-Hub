import { GoogleGenerativeAI } from '@google/generative-ai'

// Check if API key is available
if (!process.env.REACT_APP_GEMINI_API_KEY) {
    console.error('Gemini API key not found. Please add REACT_APP_GEMINI_API_KEY to your .env file')
}

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY)

export const verifyPaymentProof = async (file, expectedAmount, expectedReference = '') => {
    try {
        //console.log('Starting AI verification for amount:', expectedAmount)

        if (!file) {
            throw new Error('No file provided for verification')
        }

        // Convert file to base64
        const base64Data = await fileToBase64(file)

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        const prompt = `
    Analyze this payment proof image and extract the following information:
    
    Expected payment amount: R${expectedAmount}
    Expected reference (if any): ${expectedReference}
    
    Please provide a JSON response with the following structure:
    {
      "isPaymentProof": boolean,
      "detectedAmount": number or null,
      "amountMatches": boolean,
      "bankName": string or null,
      "transactionDate": string or null,
      "referenceNumber": string or null,
      "referenceMatches": boolean,
      "confidence": number (0-100),
      "documentType": string,
      "isValid": boolean,
      "issues": array of strings describing any problems found
    }
    
    Look for:
    - Payment confirmation screens
    - Bank transfer receipts
    - EFT confirmations
    - Mobile banking screenshots
    - Any document showing a financial transaction
    
    The document should clearly show:
    - Transaction amount
    - Bank or payment service name
    - Date and time
    - Reference or transaction number
    - Confirmation that payment was successful
    
    Be strict about amount matching - it must be exactly R${expectedAmount}.
    Confidence should be high (80-100) only if all details are clearly visible and correct.
    `

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: file.type
                }
            }
        ])

        const response = await result.response
        const text = response.text()

       // console.log('AI Response:', text)

        // Parse the JSON response
        let verification
        try {
            // Extract JSON from the response (sometimes AI includes extra text)
            const jsonMatch = text.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
                verification = JSON.parse(jsonMatch[0])
            } else {
                throw new Error('No JSON found in response')
            }
        } catch (parseError) {
            console.error('Error parsing AI response:', parseError)
            throw new Error('Invalid response format from AI verification')
        }

        // Validate and normalize the response
        const normalizedVerification = {
            isPaymentProof: Boolean(verification.isPaymentProof),
            detectedAmount: verification.detectedAmount ? Number(verification.detectedAmount) : null,
            amountMatches: Boolean(verification.amountMatches),
            bankName: verification.bankName || null,
            transactionDate: verification.transactionDate || null,
            referenceNumber: verification.referenceNumber || null,
            referenceMatches: Boolean(verification.referenceMatches),
            confidence: Math.min(100, Math.max(0, Number(verification.confidence) || 0)),
            documentType: verification.documentType || 'Unknown',
            isValid: Boolean(verification.isValid),
            issues: Array.isArray(verification.issues) ? verification.issues : []
        }

       // console.log('Normalized verification:', normalizedVerification)

        return {
            success: true,
            verification: normalizedVerification
        }

    } catch (error) {
        console.error('Error verifying payment proof:', error)
        return {
            success: false,
            error: error.message,
            verification: null
        }
    }
}

// Helper function to convert file to base64
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const base64 = reader.result.split(',')[1]
            resolve(base64)
        }
        reader.onerror = error => reject(error)
    })
}

export const getVerificationSummary = (verification) => {
    if (!verification) return 'Verification failed'

    const { isValid, isPaymentProof, amountMatches, confidence } = verification

    if (isValid && isPaymentProof && amountMatches && confidence >= 70) {
        return 'Payment proof verified successfully ✅'
    } else if (isPaymentProof && amountMatches) {
        return 'Payment proof appears valid but with some concerns ⚠️'
    } else if (isPaymentProof && !amountMatches) {
        return 'Payment proof detected but amount mismatch ❌'
    } else if (!isPaymentProof) {
        return 'Document does not appear to be a payment proof ❌'
    } else {
        return 'Payment proof verification inconclusive ⚠️'
    }
}
