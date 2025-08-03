// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    // In your AuthContext.js, update the signUp function:
    const signUp = async (email, password, metadata = {}) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata
                }
            })

            if (error) throw error

            // **ADD THIS: Create user profile in public.users table**
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('users')
                    .insert({
                        id: data.user.id, // Same ID as auth user
                        email: data.user.email,
                        name: metadata.name || '',
                        surname: metadata.surname || '',
                        contact_number: metadata.contact_number || '',
                        created_at: new Date().toISOString()
                    })

                if (profileError) {
                    console.error('Error creating user profile:', profileError)
                    // Don't throw error - user is authenticated, profile can be created later
                }
            }

            return { data, error }
        } catch (error) {
            console.error('Error in signUp:', error)
            return { data: null, error }
        }
    }


    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { data, error }
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    }

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
