import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Clock, AlertCircle } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, addMonths, subMonths, getDay } from 'date-fns'
import { supabase } from '../../lib/supabase'

const BookingCalendar = ({ selectedDate, onDateSelect, lessonType }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [availableSlots, setAvailableSlots] = useState({})
    const [bookedSlots, setBookedSlots] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchAvailability()
    }, [currentMonth, lessonType])

    const fetchAvailability = async () => {
        setLoading(true)
        try {
            const monthStart = startOfMonth(currentMonth)
            const monthEnd = endOfMonth(currentMonth)

            // Get available time slots
            const { data: timeSlots, error: slotsError } = await supabase
                .from('time_slots')
                .select('*')
                .eq('active', true)

            if (slotsError) throw slotsError

            // Get existing bookings for this month
            const { data: bookings, error: bookingsError } = await supabase
                .from('lesson_bookings')
                .select('booking_date, start_time, end_time')
                .gte('booking_date', format(monthStart, 'yyyy-MM-dd'))
                .lte('booking_date', format(monthEnd, 'yyyy-MM-dd'))
                .in('status', ['pending', 'confirmed'])

            if (bookingsError) throw bookingsError

            // Process availability
            const availability = {}
            const booked = {}

            eachDayOfInterval({ start: monthStart, end: monthEnd }).forEach(date => {
                const dayKey = format(date, 'yyyy-MM-dd')
                const dayOfWeek = getDay(date)

                // Get slots for this day of week
                const daySlots = timeSlots.filter(slot => slot.day_of_week === dayOfWeek)
                availability[dayKey] = daySlots.length

                // Count booked slots for this date
                const dayBookings = bookings.filter(booking => booking.booking_date === dayKey)
                booked[dayKey] = dayBookings.length
            })

            setAvailableSlots(availability)
            setBookedSlots(booked)
        } catch (error) {
            console.error('Error fetching availability:', error)
        } finally {
            setLoading(false)
        }
    }

    const previousMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1))
    }

    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1))
    }

    const getDayStatus = (date) => {
        const dayKey = format(date, 'yyyy-MM-dd')
        const available = availableSlots[dayKey] || 0
        const booked = bookedSlots[dayKey] || 0
        const remaining = available - booked

        if (isBefore(date, new Date())) return 'past'
        if (remaining <= 0) return 'full'
        if (remaining <= 2) return 'limited'
        return 'available'
    }

    const getDayStatusColor = (status) => {
        switch (status) {
            case 'past': return 'text-gray-300 cursor-not-allowed'
            case 'full': return 'text-red-300 cursor-not-allowed'
            case 'limited': return 'text-yellow-600 hover:bg-yellow-50 cursor-pointer'
            case 'available': return 'text-green-600 hover:bg-green-50 cursor-pointer'
            default: return 'text-gray-600 hover:bg-gray-50 cursor-pointer'
        }
    }

    const getDayIndicator = (date) => {
        const status = getDayStatus(date)
        const dayKey = format(date, 'yyyy-MM-dd')
        const available = availableSlots[dayKey] || 0
        const booked = bookedSlots[dayKey] || 0
        const remaining = available - booked

        if (status === 'past') return null
        if (status === 'full') return <div className="w-2 h-2 bg-red-400 rounded-full" />
        if (status === 'limited') return <div className="w-2 h-2 bg-yellow-400 rounded-full" />
        if (status === 'available' && remaining > 0) return <div className="w-2 h-2 bg-green-400 rounded-full" />
        return null
    }

    const handleDateClick = (date) => {
        const status = getDayStatus(date)
        if (status === 'past' || status === 'full') return
        onDateSelect(date)
    }

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="mr-2" size={20} />
                    Select Date
                </h3>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={previousMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-lg font-semibold min-w-[150px] text-center">
                        {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <button
                        onClick={nextMonth}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center py-8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                    />
                </div>
            )}

            <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month start */}
                {Array.from({ length: getDay(monthStart) }).map((_, index) => (
                    <div key={index} className="p-2" />
                ))}

                {/* Calendar days */}
                {days.map(date => {
                    const status = getDayStatus(date)
                    const isSelected = selectedDate && isSameDay(date, selectedDate)
                    const dayKey = format(date, 'yyyy-MM-dd')
                    const available = availableSlots[dayKey] || 0
                    const booked = bookedSlots[dayKey] || 0
                    const remaining = available - booked

                    return (
                        <motion.div
                            key={date.toISOString()}
                            whileHover={status !== 'past' && status !== 'full' ? { scale: 1.05 } : {}}
                            whileTap={status !== 'past' && status !== 'full' ? { scale: 0.95 } : {}}
                            onClick={() => handleDateClick(date)}
                            className={`relative p-2 text-center text-sm rounded-lg transition-all
                ${getDayStatusColor(status)}
                ${isSelected ? 'bg-primary text-white' : ''}
                ${isToday(date) ? 'ring-2 ring-primary ring-opacity-50' : ''}
                ${!isSameMonth(date, currentMonth) ? 'opacity-30' : ''}
              `}
                        >
                            <div className="flex flex-col items-center space-y-1">
                                <span>{format(date, 'd')}</span>
                                {getDayIndicator(date)}
                            </div>

                            {/* Tooltip for available slots */}
                            {status !== 'past' && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                        {remaining > 0 ? `${remaining} slots available` : 'Fully booked'}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t">
                <div className="flex flex-wrap items-center justify-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                        <span>Available</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                        <span>Limited</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-400 rounded-full" />
                        <span>Full</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>Today</span>
                    </div>
                </div>
            </div>

            {/* Information */}
            <AnimatePresence>
                {selectedDate && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200"
                    >
                        <div className="flex items-center text-green-800">
                            <AlertCircle size={16} className="mr-2" />
                            <span className="text-sm">
                                Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default BookingCalendar
