import { useGetInstitutionBranchesQuery } from "@/redux/features/branchManagement/branchManagementApi"

export function TopBranchesTable() {
    const { data: branchesResponse, isLoading } = useGetInstitutionBranchesQuery({ page: 1, limit: 100 })
    console.log(branchesResponse, "branchesResponse")

    const branchesData = branchesResponse?.data?.data || branchesResponse?.data || []

    const topBranches = [...branchesData]
        .map((b: any) => ({
            name: b.name || b.branchName || b.schoolName || "Unknown Branch",
            contact: b.contact || b.phone || b.email || "N/A",
            students: b.students?.toString() || b.totalStudents?.toString() || "0",
            teachers: b.teachers?.toString() || b.totalTeachers?.toString() || "0",
            attendance: b.attendance?.toString() || b.averageAttendance?.toString() || "0%",
            earnings: b.earnings?.toString() || b.feeCollection?.toString() || b.totalEarnings?.toString() || "0%"
        }))
        .sort((a, b) => parseInt(a.students.replace(/,/g, '')) - parseInt(b.students.replace(/,/g, '')))
        .reverse()
        .slice(0, 5)

    return (
        <div className="rounded-xl bg-white py-4 shadow-sm sm:py-6">
            <h2 className="mb-4 px-4 text-lg font-semibold text-gray-900 sm:px-6">Top Branches</h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }} className="rounded-t-lg">
                        <tr>
                            <th className="whitespace-nowrap rounded-tl-lg pb-3 pl-6 pt-3 text-left text-sm font-semibold text-white min-w-[200px]">Branch Name</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Contact</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-right text-sm font-semibold text-white min-w-[100px]">Students</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-right text-sm font-semibold text-white min-w-[100px]">Teachers</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-right text-sm font-semibold text-white min-w-[120px]">Attendance</th>
                            <th className="whitespace-nowrap rounded-tr-lg pb-3 pr-6 pt-3 text-right text-sm font-semibold text-white min-w-[120px]">Fee Collection</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="py-6 text-center text-gray-500">
                                    Loading top branches...
                                </td>
                            </tr>
                        ) : topBranches.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-6 text-center text-gray-500">
                                    No branches found.
                                </td>
                            </tr>
                        ) : (
                            topBranches.map((branch: any, index: number) => (
                                <tr key={index} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                                    <td className="whitespace-nowrap py-6 pl-6">
                                        <p className="font-medium text-gray-900">{branch.name}</p>
                                    </td>
                                    <td className="whitespace-nowrap py-6 text-sm text-gray-600">{branch.contact}</td>
                                    <td className="whitespace-nowrap py-6 text-right">
                                        <span className="font-semibold text-gray-900">{branch.students}</span>
                                    </td>
                                    <td className="whitespace-nowrap py-6 text-right">
                                        <span className="text-gray-600">{branch.teachers}</span>
                                    </td>
                                    <td className="whitespace-nowrap py-6 text-right">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${parseFloat(branch.attendance.replace('%', '')) >= 93
                                            ? 'bg-green-100 text-green-700'
                                            : parseFloat(branch.attendance.replace('%', '')) >= 90
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {branch.attendance}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap py-6 pr-6 text-right">
                                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${parseFloat(branch.earnings.replace('%', '')) >= 90
                                            ? 'bg-green-100 text-green-700'
                                            : parseFloat(branch.earnings.replace('%', '')) >= 80
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {branch.earnings}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
