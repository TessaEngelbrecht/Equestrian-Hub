import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Award, Users, Star, MapPin, Clock, Phone } from 'lucide-react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

const AboutPage = () => {
    const values = [
        {
            icon: Heart,
            title: 'Passion for Horses',
            description: 'Our love for horses drives everything we do, from caring for our stable to teaching riders of all levels.'
        },
        {
            icon: Award,
            title: 'Excellence in Training',
            description: 'We maintain the highest standards in riding instruction and horse care with certified professionals.'
        },
        {
            icon: Users,
            title: 'Community Focus',
            description: 'Building a supportive community of horse lovers who share knowledge, experiences, and friendships.'
        }
    ]

    const team = [
        {
            name: 'Sarah Mitchell',
            role: 'Head Instructor & Owner',
            image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=300&h=300&fit=crop&crop=face',
            bio: 'With over 15 years of experience in equestrian training, Sarah founded Meadowbrook Equestrian to share her passion for horses and create a welcoming environment for riders of all skill levels.',
            certifications: ['BHS Certified Instructor', 'Dressage Level 3', 'Show Jumping Qualified']
        },
        {
            name: 'Michael Thompson',
            role: 'Senior Instructor',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
            bio: 'Michael specializes in show jumping and cross-country training. His patient teaching style and competitive background make him a favorite among our advanced riders.',
            certifications: ['USEA Certified', 'Show Jumping Level 2', 'Cross Country Specialist']
        },
        {
            name: 'Emma Rodriguez',
            role: 'Beginner Specialist',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=300&h=300&fit=crop&crop=face',
            bio: 'Emma has a gift for working with new riders and young children. Her gentle approach and safety-first mentality ensure everyone feels comfortable and confident.',
            certifications: ['Children\'s Instructor Certified', 'First Aid Qualified', 'Therapeutic Riding Assistant']
        }
    ]

    const stats = [
        { number: '15+', label: 'Years Experience' },
        { number: '500+', label: 'Happy Students' },
        { number: '25', label: 'Horses in Our Care' },
        { number: '100%', label: 'Safety Record' }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-green-50 to-pink-100">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <motion.div
                    className="text-center mb-16"
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
                        About Meadowbrook Equestrian
                    </motion.h1>

                    <motion.p
                        className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        Founded in 2008, Meadowbrook Equestrian has been South Africa's premier destination for quality horse care, professional riding instruction, and premium equestrian supplies.
                    </motion.p>
                </motion.div>

                {/* Our Story */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-display font-bold text-primary mb-6">Our Story</h2>
                            <div className="space-y-4 text-gray-700">
                                <p>
                                    What started as Sarah Mitchell's childhood dream has grown into one of the region's most respected equestrian facilities. After competing internationally and earning her certifications, Sarah returned home with a vision: to create a place where the love of horses could be shared with riders of all ages and skill levels.
                                </p>
                                <p>
                                    Located in the heart of Gauteng's countryside, our 50-acre facility provides the perfect setting for learning, training, and connecting with these magnificent animals. We believe that horses have the power to teach us patience, respect, confidence, and the joy of partnership.
                                </p>
                                <p>
                                    Today, we're proud to be a second home to hundreds of riders and over 25 horses, each with their own personality and story. From nervous beginners taking their first lesson to experienced competitors preparing for shows, every rider is part of our extended family.
                                </p>
                            </div>
                        </div>
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1553284965-abfecfcd0d8e?w=600&h=400&fit=crop"
                                alt="Meadowbrook Equestrian facility"
                                className="rounded-2xl shadow-xl"
                            />
                        </div>
                    </div>
                </motion.section>

                {/* Values */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <h2 className="text-3xl font-display font-bold text-primary text-center mb-12">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
                            >
                                <value.icon className="w-16 h-16 text-primary mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Stats */}
                <motion.section
                    className="mb-16 py-12 bg-white rounded-2xl shadow-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Team */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                >
                    <h2 className="text-3xl font-display font-bold text-primary text-center mb-12">Meet Our Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={member.name}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.6 + index * 0.2, duration: 0.6 }}
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                    <p className="text-primary font-medium mb-3">{member.role}</p>
                                    <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                                    <div className="space-y-1">
                                        {member.certifications.map((cert, i) => (
                                            <div key={i} className="flex items-center text-xs">
                                                <Star size={12} className="text-yellow-500 mr-2" />
                                                <span className="text-gray-600">{cert}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Facilities */}
                <motion.section
                    className="mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1551782450-17144efb9c50?w=600&h=400&fit=crop"
                                alt="Our facilities"
                                className="rounded-2xl shadow-xl"
                            />
                        </div>
                        <div>
                            <h2 className="text-3xl font-display font-bold text-primary mb-6">Our Facilities</h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="text-primary mt-1" size={20} />
                                    <div>
                                        <h3 className="font-semibold mb-1">50-Acre Property</h3>
                                        <p className="text-gray-600 text-sm">Spacious grounds with multiple paddocks, trails, and grazing areas</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Award className="text-primary mt-1" size={20} />
                                    <div>
                                        <h3 className="font-semibold mb-1">Indoor & Outdoor Arenas</h3>
                                        <p className="text-gray-600 text-sm">Professional-grade surfaces for all weather training</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Users className="text-primary mt-1" size={20} />
                                    <div>
                                        <h3 className="font-semibold mb-1">Modern Stables</h3>
                                        <p className="text-gray-600 text-sm">Climate-controlled stalls with individual turnout access</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Heart className="text-primary mt-1" size={20} />
                                    <div>
                                        <h3 className="font-semibold mb-1">On-Site Shop</h3>
                                        <p className="text-gray-600 text-sm">Everything you need for you and your horse in one convenient location</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </main>

            <Footer />
        </div>
    )
}

export default AboutPage
