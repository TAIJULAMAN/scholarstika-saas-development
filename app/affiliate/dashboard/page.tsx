"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, TrendingUp, Activity, Target, ArrowRight, ShieldCheck, Wallet, Award } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const stats = [
    { title: "Total Sign-ups", value: "84", icon: Users, change: "+5.2%", trend: "up", color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Paid Conversions", value: "32", icon: Activity, change: "+18.1%", trend: "up", color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Conversion Rate", value: "38.1%", icon: TrendingUp, change: "+2.4%", trend: "up", color: "text-emerald-600", bg: "bg-emerald-100" },
]

// Mock data for different years
const chartDataByYear: Record<string, any> = {
    "2026": {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                fill: true,
                label: 'Earnings (₦)',
                data: [40000, 65000, 85000, 120000, 185000, 240000, 0, 0, 0, 0, 0, 0],
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                borderWidth: 3,
                pointBackgroundColor: 'rgb(16, 185, 129)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    },
    "2025": {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                fill: true,
                label: 'Earnings (₦)',
                data: [10000, 15000, 12000, 25000, 30000, 45000, 50000, 48000, 60000, 75000, 80000, 95000],
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                borderWidth: 3,
            },
        ],
    }
}

const recentReferrals = [
    { school: "Greenwood High", date: "2026-06-10", status: "Paid Conversion", amount: "₦40,000" },
    { school: "St. Mary's Academy", date: "2026-06-12", status: "Trial", amount: "₦0" },
    { school: "Lakeside Secondary", date: "2026-06-14", status: "Sign-up", amount: "₦0" },
    { school: "Oakville Institute", date: "2026-05-28", status: "Paid Conversion", amount: "₦65,000" },
]

