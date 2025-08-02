import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Package, Star } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'

const ProductCard = ({ product, index }) => {
    const { addToCart } = useCart()

    const handleAddToCart = () => {
        addToCart(product)
    }

    const getCategoryColor = (category) => {
        const colors = {
            feed: 'bg-green-100 text-green-800',
            equipment: 'bg-blue-100 text-blue-800',
            clothing: 'bg-purple-100 text-purple-800',
            care: 'bg-pink-100 text-pink-800',
            accessories: 'bg-yellow-100 text-yellow-800'
        }
        return colors[category] || 'bg-gray-100 text-gray-800'
    }

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'feed': return '🌾'
            case 'equipment': return '🏇'
            case 'clothing': return '👕'
            case 'care': return '🧽'
            case 'accessories': return '🎒'
            default: return '📦'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
        >
            <div className="relative overflow-hidden">
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=300&fit=crop'
                    }}
                />
                <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
                        <span className="mr-1">{getCategoryIcon(product.category)}</span>
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </span>
                </div>
                {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                    <div className="absolute top-3 right-3">
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                            Low Stock
                        </span>
                    </div>
                )}
                {product.stock_quantity === 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-lg font-semibold">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {product.description}
                </p>

                <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={16} className="fill-current" />
                        ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div>
                        <span className="text-2xl font-bold text-primary">
                            R{parseFloat(product.price).toFixed(2)}
                        </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <Package size={14} className="mr-1" />
                        <span>{product.stock_quantity} in stock</span>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: product.stock_quantity > 0 ? 1.02 : 1 }}
                    whileTap={{ scale: product.stock_quantity > 0 ? 0.98 : 1 }}
                    onClick={handleAddToCart}
                    disabled={product.stock_quantity === 0}
                    className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all
            ${product.stock_quantity > 0
                            ? 'bg-primary text-black hover:bg-primary-light shadow-lg hover:shadow-xl'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <ShoppingCart size={18} />
                    <span>{product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                </motion.button>
            </div>
        </motion.div>
    )
}

export default ProductCard
