"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import { useLogInMutation } from "@/redux/features/auth/authApi"
import { useAppDispatch } from "@/redux/hooks"
import { setUser } from "@/redux/Slice/authSlice"
import { getDashboardRouteForRole, normalizeFrontendUser } from "@/lib/auth-user"

export default function SignInPage() {
    const [showPassword, setShowPassword] = useState(false)
    const { login } = useUser()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [logIn] = useLogInMutation()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        try {
            const response = await logIn({
                email: formData.email,
                password: formData.password,
            }).unwrap()

            const authData = response?.data
            const user = normalizeFrontendUser(authData?.user || {})

            dispatch(setUser({
                user,
                token: authData?.accessToken,
                refreshToken: authData?.refreshToken,
            }))

            login(user)
            localStorage.setItem("registeredUser", JSON.stringify(user))
            const dashboardRoute = getDashboardRouteForRole(user.role)

            if (
                user.role === "student" ||
                user.role === "teacher" ||
                user.role === "parent" ||
                user.role === "bursar" ||
                user.role === "nurse" ||
                user.role === "branch_admin" ||
                user.role === "branch_manager"
            ) {
                router.push(dashboardRoute)
            } else {
                router.push("/auth/trial-offer")
            }
        } catch (err) {
            const apiError = err as { data?: { message?: string; errorMessages?: Array<{ message?: string }> } }
            setError(
                apiError?.data?.message ||
                apiError?.data?.errorMessages?.[0]?.message ||
                "An error occurred. Please try again."
            )
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-amber-50 p-4">
            <Card className="w-full max-w-md shadow-xl px-5 py-10">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                    <CardDescription>Sign in to your account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Error Message */}
                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    className="pl-10"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm text-emerald-600 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="remember" className="text-sm text-gray-600">
                                Remember me
                            </label>
                        </div>

                        {/* Sign In Button */}
                        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="text-center text-sm my-2">
                        Don't have an account?{" "}
                        <Link href="/auth/signup" className="font-semibold text-emerald-600 hover:underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
