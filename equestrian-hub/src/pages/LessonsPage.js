import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Award, Clock, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import LessonCard from '../components/Lessons/LessonCard'

const LessonsPage = () => {
    const [lessonTypes, setLessonTypes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLessonTypes()
    }, [])

    const fetchLessonTypes = async () => {
        try {
            const { data, error } = await supabase
                .from('lesson_types')
                .select('*')
                .eq('active', true)
                .order('name')

            if (error) throw error
            setLessonTypes(data)
        } catch (error) {
            console.error('Error fetching lesson types:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-green-50 to-pink-100">
                <Header />
                <div className="flex items-center justify-center h-96">
                    <motion.div
                        className="w-16 h-16 bg-primary rounded-lg shadow-lg"
                        animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                            scale: { duration: 1.5, repeat: Infinity }
                        }}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-green-50 to-pink-100">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h1
                        className="text-4xl md:text-5xl font-display font-bold text-primary mb-4"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <Calendar className="inline-block mr-3 mb-2" size={48} />
                        Riding Lessons
                    </motion.h1>

                    <motion.p
                        className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Learn to ride with confidence under the guidance of our certified instructors.
                        From beginners to advanced riders, we have the perfect lesson for your skill level.
                    </motion.p>

                    {/* Instructor Info */}
                    <motion.div
                        className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <div className="flex items-center justify-center mb-6">
                            <img
                                src="https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=120&h=120&fit=crop&crop=face"
                                alt="Instructor"
                                className="w-20 h-20 rounded-full object-cover mr-6"
                            />
                            <div className="text-left">
                                <h3 className="text-xl font-semibold text-primary mb-2">Sarah Mitchell</h3>
                                <p className="text-gray-600 mb-2">Certified Riding Instructor</p>
                                <div className="flex items-center text-yellow-500">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Award key={star} size={16} className="fill-current mr-1" />
                                    ))}
                                    <span className="text-gray-600 ml-2 text-sm">15+ years experience</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 text-center">
                            "I'm passionate about helping riders of all levels develop their skills and build a strong,
                            trusting relationship with their horses. Safety and fun are my top priorities!"
                        </p>
                    </motion.div>
                </motion.div>

                {/* Lesson Types Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {lessonTypes.map((lesson, index) => (
                            <LessonCard
                                key={lesson.id}
                                lesson={lesson}
                                index={index}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    <div className="text-center p-6 bg-white rounded-xl shadow-md">
                        <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
                        <p className="text-gray-600 text-sm">
                            Book lessons that fit your schedule. Available 6 days a week with morning and afternoon slots.
                        </p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-xl shadow-md">
                        <Award className="w-12 h-12 text-secondary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Safety First</h3>
                        <p className="text-gray-600 text-sm">
                            All riders are provided with safety equipment and our horses are well-trained and gentle.
                        </p>
                    </div>

                    <div className="text-center p-6 bg-white rounded-xl shadow-md">
                        <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Small Groups</h3>
                        <p className="text-gray-600 text-sm">
                            Personalized attention with small class sizes. Most lessons are one-on-one or small groups.
                        </p>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    )
}

export default LessonsPage
