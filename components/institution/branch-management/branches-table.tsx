"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, Pencil, Trash2, Plus, DollarSign } from "lucide-react"
import { EditBranchDialog } from "./edit-branch-dialog"
import { ViewBranchDialog } from "./view-branch-dialog"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { PriceOverrideDialog } from "./price-override-dialog"
import { TablePagination } from "@/components/common/table-pagination"
import { InstitutionBranch } from "@/types/institution-branch"
import {
    useDeleteInstitutionBranchMutation,
    useGetInstitutionBranchesQuery,
    useOverrideInstitutionBranchPriceMutation,
    useUpdateInstitutionBranchMutation,
} from "@/redux/features/branchManagement/branchManagementApi"
import { toast } from "sonner"

interface BranchesTableProps {
    branchId: string
}

export function BranchesTable({ branchId }: BranchesTableProps) {
    const router = useRouter()
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isPriceOverrideOpen, setIsPriceOverrideOpen] = useState(false)
    const [selectedBranch, setSelectedBranch] = useState<InstitutionBranch | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [updateBranch] = useUpdateInstitutionBranchMutation()
    const [deleteBranch] = useDeleteInstitutionBranchMutation()
    const [overridePrice] = useOverrideInstitutionBranchPriceMutation()

    const itemsPerPage = 8
    const { data: branchesResponse, isLoading } = useGetInstitutionBranchesQuery({
        branchId,
        page: currentPage,
        limit: itemsPerPage,
    })
    const branchesPayload = branchesResponse?.data || branchesResponse
    const currentBranches = branchesPayload?.data || []
    const meta = branchesPayload?.meta
    const totalPages = Math.max(meta?.totalPage || 1, 1)
    const totalItems = meta?.total || 0

    const handleView = (branch: InstitutionBranch) => {
        setSelectedBranch(branch)
        setIsViewDialogOpen(true)
    }

    const handleEdit = (branch: InstitutionBranch) => {
        setSelectedBranch(branch)
        setIsEditDialogOpen(true)
    }

    const handleDelete = (branch: InstitutionBranch) => {
        setSelectedBranch(branch)
        setIsDeleteDialogOpen(true)
    }

    const handlePriceOverride = (branch: InstitutionBranch) => {
        setSelectedBranch(branch)
        setIsPriceOverrideOpen(true)
    }

    const handleUpdateBranch = async (data: {
        id: string
        name: string
        type: string
        location: string
        contact: string
    }) => {
        try {
            await updateBranch(data).unwrap()
            toast.success("Branch updated successfully")
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update branch")
        }
    }

    const handleDeleteBranch = async () => {
        if (!selectedBranch) return

        try {
            await deleteBranch(selectedBranch.id).unwrap()
            toast.success("Branch deleted successfully")
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete branch")
        }
    }

    const handleOverridePrice = async (data: {
        id: string
        annualPriceUsd: number
        overrideReason: string
    }) => {
        try {
            await overridePrice(data).unwrap()
            toast.success("Branch pricing updated successfully")
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update branch pricing")
        }
    }

    return (
        <div className="rounded-xl bg-white py-4 shadow-sm sm:py-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
                <h2 className="text-lg font-semibold text-gray-900">All Branches</h2>
                <button
                    onClick={() => router.push("/pricing?flow=add-branch&branches=1&source=branch-management")}
                    style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
                >
                    <Plus className="h-4 w-4" />
                    Add New Branch
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }} className="rounded-t-lg">
                        <tr>
                            <th className="whitespace-nowrap rounded-tl-lg pb-3 pl-6 pt-3 text-start  text-sm font-semibold text-white min-w-[200px]">Branch Name</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-start  text-sm font-semibold text-white min-w-[150px]">Type</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-start  text-sm font-semibold text-white min-w-[100px]">Students</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-start  text-sm font-semibold text-white min-w-[100px]">Teachers</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-start  text-sm font-semibold text-white min-w-[120px]">Attendance</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-start  text-sm font-semibold text-white min-w-[120px]">Earnings</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-start  text-sm font-semibold text-white min-w-[120px]">Annual Fee</th>
                            <th className="whitespace-nowrap rounded-tr-lg pb-3 pr-6 pt-3 text-right  text-sm font-semibold text-white min-w-[150px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading && (
                            <tr>
                                <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                                    Loading branches...
                                </td>
                            </tr>
                        )}
                        {!isLoading && currentBranches.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500">
                                    No branches found yet.
                                </td>
                            </tr>
                        )}
                        {currentBranches.map((branch) => (
                            <tr key={branch.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                                <td className="whitespace-nowrap py-6 pl-6">
                                    <p className="font-medium text-gray-900">{branch.name}</p>
                                </td>
                                <td className="whitespace-nowrap py-6 text-sm text-gray-600">{branch.type}</td>
                                <td className="whitespace-nowrap py-6">
                                    <span className="font-semibold text-gray-900">{new Intl.NumberFormat("en-US").format(branch.students)}</span>
                                </td>
                                <td className="whitespace-nowrap py-6">
                                    <span className="text-gray-600">{new Intl.NumberFormat("en-US").format(branch.teachers)}</span>
                                </td>
                                <td className="whitespace-nowrap py-6">
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${branch.attendance >= 93
                                        ? 'bg-green-100 text-green-700'
                                        : branch.attendance >= 90
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                        {branch.attendance}%
                                    </span>
                                </td>
                                <td className="whitespace-nowrap py-6">
                                    <span className="font-semibold text-gray-900">
                                        {new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                            maximumFractionDigits: 0,
                                        }).format(branch.earnings)}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap py-6">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-emerald-700">${branch.annualPriceUsd || 0}</span>
                                        {branch.isOverridden && (
                                            <span className="text-[10px] text-amber-600 font-medium">Overridden</span>
                                        )}
                                    </div>
                                </td>
                                <td className="whitespace-nowrap py-6 pr-6">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleView(branch)}
                                            className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(branch)}
                                            className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50"
                                            title="Edit Branch"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handlePriceOverride(branch)}
                                            className="rounded-lg p-2 text-amber-600 transition-colors hover:bg-amber-50"
                                            title="Override Price"
                                        >
                                            <DollarSign className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(branch)}
                                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                                            title="Delete Branch"
                                        >
                                            <Trash2 className="h-4 w-4" />
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
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                itemLabel="branches"
            />

            {selectedBranch && (
                <>
                    <EditBranchDialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        branch={selectedBranch}
                        onSubmit={handleUpdateBranch}
                    />
                    <ViewBranchDialog
                        open={isViewDialogOpen}
                        onOpenChange={setIsViewDialogOpen}
                        branch={selectedBranch}
                    />
                    <DeleteConfirmationDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        branchName={selectedBranch.name}
                        onConfirm={handleDeleteBranch}
                    />
                    <PriceOverrideDialog
                        open={isPriceOverrideOpen}
                        onOpenChange={setIsPriceOverrideOpen}
                        branch={selectedBranch}
                        onSubmit={handleOverridePrice}
                    />
                </>
            )}
        </div>
    )
}
