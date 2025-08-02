import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'

const CartItem = ({ item, index }) => {
    const { updateQuantity, removeFromCart } = useCart()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            layout
            className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
            <img
                src={item.product.image_url}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=100&h=100&fit=crop'
                }}
            />

            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                    {item.product.name}
                </h4>
                <p className="text-sm text-gray-600">
                    R{parseFloat(item.product.price).toFixed(2)} each
                </p>
                <p className="text-xs text-gray-500 truncate">
                    {item.product.description}
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    disabled={item.quantity <= 1}
                >
                    <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">
                    {item.quantity}
                </span>
                <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                    <Plus size={16} />
                </button>
            </div>

            <div className="text-right">
                <p className="font-semibold text-gray-900">
                    R{(item.product.price * item.quantity).toFixed(2)}
                </p>
                <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 hover:text-red-700 transition-colors mt-1"
                    title="Remove from cart"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </motion.div>
    )
}

export default CartItem
