import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Users, AlertCircle, CheckCircle } from 'lucide-react'
import { format, isSameDay } from 'date-fns'
import { supabase } from '../../lib/supabase'

const TimeSlotPicker = ({ selectedDate, lessonType, onSlotSelect, selectedSlot }) => {
    const [availableSlots, setAvailableSlots] = useState([])
    const [bookedSlots, setBookedSlots] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (selectedDate) {
            fetchTimeSlots()
        }
    }, [selectedDate, lessonType])

    const fetchTimeSlots = async () => {
        setLoading(true)
        try {
            const dayOfWeek = selectedDate.getDay()

            // Get available time slots for this day
            const { data: timeSlots, error: slotsError } = await supabase
                .from('time_slots')
                .select('*')
                .eq('day_of_week', dayOfWeek)
                .eq('active', true)
                .order('start_time')

            if (slotsError) throw slotsError

            // Get existing bookings for this date
            const { data: bookings, error: bookingsError } = await supabase
                .from('lesson_bookings')
                .select('start_time, end_time')
                .eq('booking_date', format(selectedDate, 'yyyy-MM-dd'))
                .in('status', ['pending', 'confirmed'])

            if (bookingsError) throw bookingsError

            setAvailableSlots(timeSlots)
            setBookedSlots(bookings)
        } catch (error) {
            console.error('Error fetching time slots:', error)
        } finally {
            setLoading(false)
        }
    }

    const isSlotBooked = (slot) => {
        return bookedSlots.some(booking =>
            booking.start_time === slot.start_time && booking.end_time === slot.end_time
        )
    }

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':')
        const hour = parseInt(hours)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        return `${displayHour}:${minutes} ${ampm}`
    }

    const getDurationText = () => {
        const hours = Math.floor(lessonType.duration_minutes / 60)
        const minutes = lessonType.duration_minutes % 60

        if (hours > 0 && minutes > 0) {
            return `${hours}h ${minutes}m`
        } else if (hours > 0) {
            return `${hours}h`
        } else {
            return `${minutes}m`
        }
    }

    if (!selectedDate) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center text-gray-500">
                    <Clock size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>Please select a date first</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Clock className="mr-2" size={20} />
                    Available Times
                </h3>
                <div className="text-sm text-gray-600">
                    {format(selectedDate, 'EEEE, MMMM d')}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                    />
                </div>
            ) : (
                <>
                    {/* Lesson info */}
                    <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-green-800">{lessonType.name}</h4>
                                <div className="flex items-center space-x-4 text-sm text-green-600 mt-1">
                                    <span className="flex items-center">
                                        <Clock size={14} className="mr-1" />
                                        {getDurationText()}
                                    </span>
                                    <span className="flex items-center">
                                        <Users size={14} className="mr-1" />
                                        Max {lessonType.max_participants}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xl font-bold text-green-800">
                                    R{parseFloat(lessonType.price_per_hour).toFixed(2)}
                                </div>
                                <div className="text-sm text-green-600">per hour</div>
                            </div>
                        </div>
                    </div>

                    {/* Time slots */}
                    <div className="space-y-3">
                        {availableSlots.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
                                <p>No time slots available for this day</p>
                            </div>
                        ) : (
                            availableSlots.map((slot, index) => {
                                const isBooked = isSlotBooked(slot)
                                const isSelected = selectedSlot &&
                                    selectedSlot.start_time === slot.start_time &&
                                    selectedSlot.end_time === slot.end_time

                                return (
                                    <motion.div
                                        key={`${slot.start_time}-${slot.end_time}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <button
                                            onClick={() => !isBooked && onSlotSelect(slot)}
                                            disabled={isBooked}
                                            className={`w-full p-4 rounded-lg border-2 transition-all text-left
                        ${isSelected
                                                    ? 'border-primary bg-primary text-white'
                                                    : isBooked
                                                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                                        : 'border-gray-200 hover:border-primary hover:bg-primary hover:bg-opacity-5'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-white' :
                                                            isBooked ? 'bg-gray-300' : 'bg-green-400'
                                                        }`} />
                                                    <div>
                                                        <div className="font-medium">
                                                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                                        </div>
                                                        <div className={`text-sm ${isSelected ? 'text-black' :
                                                                isBooked ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                            {getDurationText()} lesson
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    {isBooked ? (
                                                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                                            Booked
                                                        </span>
                                                    ) : isSelected ? (
                                                        <CheckCircle size={20} />
                                                    ) : (
                                                        <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                                            Available
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    </motion.div>
                                )
                            })
                        )}
                    </div>

                    {/* Legend */}
                    <div className="mt-6 pt-4 border-t">
                        <div className="flex flex-wrap items-center justify-center space-x-4 text-xs">
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 bg-green-400 rounded-full" />
                                <span>Available</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 bg-gray-300 rounded-full" />
                                <span>Booked</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <div className="w-3 h-3 bg-primary rounded-full" />
                                <span>Selected</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default TimeSlotPicker
