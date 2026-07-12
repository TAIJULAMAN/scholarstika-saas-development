import { useGetTotalCountOfInstitutionQuery } from "@/redux/features/institutionAndBranch/institutionDashboard/institutionDashboardApi"
import { useGetMySubscriptionQuery } from "@/redux/features/institutionAndBranch/mySubscription/mySubscriptionApi"
import { Building2, Users, GraduationCap, TrendingUp } from "lucide-react"
import { useSelector } from "react-redux"


export function DashboardStats() {

    useGetMySubscriptionQuery(undefined)

    const { subscriptionId } = useSelector((state: any) => state.auth)
    console.log("subscriptionId of aman", subscriptionId);
    const { data: institutionData, isLoading, isError } = useGetTotalCountOfInstitutionQuery(subscriptionId, {
        skip: !subscriptionId
    })
    console.log("institutionData of aman", institutionData);

    const data = institutionData?.data || {}

    console.log("Data of aman", data);

    const stats = [
        { icon: Building2, label: "Total Branches", value: isLoading ? "..." : (data.totalTeacher || 0), color: "text-blue-600", bgColor: "bg-blue-50" },
        { icon: Users, label: "Total Students", value: isLoading ? "..." : (data.totalStudent || 0), color: "text-green-600", bgColor: "bg-green-50" },
        { icon: GraduationCap, label: "Total Teachers", value: isLoading ? "..." : (data.totalTeacher || 0), color: "text-orange-600", bgColor: "bg-orange-50" },
        { icon: TrendingUp, label: "Total Earnings", value: isLoading ? "..." : `$${data.totalPaidAmount || 0}`, color: "text-purple-600", bgColor: "bg-purple-50" },
    ]

    return (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon
                return (
                    <div key={stat.label} className="rounded-xl bg-white p-4 shadow-sm sm:p-6">
                        <div className="flex items-center justify-between">
                            <div className={`rounded-lg ${stat.bgColor} p-3`}>
                                <Icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
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
