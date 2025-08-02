import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, Star, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const LessonCard = ({ lesson, index }) => {
    const navigate = useNavigate()

    const handleBookLesson = () => {
        navigate('/book-lesson', { state: { lessonType: lesson } })
    }

    const getDifficultyColor = () => {
        if (lesson.name.toLowerCase().includes('beginner')) {
            return 'bg-green-100 text-green-800'
        } else if (lesson.name.toLowerCase().includes('intermediate')) {
            return 'bg-yellow-100 text-yellow-800'
        } else if (lesson.name.toLowerCase().includes('advanced')) {
            return 'bg-red-100 text-red-800'
        } else {
            return 'bg-blue-100 text-blue-800'
        }
    }

    const getDifficultyIcon = () => {
        if (lesson.name.toLowerCase().includes('beginner')) {
            return '🌱'
        } else if (lesson.name.toLowerCase().includes('intermediate')) {
            return '🌿'
        } else if (lesson.name.toLowerCase().includes('advanced')) {
            return '🏆'
        } else {
            return '👥'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
        >
            <div className="relative h-48 bg-gradient-to-br from-green-400 to-primary overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <img
                    src={`https://images.unsplash.com/photo-1553284965-abfecfcd0d8e?w=400&h=300&fit=crop&crop=center`}
                    alt={lesson.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        e.target.style.display = 'none'
                    }}
                />
                <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor()}`}>
                        <span className="mr-1">{getDifficultyIcon()}</span>
                        {lesson.name.toLowerCase().includes('beginner') ? 'Beginner' :
                            lesson.name.toLowerCase().includes('intermediate') ? 'Intermediate' :
                                lesson.name.toLowerCase().includes('advanced') ? 'Advanced' : 'Group'}
                    </span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center">
                            <Clock size={16} className="mr-1" />
                            <span>{lesson.duration_minutes} min</span>
                        </div>
                        <div className="flex items-center">
                            <Users size={16} className="mr-1" />
                            <span>Max {lesson.max_participants}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                        {lesson.name}
                    </h3>
                    <div className="flex items-center text-yellow-400 ml-2">
                        <Star size={16} className="fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.9</span>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {lesson.description}
                </p>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-primary">
                            R{parseFloat(lesson.price_per_hour).toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">per hour</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Award size={14} />
                        <span>Certified Instructor</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleBookLesson}
                        className="w-full bg-primary text-black py-3 rounded-xl font-semibold hover:bg-primary-light transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                        <Calendar size={18} />
                        <span>Book This Lesson</span>
                    </motion.button>

                    <div className="text-center">
                        <span className="text-xs text-gray-500">
                            Available Monday - Saturday • Flexible scheduling
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default LessonCard
