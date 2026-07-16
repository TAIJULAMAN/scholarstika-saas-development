"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TablePagination } from "@/components/common/table-pagination"
import { AddManagerDialog } from "@/components/institution/staff-management/add-manager-dialog"
import { ViewManagerDialog } from "@/components/institution/staff-management/view-manager-dialog"
import { EditManagerDialog } from "@/components/institution/staff-management/edit-manager-dialog"
import { DeleteManagerDialog } from "@/components/institution/staff-management/delete-manager-dialog"
import { Search, Plus, Pencil, Trash2, Eye, Mail, Phone, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import {
    useCreateBranchAdminMutation,
    useDeleteBranchAdminMutation,
    useGetInstitutionBranchOptionsQuery,
    useGetMyBranchAdminsQuery,
    useUpdateBranchAdminMutation,
} from "@/redux/features/branchManagement/branchManagementApi"
import { BranchAdmin, BranchAdminFormData } from "@/types/branch-admin"

export default function StaffManagementPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedManager, setSelectedManager] = useState<BranchAdmin | null>(null)

    const itemsPerPage = 10
    const { data: branchAdminsResponse, isLoading } = useGetMyBranchAdminsQuery({
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: searchQuery || undefined,
    })
    const { data: branchOptionsResponse } = useGetInstitutionBranchOptionsQuery(undefined)
    const [createBranchAdmin, { isLoading: isCreating }] = useCreateBranchAdminMutation()
    const [updateBranchAdmin, { isLoading: isUpdating }] = useUpdateBranchAdminMutation()
    const [deleteBranchAdmin, { isLoading: isDeleting }] = useDeleteBranchAdminMutation()

    const branchAdminsPayload = branchAdminsResponse?.data || branchAdminsResponse
    const managers: BranchAdmin[] = branchAdminsPayload?.data || []
    const meta = branchAdminsPayload?.meta
    const totalPages = Math.max(meta?.totalPage || 1, 1)
    const totalItems = meta?.total || 0
    const branchOptionsRaw = branchOptionsResponse?.data?.data || branchOptionsResponse?.data || branchOptionsResponse || []
    const branchOptions = Array.isArray(branchOptionsRaw) ? branchOptionsRaw : []

    const branchCodeMap = useMemo(
        () =>
            new Map(
                branchOptions.map((branch: any) => [
                    branch.schoolName || branch.name,
                    branch.id.slice(0, 8).toUpperCase(),
                ]),
            ),
        [branchOptions],
    )

    const handleView = (manager: BranchAdmin) => {
        setSelectedManager(manager)
        setIsViewDialogOpen(true)
    }

    const handleEdit = (manager: BranchAdmin) => {
        setSelectedManager(manager)
        setIsEditDialogOpen(true)
    }

    const handleDelete = (manager: BranchAdmin) => {
        setSelectedManager(manager)
        setIsDeleteDialogOpen(true)
    }

    const handleCreate = async (data: BranchAdminFormData) => {
        try {
            await createBranchAdmin({
                ...data,
                role: "BRANCH_ADMIN",
            }).unwrap()
            toast.success("Branch admin created successfully")
            setIsAddDialogOpen(false)
            return null
        } catch (error: any) {
            const message = error?.data?.message || "Failed to create branch admin"
            toast.error(message)
            return message
        }
    }

    const handleUpdate = async (data: {
        id: string
        fullName: string
        emailAddress: string
        phoneNumber: string
        assignBranch: string
        joinDate: string
        subscriptionId?: string
    }) => {
        try {
            await updateBranchAdmin(data).unwrap()
            toast.success("Branch admin updated successfully")
            setIsEditDialogOpen(false)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update branch admin")
        }
    }

    const handleDeleteConfirm = async () => {
        if (!selectedManager) {
            return
        }

        try {
            await deleteBranchAdmin(selectedManager.id).unwrap()
            toast.success("Branch admin deleted successfully")
            setIsDeleteDialogOpen(false)
            setSelectedManager(null)
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete branch admin")
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-white py-4 shadow-sm sm:py-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
                    <h2 className="text-lg font-semibold text-gray-900">Branch Admins</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search admins..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="pl-10 w-full sm:w-64"
                            />
                        </div>
                        <Button
                            onClick={() => setIsAddDialogOpen(true)}
                            style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }}
                            className="text-white"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Admin
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }} className="rounded-t-lg">
                            <tr>
                                <th className="whitespace-nowrap rounded-tl-lg pb-3 pl-6 pt-3 text-left text-sm font-semibold text-white min-w-[200px]">Admin</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Branch</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[200px]">Contact</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[120px]">Joined Date</th>
                                <th className="whitespace-nowrap rounded-tr-lg pb-3 pr-10 pt-3 text-right text-sm font-semibold text-white min-w-[100px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                                        Loading branch admins...
                                    </td>
                                </tr>
                            )}
                            {!isLoading && managers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                                        No branch admins found yet.
                                    </td>
                                </tr>
                            )}
                            {managers.map((manager) => (
                                <tr key={manager.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="whitespace-nowrap py-6 pl-6">
                                        <div>
                                            <p className="font-semibold text-gray-900">{manager.fullName}</p>
                                            <p className="text-xs text-gray-500">{manager.emailAddress}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-6">
                                        <div>
                                            <p className="font-medium text-gray-900">{manager.assignBranch}</p>
                                            <p className="text-xs text-gray-500">{branchCodeMap.get(manager.assignBranch) || manager.id.slice(0, 8).toUpperCase()}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Mail className="h-3 w-3" />
                                                <span className="text-xs">{manager.emailAddress}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="h-3 w-3" />
                                                <span className="text-xs">{manager.phoneNumber}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-6 text-sm text-gray-600">
                                        {new Date(manager.joinDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>
                                    <td className="whitespace-nowrap py-6 pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href="/institution/messages"
                                                className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                title="Message"
                                            >
                                                <MessageSquare className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleView(manager)}
                                                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(manager)}
                                                className="rounded-lg p-2 text-green-600 hover:bg-green-50 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(manager)}
                                                className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                                                title="Delete"
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
                    itemLabel="admins"
                />
            </div>

            <AddManagerDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                branchOptions={branchOptions}
                onSubmit={handleCreate}
                isSubmitting={isCreating}
            />
            {selectedManager && (
                <>
                    <ViewManagerDialog
                        open={isViewDialogOpen}
                        onOpenChange={setIsViewDialogOpen}
                        manager={selectedManager}
                    />
                    <EditManagerDialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        manager={selectedManager}
                        branchOptions={branchOptions}
                        onSubmit={handleUpdate}
                        isSubmitting={isUpdating}
                    />
                    <DeleteManagerDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        managerName={selectedManager.fullName}
                        onConfirm={handleDeleteConfirm}
                        isDeleting={isDeleting}
                    />
                </>
            )}
        </div>
    )
}
