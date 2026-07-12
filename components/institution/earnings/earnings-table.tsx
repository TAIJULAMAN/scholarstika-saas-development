"use client"

import { useState, useMemo } from "react"
import { Pencil, Trash2, FileDown, Plus, Eye } from "lucide-react"
import { TablePagination } from "@/components/common/table-pagination"
import { AddEarningDialog } from "./add-earning-dialog"
import { EditEarningDialog } from "./edit-earning-dialog"
import { ViewEarningDialog } from "./view-earning-dialog"
import { DeleteEarningDialog } from "./delete-earning-dialog"
import { useGetBranchTotalEarningsQuery } from "@/redux/features/institutionAndBranch/earnings/earningsApi"
import { downloadInvoiceAsPDF } from "@/lib/invoice-template"

export interface BranchEarnings {
    branchId: string;
    branchName: string;
    totalStudents: number;
    totalFees: number;
    totalPaid: number;
    totalUnpaid: number;
}

export function EarningsTable() {
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [sortBy, setSortBy] = useState("collected")
    const [currentPage, setCurrentPage] = useState(1)

    // Dialog states
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedEarning, setSelectedEarning] = useState<BranchEarnings | null>(null)

    const { data: earningsData, isLoading } = useGetBranchTotalEarningsQuery()
    const filteredEarnings = useMemo(() => {
        const branches: BranchEarnings[] = earningsData?.data?.data || []

        let filtered = branches.filter(branch => {
            const matchesSearch = branch.branchName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                branch.branchId?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesStatus = statusFilter === "all" ||
                (statusFilter === "paid" && branch.totalUnpaid === 0) ||
                (statusFilter === "pending" && branch.totalUnpaid > 0)

            return matchesSearch && matchesStatus
        })

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === "collected") return b.totalPaid - a.totalPaid
            if (sortBy === "outstanding") return b.totalUnpaid - a.totalUnpaid
            if (sortBy === "total") return b.totalStudents - a.totalStudents
            return 0
        })

        return filtered
    }, [searchQuery, statusFilter, sortBy, earningsData])

    // Pagination
    const itemsPerPage = 8
    const totalPages = Math.ceil(filteredEarnings.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentBranches = filteredEarnings.slice(startIndex, endIndex)

    const handleView = (earning: BranchEarnings) => {
        setSelectedEarning(earning)
        setIsViewDialogOpen(true)
    }

    return (
        <div className="space-y-4">
            {/* Earnings Table */}
            <div className="rounded-xl bg-white py-4 shadow-sm sm:py-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
                    <h2 className="text-lg font-semibold text-gray-900">Branch-wise Earnings</h2>
                    {/* <button
                        onClick={() => setIsAddDialogOpen(true)}
                        style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
                    >
                        <Plus className="h-4 w-4" />
                        Add New Earning
                    </button> */}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }} className="rounded-t-lg">
                            <tr>
                                <th className="whitespace-nowrap rounded-tl-lg pb-3 pl-6 pt-3 text-left text-sm font-semibold text-white min-w-[200px]">Branch</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-right text-sm font-semibold text-white min-w-[100px]">Students</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-right text-sm font-semibold text-white min-w-[120px]">Collected</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-right text-sm font-semibold text-white min-w-[120px]">Outstanding</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-right text-sm font-semibold text-white min-w-[120px]">Total</th>
                                <th className="whitespace-nowrap rounded-tr-lg pb-3 pr-10 pt-3 text-right text-sm font-semibold text-white min-w-[150px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBranches.map((branch) => (
                                <tr key={branch.branchId} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="whitespace-nowrap py-6 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-semibold text-gray-900">{branch.branchName}</p>
                                                <p className="text-xs text-gray-500">{branch.branchId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-6 text-right text-sm font-medium text-gray-900">{branch.totalStudents.toLocaleString()}</td>
                                    <td className="whitespace-nowrap py-6 text-right text-sm font-semibold text-green-600">${branch.totalPaid.toLocaleString()}</td>
                                    <td className="whitespace-nowrap py-6 text-right text-sm font-semibold text-orange-600">${branch.totalUnpaid.toLocaleString()}</td>
                                    <td className="whitespace-nowrap py-6 text-right text-sm font-bold text-gray-900">${branch.totalFees.toLocaleString()}</td>
                                    <td className="whitespace-nowrap py-6 pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleView(branch)}
                                                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {/* <button
                                                onClick={() => handleEdit(branch)}
                                                className="rounded-lg p-2 text-green-600 hover:bg-green-50 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(branch)}
                                                className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button> */}
                                            <button
                                                onClick={() => downloadInvoiceAsPDF(branch)}
                                                className="rounded-lg p-2 text-purple-600 hover:bg-purple-50 transition-colors"
                                                title="Download Invoice"
                                            >
                                                <FileDown className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredEarnings.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    itemLabel="branches"
                />
            </div>

            {/* Dialogs */}
            <AddEarningDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
            {selectedEarning && (
                <>
                    {/* <EditEarningDialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        earning={selectedEarning}
                    /> */}
                    <ViewEarningDialog
                        open={isViewDialogOpen}
                        onOpenChange={setIsViewDialogOpen}
                        earning={selectedEarning}
                    />
                    {/* <DeleteEarningDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        earningName={selectedEarning.branchName}
                    /> */}
                </>
            )}
        </div>
    )
}