export default function AffiliateDashboard() {
    const [selectedYear, setSelectedYear] = useState("2026")

    const currentConversions = 32
    // Tiers: 1-5 (20%), 6-15 (25%), 16+ (30%)
    let currentTier = "Tier 3"
    let currentRate = "30%"
    let nextTierThreshold = null
    let progress = 100

    if (currentConversions <= 5) {
        currentTier = "Tier 1"
        currentRate = "20%"
        nextTierThreshold = 6
        progress = (currentConversions / 6) * 100
    } else if (currentConversions <= 15) {
        currentTier = "Tier 2"
        currentRate = "25%"
        nextTierThreshold = 16
        progress = ((currentConversions - 5) / 11) * 100
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: { size: 13 },
                bodyFont: { size: 14, weight: 'bold' as const },
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
            }
        },
        scales: {
            x: {
                grid: { display: false, drawBorder: false },
                ticks: { color: '#64748b', font: { size: 12 } }
            },
            y: {
                beginAtZero: true,
                grid: { color: '#f1f5f9', drawBorder: false },
                ticks: {
                    color: '#64748b',
                    font: { size: 12 },
                    callback: (value: any) => `₦${value.toLocaleString()}`
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
    }

    return (
        <div className="space-y-10 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-2">
                <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent pb-1">
                    Affiliate Overview
                </h2>
                <p className="text-muted-foreground mt-2 text-lg font-medium">
                    Monitor your referral performance and earnings here.
                </p>
            </div>

            {/* Premium Tier Progression Card */}
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-[2rem]">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <Award className="w-64 h-64 text-white transform rotate-12 translate-x-12 -translate-y-12" />
                </div>
                <CardContent className="p-10 sm:p-12 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-8">
                            <div className="bg-emerald-500/20 p-5 rounded-3xl border border-emerald-500/30 backdrop-blur-md shadow-inner">
                                <Target className="w-10 h-10 text-emerald-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-emerald-400 font-semibold tracking-wider text-sm uppercase">Your Current Level</p>
                                <h3 className="text-3xl font-bold flex items-baseline gap-2">
                                    {currentTier}
                                    <span className="text-xl font-medium text-emerald-200">({currentRate} Commission)</span>
                                </h3>
                                <p className="text-emerald-100 font-medium">You have achieved {currentConversions} verified paid conversions.</p>
                            </div>
                        </div>

                        {nextTierThreshold ? (
                            <div className="flex-1 w-full max-w-lg space-y-4 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm shadow-xl">
                                <div className="flex justify-between text-sm font-semibold px-1">
                                    <span className="text-emerald-100 text-base">{nextTierThreshold - currentConversions} more needed</span>
                                    <span className="text-emerald-400 text-base">{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-4 bg-emerald-950/50 rounded-full [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-emerald-400 [&>div]:rounded-full" />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg px-4 py-2 text-sm font-bold uppercase tracking-wider">
                                    Top Tier Reached!
                                </Badge>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Micro-interactive Stats Cards */}
            <div className="grid gap-8 md:grid-cols-3">
                {stats.map((stat, i) => (
                    <Card key={i} className="group border-gray-100 hover:border-emerald-100 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-300 hover:-translate-y-2 cursor-default rounded-[1.5rem]">
                        <CardHeader className="flex flex-row items-center justify-between pb-4 pt-8 px-8">
                            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-3 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8">
                            <div className="text-5xl font-extrabold text-gray-900 tracking-tight">{stat.value}</div>
                            <div className="flex items-center gap-2 mt-4">
                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 font-bold">
                                    {stat.change}
                                </Badge>
                                <span className="text-sm font-medium text-gray-400">from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts and Earnings */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-gray-100 shadow-xl shadow-gray-200/40 rounded-[1.5rem] overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50/50 pb-6 pt-6 px-8">
                        <div>
                            <CardTitle className="text-xl font-bold">Earnings Trend</CardTitle>
                            <CardDescription className="text-sm mt-1">Monthly breakdown of your accrued commissions.</CardDescription>
                        </div>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-[130px] bg-white border-gray-200 font-medium rounded-xl h-10">
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="2026" className="font-medium">2026</SelectItem>
                                <SelectItem value="2025" className="font-medium">2025</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="h-[400px] pt-8 pl-4 pr-8 pb-4">
                        <Line options={chartOptions} data={chartDataByYear[selectedYear]} />
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col rounded-[1.5rem] overflow-hidden">
                    <CardHeader className="border-b bg-gray-50/50 pb-6 pt-6 px-8">
                        <CardTitle className="text-xl font-bold">Current Earnings</CardTitle>
                        <CardDescription className="text-sm mt-1">Status of your lifetime balances.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center p-8 space-y-8">
                        <div className="flex items-center p-5 rounded-2xl bg-amber-50/50 border border-amber-100 transition-all hover:bg-amber-50 hover:shadow-md">
                            <div className="bg-amber-100 p-4 rounded-2xl shadow-sm">
                                <ShieldCheck className="h-6 w-6 text-amber-600" />
                            </div>
                            <div className="ml-4 space-y-0.5">
                                <p className="text-sm font-bold text-gray-900">Pending Approval</p>
                                <p className="text-xs font-medium text-amber-600/80">Clears after 30-day hold</p>
                            </div>
                            <div className="ml-auto text-xl font-extrabold text-amber-600">₦240,000</div>
                        </div>

                        <div className="flex items-center p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 transition-all hover:bg-emerald-50 hover:shadow-md">
                            <div className="bg-emerald-100 p-4 rounded-2xl shadow-sm">
                                <Wallet className="h-7 w-7 text-emerald-600" />
                            </div>
                            <div className="ml-5 space-y-1">
                                <p className="text-base font-bold text-gray-900">Approved (Payable)</p>
                                <p className="text-sm font-medium text-emerald-600/80">Ready for next cycle</p>
                            </div>
                            <div className="ml-auto text-2xl font-extrabold text-emerald-600">₦185,000</div>
                        </div>

                        <div className="flex items-center p-5 rounded-2xl bg-gray-50 border border-gray-200 transition-all hover:bg-white hover:shadow-md">
                            <div className="bg-white border p-4 rounded-2xl shadow-sm">
                                <TrendingUp className="h-7 w-7 text-gray-700" />
                            </div>
                            <div className="ml-5 space-y-1">
                                <p className="text-base font-bold text-gray-900">Total Paid Out</p>
                                <p className="text-sm font-medium text-gray-500">Lifetime earnings</p>
                            </div>
                            <div className="ml-auto text-2xl font-extrabold text-gray-900">₦1,450,000</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Referrals Table */}
            <Card className="border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden rounded-[1.5rem]">
                <CardHeader className="border-b bg-gray-50/50 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold">Recent Referrals Tracking</CardTitle>
                            <CardDescription className="text-sm mt-1">Monitor the lifecycle of schools you've referred.</CardDescription>
                        </div>
                        <Badge variant="outline" className="text-gray-600 font-bold px-4 py-2 bg-white cursor-pointer hover:bg-gray-100 rounded-lg shadow-sm">
                            View All <ArrowRight className="ml-2 w-4 h-4" />
                        </Badge>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto p-2">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-transparent hover:bg-transparent border-b-gray-100">
                                <TableHead className="font-bold text-gray-500 uppercase text-[11px] tracking-wider h-14 px-6">Referred School</TableHead>
                                <TableHead className="font-bold text-gray-500 uppercase text-[11px] tracking-wider px-6">Attributed Date</TableHead>
                                <TableHead className="font-bold text-gray-500 uppercase text-[11px] tracking-wider px-6">Status</TableHead>
                                <TableHead className="font-bold text-gray-500 uppercase text-[11px] tracking-wider text-right px-6">Commission</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentReferrals.map((ref, idx) => (
                                <TableRow key={idx} className="hover:bg-gray-50/80 transition-colors border-b-gray-50 group">
                                    <TableCell className="font-bold text-gray-900 px-6 py-5 text-base">{ref.school}</TableCell>
                                    <TableCell className="text-gray-500 font-medium px-6 py-5">{ref.date}</TableCell>
                                    <TableCell className="px-6 py-5">
                                        <Badge
                                            variant="secondary"
                                            className={`px-3 py-1 ${ref.status === 'Paid Conversion'
                                                ? "bg-emerald-100/80 text-emerald-700 border-emerald-200 shadow-sm"
                                                : ref.status === 'Trial'
                                                    ? "bg-blue-100/80 text-blue-700 border-blue-200 shadow-sm"
                                                    : "bg-gray-100 text-gray-700 border-gray-200 shadow-sm"
                                                }`}
                                        >
                                            {ref.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-gray-900 group-hover:text-emerald-600 transition-colors px-6 py-5 text-base">
                                        {ref.amount}
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
