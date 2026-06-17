"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Wallet, ShieldCheck, TrendingUp, ArrowUpRight, Clock, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"

const payouts = [
    { id: "PAY-003", date: "2026-05-01", amount: "₦120,000", method: "Bank Transfer", status: "Paid" },
    { id: "PAY-002", date: "2026-04-01", amount: "₦65,000", method: "Bank Transfer", status: "Paid" },
    { id: "PAY-001", date: "2026-03-01", amount: "₦40,000", method: "Bank Transfer", status: "Paid" },
]

export default function AffiliatePayoutsPage() {
    const [amount, setAmount] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [open, setOpen] = useState(false)

    const handleRequestPayout = () => {
        if (!amount || Number(amount) < 10000) {
            toast.error("Minimum payout is ₦10,000")
            return
        }

        setIsSubmitting(true)
        setTimeout(() => {
            setIsSubmitting(false)
            setOpen(false)
            setAmount("")
            toast.success(`Payout request for ₦${Number(amount).toLocaleString()} sent successfully!`)
        }, 1500)
    }

    return (
        <div className="space-y-10 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent pb-1">
                        Payouts
                    </h2>
                    <p className="text-muted-foreground mt-2 text-lg font-medium">
                        Manage your withdrawal requests and view your payout history.
                    </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-14 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:scale-95">
                            <ArrowUpRight className="mr-2 h-5 w-5" /> Request Payout
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md rounded-[1.5rem]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Request a Payout</DialogTitle>
                            <DialogDescription className="text-base">
                                Enter the amount you wish to withdraw. Available balance: <strong className="text-emerald-600">₦185,000</strong>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-6">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 block">Amount to Withdraw</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-500 font-bold text-lg">₦</span>
                                </div>
                                <Input 
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="10000"
                                    className="pl-10 h-14 bg-gray-50 border-gray-200 rounded-xl text-lg font-mono focus:ring-emerald-500 focus:border-emerald-500"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-3 font-medium">Minimum withdrawal threshold is ₦10,000.</p>
                        </div>
                        <DialogFooter>
                            <Button 
                                onClick={handleRequestPayout}
                                disabled={isSubmitting}
                                className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-500/20"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </span>
                                ) : (
                                    "Confirm Payout"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-8 md:grid-cols-3">
                <Card className="group border-gray-100 shadow-xl shadow-gray-200/40 rounded-[1.5rem] bg-gradient-to-br from-emerald-600 to-teal-800 text-white overflow-hidden relative transition-transform hover:-translate-y-2 duration-300">
                    <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                        <Wallet className="w-24 h-24 text-white transform rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <CardHeader className="pb-2 pt-8 px-8 relative z-10">
                        <CardTitle className="text-sm font-bold text-emerald-100 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-300" /> Available to Withdraw
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 relative z-10">
                        <div className="text-5xl font-black text-white tracking-tight mt-2 drop-shadow-md">₦185,000</div>
                        <p className="text-sm text-emerald-200 font-medium mt-4 bg-black/10 w-fit px-3 py-1 rounded-full">
                            Minimum threshold: ₦10,000
                        </p>
                    </CardContent>
                </Card>

                <Card className="group border-gray-100 hover:border-amber-200 hover:shadow-2xl hover:shadow-amber-900/5 rounded-[1.5rem] transition-all hover:-translate-y-2 duration-300">
                    <CardHeader className="pb-2 pt-8 px-8 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                            Pending (In Hold)
                        </CardTitle>
                        <div className="p-3 rounded-2xl bg-amber-50 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <Clock className="w-6 h-6 text-amber-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="text-5xl font-extrabold text-amber-500 tracking-tight mt-2">₦240,000</div>
                        <p className="text-sm text-gray-400 font-medium mt-4">
                            Subject to 30-day clearance
                        </p>
                    </CardContent>
                </Card>

                <Card className="group border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 rounded-[1.5rem] transition-all hover:-translate-y-2 duration-300">
                    <CardHeader className="pb-2 pt-8 px-8 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                            Lifetime Payouts
                        </CardTitle>
                        <div className="p-3 rounded-2xl bg-blue-50 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                            <TrendingUp className="w-6 h-6 text-blue-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="text-5xl font-extrabold text-gray-900 tracking-tight mt-2">₦225,000</div>
                        <p className="text-sm text-gray-400 font-medium mt-4">
                            Total withdrawn to date
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Payout History Table */}
            <Card className="border-gray-100 shadow-xl shadow-gray-200/40 rounded-[1.5rem] overflow-hidden">
                <CardHeader className="border-b bg-gray-50/50 px-8 py-6">
                    <CardTitle className="text-xl font-bold">Payout History</CardTitle>
                    <CardDescription className="text-sm mt-1">A record of your processed and pending withdrawals.</CardDescription>
                </CardHeader>
                <div className="overflow-x-auto p-2">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-transparent hover:bg-transparent border-b-gray-100">
                                <TableHead className="font-bold text-gray-500 uppercase text-[11px] tracking-wider h-14 px-6">Reference</TableHead>
                                <TableHead className="font-bold text-gray-500 uppercase text-[11px] tracking-wider px-6">Date</TableHead>
                                <TableHead className="font-bold text-gray-500 uppercase text-[11px] tracking-wider px-6">Method</TableHead>
                                <TableHead className="font-bold text-gray-500 uppercase text-[11px] tracking-wider px-6">Amount</TableHead>
                                <TableHead className="font-bold text-gray-500 uppercase text-[11px] tracking-wider px-6 text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payouts.map((payout) => (
                                <TableRow key={payout.id} className="hover:bg-gray-50/80 transition-colors border-b-gray-50 group">
                                    <TableCell className="font-bold text-gray-900 px-6 py-5 text-base">{payout.id}</TableCell>
                                    <TableCell className="text-gray-500 font-medium px-6 py-5">{payout.date}</TableCell>
                                    <TableCell className="text-gray-500 font-medium px-6 py-5">{payout.method}</TableCell>
                                    <TableCell className="font-bold text-gray-900 px-6 py-5 text-base">{payout.amount}</TableCell>
                                    <TableCell className="px-6 py-5 text-right">
                                        <Badge
                                            variant="secondary"
                                            className="px-3 py-1 bg-emerald-100/80 text-emerald-700 border-emerald-200 shadow-sm"
                                        >
                                            {payout.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </div>
    )
}
