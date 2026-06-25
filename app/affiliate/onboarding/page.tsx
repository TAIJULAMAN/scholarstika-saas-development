"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldCheck, CheckCircle2, ArrowRight, Lock, CreditCard } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function AffiliateOnboardingPage() {
    const [isConnecting, setIsConnecting] = useState(false)
    const [isConnected, setIsConnected] = useState(false)

    const handleConnectStripe = () => {
        setIsConnecting(true)

        setTimeout(() => {
            setIsConnecting(false)
            setIsConnected(true)
            toast.success("Stripe account successfully connected!")
        }, 2000)
    }

    if (isConnected) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center animate-in fade-in zoom-in duration-500">
                <Card className="max-w-md w-full border-gray-100 shadow-2xl shadow-emerald-900/5 rounded-[2rem] text-center p-10">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">Payouts Enabled</h2>
                    <p className="text-gray-500 font-medium mb-8">
                        Your Stripe account is successfully linked. Your commissions will be automatically paid out to this account.
                    </p>

                    <div className="bg-gray-50 rounded-xl p-4 mb-8 flex items-center justify-between border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                {/* Simulated Stripe Icon */}
                                <div className="font-black text-emerald-600 text-xl tracking-tighter">stripe</div>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-gray-900">Connected Account</p>
                                <p className="text-xs text-gray-500 font-mono">acct_1N****89X</p>
                            </div>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Active
                        </span>
                    </div>

                    <div className="h-14 px-8 rounded-xl bg-emerald-50 text-emerald-700 border-2 border-emerald-200 font-bold text-base w-full flex items-center justify-center gap-2 cursor-default">
                        <CheckCircle2 className="w-5 h-5" /> Account Verified
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-10 pb-12 animate-in fade-in duration-500 max-w-4xl mx-auto pt-10">
            {/* Header Area */}
            <div className="text-center space-y-4 mb-12">
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-2">
                    <Lock className="w-4 h-4" /> Secure Integration
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900">
                    Connect your <span className="text-emerald-600">Payout Account</span>
                </h1>
                <p className="text-xl text-gray-500 font-medium mt-4 max-w-2xl mx-auto">
                    We use Stripe to ensure you get paid securely and on time. Link your account to activate your affiliate dashboard.
                </p>
            </div>

            <div className="grid md:grid-cols-5 gap-8 items-center">
                <Card className="md:col-span-3 border-gray-100 shadow-2xl shadow-gray-200/50 rounded-[2rem] overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>
                    <CardHeader className="px-10 pt-12 pb-6 text-center">
                        <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="font-black text-emerald-600 text-3xl tracking-tighter">stripe</span>
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Get Paid via Stripe
                        </CardTitle>
                        <CardDescription className="text-base mt-3 max-w-sm mx-auto">
                            Scholarstika partners with Stripe for fast, secure, and automated commission payouts directly to your bank account.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-10 pb-12">
                        <Button
                            onClick={handleConnectStripe}
                            disabled={isConnecting}
                            className="w-full h-16 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-xl shadow-emerald-600/25 transition-all hover:-translate-y-1 active:scale-95"
                        >
                            {isConnecting ? (
                                <span className="flex items-center gap-3">
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Redirecting to Stripe...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Connect with Stripe <ArrowRight className="w-5 h-5 ml-1" />
                                </span>
                            )}
                        </Button>

                        <p className="text-center text-sm text-gray-400 mt-6 font-medium flex items-center justify-center gap-2">
                            <Lock className="w-4 h-4" /> You'll be securely redirected to Stripe.com
                        </p>
                    </CardContent>
                </Card>

                {/* Features List */}
                <div className="md:col-span-2 space-y-8 px-4">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Direct to Bank</h3>
                            <p className="text-sm text-gray-500 font-medium">Earnings are automatically routed to your connected bank account.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Bank-Level Security</h3>
                            <p className="text-sm text-gray-500 font-medium">We never see or store your sensitive banking details. Stripe handles it all.</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                            <div className="font-black text-xl">⚡</div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Automated Payouts</h3>
                            <p className="text-sm text-gray-500 font-medium">No more manual withdrawal requests. Get paid seamlessly on schedule.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
