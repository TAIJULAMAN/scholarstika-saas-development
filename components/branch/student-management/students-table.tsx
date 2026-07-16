"use client"

import { useMemo, useState } from "react"
import { Eye, Pencil, Plus, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddStudentDialog } from "./add-student-dialog"
import { EditStudentDialog } from "./edit-student-dialog"
import { ViewStudentDialog } from "./view-student-dialog"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { TablePagination } from "@/components/common/table-pagination"
import { useUser } from "@/context/user-context"
import {
    useCreateBranchStudentMutation,
    useDeleteBranchStudentMutation,
    useGetBranchStudentsQuery,
    useUpdateBranchStudentMutation,
} from "@/redux/features/branchManagement/branchUsersApi"
import { useGetInstitutionBranchOptionsQuery } from "@/redux/features/branchManagement/branchManagementApi"
import type { BranchStudent } from "@/types/branch-user"

type BranchOption = {
    id: string
    name: string
}

const gradeOptions = ["all", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"]

export function StudentsTable() {
    const { user } = useUser()
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<BranchStudent | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [gradeFilter, setGradeFilter] = useState("all")

    const itemsPerPage = 8

    const { data: studentsResponse, isLoading } = useGetBranchStudentsQuery({
        page: currentPage,
        limit: itemsPerPage,
        className: gradeFilter,
    })

    const [createBranchStudent, { isLoading: isCreating }] = useCreateBranchStudentMutation()
    const [updateBranchStudent, { isLoading: isUpdating }] = useUpdateBranchStudentMutation()
    const [deleteBranchStudent] = useDeleteBranchStudentMutation()
    const { data: branchOptionsResponse } = useGetInstitutionBranchOptionsQuery(undefined)

    const listPayload = studentsResponse?.data ?? studentsResponse
    const currentStudents = useMemo<BranchStudent[]>(
        () => listPayload?.data ?? [],
        [listPayload]
    )
    const branchOptionsRaw = branchOptionsResponse?.data?.data || branchOptionsResponse?.data || branchOptionsResponse || []
    const branchOptions = Array.isArray(branchOptionsRaw) ? branchOptionsRaw : []
    const meta = listPayload?.meta ?? {
        page: currentPage,
        limit: itemsPerPage,
        total: currentStudents.length,
        totalPage: 1,
    }

    const handleView = (student: BranchStudent) => {
        setSelectedStudent(student)
        setIsViewDialogOpen(true)
    }

    const handleEdit = (student: BranchStudent) => {
        setSelectedStudent(student)
        setIsEditDialogOpen(true)
    }

    const handleDelete = (student: BranchStudent) => {
        setSelectedStudent(student)
        setIsDeleteDialogOpen(true)
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
        name: string
        email: string
        branchName: string
        className: string
        guardianName: string
        guardianPhone: string
        password: string
        subscriptionId: string
    }) => {
        try {
            await createBranchStudent(payload).unwrap()
            return null
        } catch (error) {
            return extractErrorMessage(error)
        }
    }

    const handleUpdate = async (
        id: string,
        payload: {
            name: string
            email: string
            branchName: string
            className: string
            guardianName: string
            guardianPhone: string
        }
    ) => {
        try {
            await updateBranchStudent({ id, ...payload }).unwrap()
            return null
        } catch (error) {
            return extractErrorMessage(error)
        }
    }

    const handleConfirmDelete = async () => {
        if (!selectedStudent) {
            return
        }

        try {
            await deleteBranchStudent(selectedStudent.id).unwrap()
            setIsDeleteDialogOpen(false)
            setSelectedStudent(null)
        } catch (error) {
            console.error("Failed to delete student", error)
        }
    }

    return (
        <div className="rounded-xl bg-white py-4 shadow-sm sm:py-6">
            <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4 px-4 sm:px-6">
                <h2 className="text-lg font-semibold text-gray-900">Students Directory</h2>
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

                    <Select
                        value={gradeFilter}
                        onValueChange={(value) => {
                            setGradeFilter(value)
                            setCurrentPage(1)
                        }}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All Grades" />
                        </SelectTrigger>
                        <SelectContent>
                            {gradeOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option === "all" ? "All Grades" : option}
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
                        Add New Student
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead style={{ backgroundColor: "rgba(16, 185, 129, 0.8)" }} className="rounded-t-lg">
                        <tr>
                            <th className="whitespace-nowrap rounded-tl-lg pb-3 pl-6 pt-3 text-left text-sm font-semibold text-white min-w-[250px]">Student</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Branch</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[120px]">Grade</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Phone</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[200px]">Guardian</th>
                            <th className="whitespace-nowrap rounded-tr-lg pb-3 pr-6 pt-3 text-right text-sm font-semibold text-white min-w-[150px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                                    Loading students...
                                </td>
                            </tr>
                        ) : currentStudents.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No students found yet.
                                </td>
                            </tr>
                        ) : (
                            currentStudents.map((student) => (
                                <tr key={student.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                                    <td className="whitespace-nowrap py-4 pl-6">
                                        <div className="flex flex-row items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={student.photo || undefined} />
                                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                                    {student.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-gray-900">{student.name}</p>
                                                <p className="text-sm text-gray-600">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-4 text-sm text-gray-700">{student.branchName}</td>
                                    <td className="whitespace-nowrap py-4 text-sm text-gray-700">{student.className}</td>
                                    <td className="whitespace-nowrap py-4 text-sm text-gray-700">{student.guardianPhone}</td>
                                    <td className="whitespace-nowrap py-4 text-sm text-gray-700">{student.guardianName}</td>
                                    <td className="whitespace-nowrap py-4 pr-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleView(student)}
                                                className="rounded-lg p-2 text-blue-600"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(student)}
                                                className="rounded-lg p-2 text-purple-600"
                                                title="Edit Student"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student)}
                                                className="rounded-lg p-2 text-red-600"
                                                title="Delete Student"
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
                itemLabel="students"
            />

            <AddStudentDialog
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                branchName={user?.schoolName}
                branchOptions={branchOptions}
                subscriptionId={user?.subscriptionId}
                isLoading={isCreating}
                onSubmit={handleCreate}
            />
            {selectedStudent && (
                <>
                    <EditStudentDialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        student={selectedStudent}
                        isLoading={isUpdating}
                        onSubmit={handleUpdate}
                    />
                    <ViewStudentDialog
                        open={isViewDialogOpen}
                        onOpenChange={setIsViewDialogOpen}
                        student={selectedStudent}
                    />
                    <DeleteConfirmationDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        studentName={selectedStudent.name}
                        onConfirm={handleConfirmDelete}
                    />
                </>
            )}
        </div>
    )
}
