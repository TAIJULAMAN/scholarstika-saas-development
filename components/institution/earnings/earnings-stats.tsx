"use client"

import { useState, useMemo } from "react"
import { Building2, DollarSign, AlertCircle, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetBranchTotalEarningsQuery } from "@/redux/features/institutionAndBranch/earnings/earningsApi"

export function EarningsStats() {
    const [selectedBranch, setSelectedBranch] = useState("all")
    const { data: earningsData, isLoading } = useGetBranchTotalEarningsQuery()

    const { stats } = useMemo(() => {
        const branches = earningsData?.data?.data || []
        const overview = earningsData?.data?.overview || {
            totalBranch: 0,
            totalStudents: 0,
            totalFees: 0,
            totalPaid: 0,
            totalUnpaid: 0
        }

        if (selectedBranch === "all") {
            return {
                stats: [
                    {
                        icon: Building2,
                        label: "Total Branches",
                        value: overview.totalBranch.toString(),
                        badge: "Active",
                        badgeColor: "bg-green-100 text-green-700",
                        bgColor: "bg-blue-50",
                        color: "text-blue-600",
                    },
                    {
                        icon: DollarSign,
                        label: "Fees Collected",
                        value: `$${overview.totalPaid.toLocaleString()}`,
                        color: "text-green-600",
                        bgColor: "bg-green-50",
                    },
                    {
                        icon: AlertCircle,
                        label: "Outstanding Fees",
                        value: `$${overview.totalUnpaid.toLocaleString()}`,
                        color: "text-orange-600",
                        bgColor: "bg-orange-50",
                    },
                    {
                        icon: FileText,
                        label: "Total Students",
                        value: overview.totalStudents.toLocaleString(),
                        color: "text-purple-600",
                        bgColor: "bg-purple-50",
                    },
                ]
            }
        } else {
            const branch = branches.find((b: any) => b.branchId === selectedBranch)
            if (!branch) return { stats: [] }

            return {
                stats: [
                    {
                        icon: Building2,
                        label: "Branch",
                        value: branch.branchName,
                        badge: "Active",
                        badgeColor: "bg-green-50 text-green-600",
                        bgColor: "bg-green-50",
                        color: "text-green-600",
                    },
                    {
                        icon: DollarSign,
                        label: "Fees Collected",
                        value: `$${branch.totalPaid.toLocaleString()}`,
                        color: "text-green-600",
                        bgColor: "bg-green-50",
                    },
                    {
                        icon: AlertCircle,
                        label: "Outstanding Fees",
                        value: `$${branch.totalUnpaid.toLocaleString()}`,
                        color: "text-green-600",
                        bgColor: "bg-green-50",
                    },
                    {
                        icon: FileText,
                        label: "Total Students",
                        value: branch.totalStudents.toLocaleString(),
                        color: "text-green-600",
                        bgColor: "bg-green-50",
                    },
                ]
            }
        }
    }, [selectedBranch, earningsData])

    return (
        <div className="space-y-5">
            {/* Filter Dropdown */}
            <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-start md:items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Earnings Overview</h2>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        {(earningsData?.data?.data || []).map((branch: any) => (
                            <SelectItem key={branch.branchId} value={branch.branchId}>
                                {branch.branchName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div key={stat.label} className="rounded-xl bg-white p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className={`rounded-lg ${stat.bgColor} p-3`}>
                                    <Icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                                {stat.badge && (
                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stat.badgeColor}`}>
                                        {stat.badge}
                                    </span>
                                )}
                            </div>
                            <div className="mt-4">
                                <p className="text-sm text-gray-600">{stat.label}</p>
                                <p className="mt-1 text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
