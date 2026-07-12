"use client"

import { useState } from "react"
import { Bar } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetEarningGrowthQuery } from "@/redux/features/institutionAndBranch/institutionDashboard/institutionDashboardApi"
import { useSelector } from "react-redux"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function EarningGrowthChart() {
    const [selectedYear, setSelectedYear] = useState("2026")
    const { subscriptionId } = useSelector((state: any) => state.auth)

    const { data: earningGrowthData, isLoading } = useGetEarningGrowthQuery(
        { year: selectedYear },
        { skip: !subscriptionId }
    )

    const monthlyStats = earningGrowthData?.data?.monthlyStats || []
    
    // Default to 0 if data isn't ready
    const chartDataValues = monthlyStats.length > 0 
        ? monthlyStats.map((stat: any) => stat.amount)
        : Array(12).fill(0)

    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            {
                label: "Revenue",
                data: chartDataValues,
                backgroundColor: "rgba(16, 185, 129, 0.8)",
                borderColor: "rgba(16, 185, 129, 1)",
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    }

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                padding: 12,
                borderRadius: 8,
                titleFont: {
                    size: 14,
                    weight: 'bold' as const,
                },
                bodyFont: {
                    size: 13,
                },
                callbacks: {
                    label: function (context: any) {
                        return `Revenue: $${context.parsed.y.toLocaleString()}`
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    color: "#6b7280",
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(229, 231, 235, 0.5)",
                },
                ticks: {
                    font: {
                        size: 11,
                    },
                    color: "#6b7280",
                    callback: function (value: any) {
                        return `$${(value / 1000).toFixed(0)}k`
                    },
                },
            },
        },
    }

    return (
        <div className="rounded-xl bg-white py-4 shadow-sm sm:py-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Earning Growth</h3>
                </div>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-full sm:w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="overflow-x-auto pb-4">
                <div className="h-64 md:min-w-[600px] px-4 sm:px-6">
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center text-gray-500">Loading chart data...</div>
                    ) : (
                        <Bar data={data} options={options} />
                    )}
                </div>
            </div>
        </div>
    )
}
