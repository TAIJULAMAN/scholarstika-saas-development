"use client"

import { Users, GraduationCap, TrendingUp, DollarSign } from "lucide-react"
import { useGetInstitutionBranchStatsQuery } from "@/redux/features/branchManagement/branchManagementApi"

interface BranchStatsProps {
    branchId: string
}

export function BranchStats({ branchId }: BranchStatsProps) {
    const { data: statsResponse, isLoading } = useGetInstitutionBranchStatsQuery(branchId)
    const statsData = statsResponse?.data || statsResponse
    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(value)

    const stats = [
        {
            icon: Users,
            label: branchId === "all" ? "Total Students" : "Students",
            value: isLoading ? "..." : new Intl.NumberFormat("en-US").format(statsData?.totalStudents || 0),
            change: statsData?.studentChange || "+0%",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            icon: GraduationCap,
            label: branchId === "all" ? "Total Teachers" : "Teachers",
            value: isLoading ? "..." : new Intl.NumberFormat("en-US").format(statsData?.totalTeachers || 0),
            change: statsData?.teacherChange || "+0%",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            icon: TrendingUp,
            label: branchId === "all" ? "Avg Attendance" : "Attendance",
            value: isLoading ? "..." : `${statsData?.averageAttendance || 0}%`,
            change: statsData?.attendanceChange || "+0%",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            icon: DollarSign,
            label: branchId === "all" ? "Total Earning" : "Earning",
            value: isLoading ? "..." : formatCurrency(statsData?.totalEarnings || 0),
            change: statsData?.earningsChange || "+0%",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
    ]

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon
                return (
                    <div key={stat.label} className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className={`rounded-lg ${stat.bgColor} p-3`}>
                                <Icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <span className={`text-sm font-semibold ${stat.negative ? 'text-red-500' : 'text-green-500'}`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">{stat.label}</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
