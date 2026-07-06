"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, LayoutDashboard, Zap, ShieldCheck, Headphones } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { useState, useEffect } from "react"
import { useGetMyPaymentStatusQuery } from "@/redux/features/subscription/subscriptionApi"

export default function TrialOfferPage() {
    const router = useRouter()
    const { user } = useUser()
    const [isLoading, setIsLoading] = useState(false)
    const { data: paymentStatusResponse, isLoading: isPaymentStatusLoading } =
        useGetMyPaymentStatusQuery(undefined, {
            skip: !user,
        })

    const paymentStatus = paymentStatusResponse?.data || paymentStatusResponse
    const isPaid = Boolean(paymentStatus?.isPaid)

    useEffect(() => {
        if (user?.role === "branch_admin" || user?.role === "branch_manager") {
            router.replace("/branch/dashboard")
            return
        }

        if (!user || isPaymentStatusLoading || !isPaid) {
            return
        }

        const targetRoute =
            user.role === "institution_manager"
                ? "/institution/dashboard"
                : user.role === "branch_manager" || user.role === "branch_admin"
                    ? "/branch/dashboard"
                    : "/"

        router.replace(targetRoute)
    }, [isPaid, isPaymentStatusLoading, router, user])

    const handleClaimTrial = async () => {
        setIsLoading(true)
        // Simulate trial activation
        await new Promise(resolve => setTimeout(resolve, 1500))
        router.push("/pricing")
    }

    const handleSkip = () => {
        router.push(user ? "/" : "/auth/signin")
    }

    if (user && !isPaymentStatusLoading && isPaid) {
        return null
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-50 via-slate-50 to-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-50 rounded-full blur-3xl opacity-50" />
            </div>

            <Card className="w-full max-w-4xl shadow-2xl border-none bg-white/80 backdrop-blur-md relative z-10 overflow-hidden rounded-[2.5rem]">
                <div className="grid md:grid-cols-2">
                    {/* Left Side - Visual & Offer */}
                    <div className="bg-emerald-600 p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Zap size={200} strokeWidth={1} />
                        </div>

                        <Badge className="w-fit mb-6 bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-4 backdrop-blur-sm text-sm font-bold tracking-wide uppercase">
                            Exclusive Offer
                        </Badge>

                        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                            Your First Month is <span className="text-emerald-200">On Us.</span>
                        </h1>

                        <p className="text-emerald-50 text-lg mb-8 leading-relaxed opacity-90">
                            Experience the full power of Scholarstika's premium enterprise suite for 30 days. No commitment, just excellence.
                        </p>

                        <div className="space-y-4">
                            {[
                                "All Premium Modules Unlocked",
                                "Unlimited User Licenses",
                                "Priority 24/7 Concierge Support",
                                "Advanced Analytics & Reporting"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="bg-white/10 rounded-full p-1 ring-1 ring-white/20">
                                        <Check className="h-4 w-4 text-emerald-300" />
                                    </div>
                                    <span className="text-sm font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="p-8 md:p-12 bg-white flex flex-col justify-center">
                        <div className="mb-10 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center md:justify-start gap-2">
                                <Sparkles className="text-emerald-600 h-6 w-6" />
                                Ready to scale?
                            </h2>
                            <p className="text-gray-500 font-medium">
                                Join 5,000+ schools modernizing their administration today.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Button
                                onClick={handleClaimTrial}
                                className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-lg font-bold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                                disabled={isLoading}
                            >
                                {isLoading ? "Activating Trial..." : "Start Your 30-Day Free Trial."}
                            </Button>

                            <Button
                                variant="ghost"
                                onClick={handleSkip}
                                className="w-full h-14 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 font-bold rounded-xl transition-colors"
                            >
                                <LayoutDashboard className="mr-2 h-5 w-5" />
                                Maybe later, go to home.
                            </Button>
                        </div>

                        <div className="mt-10 pt-10 border-t border-gray-100 grid grid-cols-2 gap-4">
                            <div className="flex flex-col items-center md:items-start">
                                <ShieldCheck className="text-emerald-600 mb-2" />
                                <span className="text-xs font-bold text-gray-900 uppercase tracking-tighter">Safe & Secure</span>
                                <span className="text-[10px] text-gray-400">Enterprise Grade Encryption</span>
                            </div>
                            <div className="flex flex-col items-center md:items-start">
                                <Headphones className="text-emerald-600 mb-2" />
                                <span className="text-xs font-bold text-gray-900 uppercase tracking-tighter">Dedicated Support</span>
                                <span className="text-[10px] text-gray-400">Ready to assist you 24/7</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}
