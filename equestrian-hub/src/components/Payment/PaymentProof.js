import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle, AlertTriangle, X, Eye } from 'lucide-react'

const PaymentProof = ({ onFileSelect, verificationResult, isVerifying }) => {
    const [dragActive, setDragActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [preview, setPreview] = useState(null)

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0])
        }
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0])
        }
    }

    const handleFileSelection = (file) => {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            alert('File size must be less than 10MB')
            return
        }

        if (!['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type)) {
            alert('Please upload a PDF or image file (JPG, PNG)')
            return
        }

        setSelectedFile(file)
        onFileSelect(file)

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => setPreview(e.target.result)
            reader.readAsDataURL(file)
        } else {
            setPreview(null)
        }
    }

    const removeFile = () => {
        setSelectedFile(null)
        setPreview(null)
        onFileSelect(null)
    }

    const getVerificationIcon = () => {
        if (!verificationResult) return null

        if (verificationResult.success && verificationResult.verification?.isValid && verificationResult.verification?.amountMatches) {
            return <CheckCircle className="text-green-500" size={24} />
        } else {
            return <AlertTriangle className="text-orange-500" size={24} />
        }
    }

    const getVerificationMessage = () => {
        if (!verificationResult) return null

        if (verificationResult.success && verificationResult.verification) {
            const { isValid, amountMatches, confidence, detectedAmount } = verificationResult.verification

            if (isValid && amountMatches) {
                return (
                    <div className="text-green-700 text-sm">
                        ✅ Payment verified! Amount: R{detectedAmount} (Confidence: {confidence}%)
                    </div>
                )
            } else if (isValid && !amountMatches) {
                return (
                    <div className="text-orange-700 text-sm">
                        ⚠️ Payment proof detected but amount doesn't match. Expected vs Detected: R{detectedAmount}
                    </div>
                )
            } else {
                return (
                    <div className="text-red-700 text-sm">
                        ❌ Document doesn't appear to be a valid payment proof
                    </div>
                )
            }
        } else {
            return (
                <div className="text-red-700 text-sm">
                    ❌ Verification failed. Please try again or upload a different image.
                </div>
            )
        }
    }

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            {!selectedFile && (
                <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all
            ${dragActive
                            ? 'border-primary bg-primary bg-opacity-5'
                            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Upload Payment Proof
                    </h3>
                    <p className="text-gray-600 mb-4">
                        Drag and drop your payment proof here, or click to browse
                    </p>
                    <div className="text-sm text-gray-500">
                        Supports: JPG, PNG, PDF (Max 10MB)
                    </div>
                </div>
            )}

            {/* Selected File Display */}
            <AnimatePresence>
                {selectedFile && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white border border-gray-200 rounded-xl p-4"
                    >
                        <div className="flex items-start space-x-4">
                            {/* Preview */}
                            <div className="flex-shrink-0">
                                {preview ? (
                                    <div className="relative">
                                        <img
                                            src={preview}
                                            alt="Payment proof preview"
                                            className="w-20 h-20 object-cover rounded-lg border"
                                        />
                                        <button
                                            onClick={() => window.open(preview, '_blank')}
                                            className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 rounded-lg flex items-center justify-center transition-all"
                                        >
                                            <Eye className="text-white opacity-0 hover:opacity-100" size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <FileText className="text-gray-400" size={24} />
                                    </div>
                                )}
                            </div>

                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {selectedFile.name}
                                    </h4>
                                    <button
                                        onClick={removeFile}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>

                                {/* Verification Status */}
                                {isVerifying && (
                                    <div className="flex items-center space-x-2 mt-3">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
                                        />
                                        <span className="text-sm text-gray-600">Verifying payment proof...</span>
                                    </div>
                                )}

                                {verificationResult && !isVerifying && (
                                    <div className="flex items-start space-x-2 mt-3">
                                        {getVerificationIcon()}
                                        <div className="flex-1">
                                            {getVerificationMessage()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Upload Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                    <FileText className="mr-2" size={16} />
                    Payment Proof Guidelines
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Upload a clear photo or screenshot of your payment confirmation</li>
                    <li>• Ensure the amount, date, and reference number are visible</li>
                    <li>• Bank transfer receipts, EFT confirmations, or payment app screenshots are accepted</li>
                    <li>• Our AI will automatically verify your payment details</li>
                </ul>
            </div>
        </div>
    )
}

export default PaymentProof
