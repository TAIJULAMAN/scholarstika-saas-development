"use client"

import { useMemo, useState } from "react"
import { Eye, Pencil, Plus, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddTeacherDialog } from "./add-teacher-dialog"
import { EditTeacherDialog } from "./edit-teacher-dialog"
import { ViewTeacherDialog } from "./view-teacher-dialog"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { TablePagination } from "@/components/common/table-pagination"
import { useUser } from "@/context/user-context"
import {
    useCreateBranchTeacherMutation,
    useDeleteBranchTeacherMutation,
    useGetBranchTeachersQuery,
    useUpdateBranchTeacherMutation,
} from "@/redux/features/branchManagement/branchUsersApi"
import type { BranchTeacher } from "@/types/branch-user"

const classOptions = ["all", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"]

export function TeachersTable() {
    const { user } = useUser()
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedTeacher, setSelectedTeacher] = useState<BranchTeacher | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [classFilter, setClassFilter] = useState("all")

    const itemsPerPage = 8

    const { data: teachersResponse, isLoading } = useGetBranchTeachersQuery({
        page: currentPage,
        limit: itemsPerPage,
    })

    const [createBranchTeacher, { isLoading: isCreating }] = useCreateBranchTeacherMutation()
    const [updateBranchTeacher, { isLoading: isUpdating }] = useUpdateBranchTeacherMutation()
    const [deleteBranchTeacher, { isLoading: isDeleting }] = useDeleteBranchTeacherMutation()

    const listPayload = teachersResponse?.data ?? teachersResponse
    const allTeachers = useMemo<BranchTeacher[]>(
        () => listPayload?.data ?? [],
        [listPayload]
    )
    const filteredTeachers = useMemo(
        () =>
            classFilter === "all"
                ? allTeachers
                : allTeachers.filter((teacher) => teacher.assignClass?.includes(classFilter)),
        [allTeachers, classFilter]
    )
    const meta = listPayload?.meta ?? {
        page: currentPage,
        limit: itemsPerPage,
        total: filteredTeachers.length,
        totalPage: 1,
    }

    const extractErrorMessage = (error: unknown) => {
        const apiError = error as {
            data?: {
                message?: string
                errorMessages?: Array<{ message?: string }>
            }
        }

        return (
            apiError?.data?.message ||
            apiError?.data?.errorMessages?.[0]?.message ||
            "Something went wrong. Please try again."
        )
    }

    const handleCreate = async (payload: {
        teacherName: string
        email: string
        phoneNumber: string
        branchName: string
        subject: string[]
        assignClass: string[]
        password: string
        address: string
        subscriptionId: string
    }) => {
        try {
            await createBranchTeacher(payload).unwrap()
            return null
        } catch (error) {
            return extractErrorMessage(error)
        }
    }

    const handleUpdate = async (
        id: string,
        payload: {
            teacherName: string
            email: string
            phoneNumber: string
            branchName: string
            subject: string[]
            assignClass: string[]
            address: string
        }
    ) => {
        try {
            await updateBranchTeacher({ id, ...payload }).unwrap()
            return null
        } catch (error) {
            return extractErrorMessage(error)
        }
    }

    const handleDelete = async () => {
        if (!selectedTeacher) {
            return
        }

        try {
            await deleteBranchTeacher(selectedTeacher.id).unwrap()
            setIsDeleteDialogOpen(false)
            setSelectedTeacher(null)
        } catch (error) {
            console.error("Failed to delete teacher", error)
        }
    }

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">Teachers Directory</h2>
                <div className="flex flex-col md:flex-row items-center gap-3">
                    <Select value={user?.schoolName || "assigned"}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Assigned Branch" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={user?.schoolName || "assigned"}>
                                {user?.schoolName || "Assigned Branch"}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Assigned Class" />
                        </SelectTrigger>
                        <SelectContent>
                            {classOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option === "all" ? "All Classes" : option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <button
                        onClick={() => setIsAddDialogOpen(true)}
                        style={{ backgroundColor: "rgba(16, 185, 129, 0.8)" }}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
                    >
                        <Plus className="h-4 w-4" />
                        Add New Teacher
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead style={{ backgroundColor: "rgba(16, 185, 129, 0.8)" }} className="rounded-t-lg">
                        <tr>
                            <th className="whitespace-nowrap rounded-tl-lg pb-3 pl-6 pt-3 text-left text-sm font-semibold text-white min-w-[200px]">Teacher</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Branch</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[160px]">Subject</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Assigned Class</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Phone</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[200px]">Address</th>
                            <th className="whitespace-nowrap rounded-tr-lg pb-3 pr-6 pt-3 text-right text-sm font-semibold text-white min-w-[150px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                                    Loading teachers...
                                </td>
                            </tr>
                        ) : filteredTeachers.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No teachers found yet.
                                </td>
                            </tr>
                        ) : (
                            filteredTeachers.map((teacher) => (
                                <tr key={teacher.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                                    <td className="whitespace-nowrap py-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={teacher.photo || undefined} />
                                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                                    {teacher.teacherName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-gray-900">{teacher.teacherName}</p>
                                                <p className="text-sm text-gray-600">{teacher.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-4 text-sm text-gray-700">{teacher.branchName}</td>
                                    <td className="whitespace-nowrap py-4 text-sm text-gray-700">{teacher.subject.join(", ")}</td>
                                    <td className="whitespace-nowrap py-4 text-sm text-gray-700">
                                        {teacher.assignClass?.length ? teacher.assignClass.join(", ") : "Not assigned"}
                                    </td>
                                    <td className="whitespace-nowrap py-4 text-sm text-gray-700">{teacher.phoneNumber}</td>
                                    <td className="whitespace-nowrap py-4 text-sm text-gray-700">{teacher.address}</td>
                                    <td className="whitespace-nowrap py-4 pr-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedTeacher(teacher)
                                                    setIsViewDialogOpen(true)
                                                }}
                                                className="rounded-lg p-2 text-blue-600"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedTeacher(teacher)
                                                    setIsEditDialogOpen(true)
                                                }}
                                                className="rounded-lg p-2 text-green-600"
                                                title="Edit Teacher"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedTeacher(teacher)
                                                    setIsDeleteDialogOpen(true)
                                                }}
                                                className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                                                title="Delete Teacher"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <TablePagination
                currentPage={meta.page}
                totalPages={meta.totalPage || 1}
                totalItems={meta.total || 0}
                itemsPerPage={meta.limit || itemsPerPage}
                onPageChange={setCurrentPage}
                itemLabel="teachers"
            />

            <AddTeacherDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                branchName={user?.schoolName}
                subscriptionId={user?.subscriptionId}
                isLoading={isCreating}
                onSubmit={handleCreate}
            />
            {selectedTeacher && (
                <>
                    <EditTeacherDialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        teacher={selectedTeacher}
                        isLoading={isUpdating}
                        onSubmit={handleUpdate}
                    />
                    <ViewTeacherDialog
                        open={isViewDialogOpen}
                        onOpenChange={setIsViewDialogOpen}
                        teacher={selectedTeacher}
                    />
                    <DeleteConfirmationDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        teacherName={selectedTeacher.teacherName}
                        onConfirm={handleDelete}
                        isLoading={isDeleting}
                    />
                </>
            )}
        </div>
    )
}
