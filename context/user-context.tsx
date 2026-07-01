"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface User {
    id?: string
    name: string
    email: string
    role: string
    backendRole?: string
    avatar?: string
    schoolName?: string
    country?: string
    city?: string
    state?: string
    branches?: number
    subscriptionId?: string
}

interface UserContextType {
    user: User | null
    login: (user: User) => void
    logout: () => void
    isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("scholarstika_user")
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (error) {
                console.error("Failed to parse user from localStorage", error)
                localStorage.removeItem("scholarstika_user")
            }
        }
        setIsLoading(false)
    }, [])

    const login = (userData: User) => {
        // Add a default avatar if none provided (using UI Avatars as fallback based on name)
        const userWithAvatar = {
            ...userData,
            avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`
        }

        setUser(userWithAvatar)
        localStorage.setItem("scholarstika_user", JSON.stringify(userWithAvatar))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem("scholarstika_user")
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
    }

    return (
        <UserContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider")
    }
    return context
}
