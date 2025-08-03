import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Package,
    Plus,
    Edit,
    Trash2,
    Search,
    Filter,
    X
} from 'lucide-react'
import { useAdmin } from '../../contexts/AdminContext'

const ProductManagement = () => {
    const { getAllProducts, createProduct, updateProduct, deleteProduct } = useAdmin()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showProductModal, setShowProductModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')

    const [productForm, setProductForm] = useState({
        name: '',
        description: '',
        price: '',
        cost_price: '',
        category: 'feed',
        stock_quantity: '',
        image_url: '',
        active: true
    })

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        try {
            const data = await getAllProducts()
            setProducts(data)
        } catch (error) {
            console.error('Error loading products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, productForm)
            } else {
                await createProduct(productForm)
            }
            await loadProducts()
            resetForm()
        } catch (error) {
            console.error('Error saving product:', error)
        }
    }

    const handleEdit = (product) => {
        setEditingProduct(product)
        setProductForm({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            cost_price: product.cost_price.toString(),
            category: product.category,
            stock_quantity: product.stock_quantity.toString(),
            image_url: product.image_url,
            active: product.active
        })
        setShowProductModal(true)
    }

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId)
                await loadProducts()
            } catch (error) {
                console.error('Error deleting product:', error)
            }
        }
    }

    const resetForm = () => {
        setProductForm({
            name: '',
            description: '',
            price: '',
            cost_price: '',
            category: 'feed',
            stock_quantity: '',
            image_url: '',
            active: true
        })
        setEditingProduct(null)
        setShowProductModal(false)
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter

        return matchesSearch && matchesCategory
    })

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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
                <button
                    onClick={() => setShowProductModal(true)}
                    className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>

                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="all">All Categories</option>
                        <option value="feed">Feed</option>
                        <option value="equipment">Equipment</option>
                        <option value="clothing">Clothing</option>
                        <option value="care">Care</option>
                        <option value="accessories">Accessories</option>
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=300&fit=crop'
                            }}
                        />
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(product.category)}`}>
                                    {product.category}
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <p className="text-lg font-bold text-gray-900">R{parseFloat(product.price).toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">Cost: R{parseFloat(product.cost_price).toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{product.stock_quantity}</p>
                                    <p className="text-xs text-gray-500">in stock</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="flex-1 flex items-center justify-center space-x-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                                >
                                    <Edit size={16} />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="flex-1 flex items-center justify-center space-x-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 size={16} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Product Modal */}
            <AnimatePresence>
                {showProductModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold">
                                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                                    </h3>
                                    <button
                                        onClick={resetForm}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Product Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={productForm.name}
                                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="Enter product name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Category *
                                            </label>
                                            <select
                                                required
                                                value={productForm.category}
                                                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            >
                                                <option value="feed">Feed</option>
                                                <option value="equipment">Equipment</option>
                                                <option value="clothing">Clothing</option>
                                                <option value="care">Care</option>
                                                <option value="accessories">Accessories</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            value={productForm.description}
                                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            rows={3}
                                            placeholder="Enter product description"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Price (R) *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={productForm.price}
                                                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cost Price (R) *
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                required
                                                value={productForm.cost_price}
                                                onChange={(e) => setProductForm({ ...productForm, cost_price: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Stock Quantity *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={productForm.stock_quantity}
                                                onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Image URL
                                        </label>
                                        <input
                                            type="url"
                                            value={productForm.image_url}
                                            onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            checked={productForm.active}
                                            onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                                            className="mr-2"
                                        />
                                        <label htmlFor="active" className="text-sm font-medium text-gray-700">
                                            Product is active and visible to customers
                                        </label>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors"
                                        >
                                            {editingProduct ? 'Update Product' : 'Add Product'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ProductManagement
