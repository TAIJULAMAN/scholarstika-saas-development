"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TablePagination } from "@/components/common/table-pagination"
import { Search, Plus, Pencil, Trash2, Eye, Mail, Phone, UserPlus, EyeOff } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ViewStaffDialog } from "@/components/branch/staff-management/view-staff-dialog"
import { EditStaffDialog } from "@/components/branch/staff-management/edit-staff-dialog"
import { DeleteStaffDialog } from "@/components/branch/staff-management/delete-staff-dialog"
import { useUser } from "@/context/user-context"
import {
    useCreateBranchStaffMemberMutation,
    useDeleteBranchStaffMemberMutation,
    useGetBranchStaffMembersQuery,
    useGetBranchStudentsQuery,
    useUpdateBranchStaffMemberMutation,
} from "@/redux/features/branchManagement/branchUsersApi"
import type { BranchStaff, BranchStaffRole, BranchStudent } from "@/types/branch-user"

const roleOptions: Array<{ value: BranchStaffRole; label: string }> = [
    { value: "parent", label: "Parent" },
    { value: "bursar", label: "Bursar" },
    { value: "nurse", label: "Nurse" },
]

const formatRole = (role: string) => role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()

export default function BranchStaffManagementPage() {
    const { user } = useUser()
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<BranchStaff | null>(null)
    const [selectedRole, setSelectedRole] = useState<BranchStaffRole | "">("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [addError, setAddError] = useState("")
    const [addFormData, setAddFormData] = useState({
        name: "",
        userName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        studentId: "",
    })

    const itemsPerPage = 8

    const { data: staffResponse, isLoading: isStaffLoading } = useGetBranchStaffMembersQuery({
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: searchQuery || undefined,
        role: roleFilter,
    })

    const { data: studentsResponse } = useGetBranchStudentsQuery({
        page: 1,
        limit: 100,
    })

    const [createBranchStaffMember, { isLoading: isCreating }] = useCreateBranchStaffMemberMutation()
    const [updateBranchStaffMember, { isLoading: isUpdating }] = useUpdateBranchStaffMemberMutation()
    const [deleteBranchStaffMember, { isLoading: isDeleting }] = useDeleteBranchStaffMemberMutation()

    const staffPayload = staffResponse?.data ?? staffResponse
    const currentMembers = useMemo<BranchStaff[]>(
        () => staffPayload?.data ?? [],
        [staffPayload]
    )
    const meta = staffPayload?.meta ?? {
        page: currentPage,
        limit: itemsPerPage,
        total: currentMembers.length,
        totalPage: 1,
    }

    const studentsPayload = studentsResponse?.data ?? studentsResponse
    const branchStudents = useMemo<BranchStudent[]>(
        () => studentsPayload?.data ?? [],
        [studentsPayload]
    )

    const getRoleBadgeColor = (role: string) => {
        switch (role.toLowerCase()) {
            case "parent":
                return "bg-orange-100 text-orange-800"
            case "bursar":
                return "bg-green-100 text-green-800"
            case "nurse":
                return "bg-pink-100 text-pink-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const resetAddForm = () => {
        setSelectedRole("")
        setAddError("")
        setShowPassword(false)
        setShowConfirmPassword(false)
        setAddFormData({
            name: "",
            userName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
            studentId: "",
        })
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

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setAddError("")

        if (!selectedRole) {
            setAddError("Please select a role.")
            return
        }

        if (!user?.subscriptionId) {
            setAddError("Subscription information is missing. Please sign in again.")
            return
        }

        if (addFormData.password !== addFormData.confirmPassword) {
            setAddError("Password and confirm password do not match.")
            return
        }

        if (selectedRole === "parent" && !addFormData.studentId) {
            setAddError("Please select the linked student for this parent.")
            return
        }

        try {
            await createBranchStaffMember({
                name: addFormData.name.trim(),
                role: selectedRole,
                email: addFormData.email.trim(),
                phoneNumber: addFormData.phoneNumber.trim(),
                password: addFormData.password,
                subscriptionId: user.subscriptionId,
                ...(selectedRole === "parent" ? { studentId: addFormData.studentId } : {}),
            }).unwrap()

            setIsAddDialogOpen(false)
            resetAddForm()
        } catch (error) {
            setAddError(extractErrorMessage(error))
        }
    }

    const handleEdit = (member: BranchStaff) => {
        setSelectedMember(member)
        setIsEditDialogOpen(true)
    }

    const handleView = (member: BranchStaff) => {
        setSelectedMember(member)
        setIsViewDialogOpen(true)
    }

    const handleDelete = (member: BranchStaff) => {
        setSelectedMember(member)
        setIsDeleteDialogOpen(true)
    }

    const handleUpdate = async (
        id: string,
        payload: {
            name: string
            email: string
            phoneNumber: string
        }
    ) => {
        try {
            await updateBranchStaffMember({ id, ...payload }).unwrap()
            return null
        } catch (error) {
            return extractErrorMessage(error)
        }
    }

    const handleConfirmDelete = async () => {
        if (!selectedMember) {
            return
        }

        try {
            await deleteBranchStaffMember(selectedMember.id).unwrap()
            setIsDeleteDialogOpen(false)
            setSelectedMember(null)
        } catch (error) {
            console.error("Failed to delete staff member", error)
        }
    }

    return (
        <div className="space-y-5">
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-gray-900">Staff Directory</h2>
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        <Select
                            value={roleFilter}
                            onValueChange={(value) => {
                                setRoleFilter(value)
                                setCurrentPage(1)
                            }}
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="All Roles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                {roleOptions.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search staff..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setCurrentPage(1)
                                }}
                                className="pl-10 w-64"
                            />
                        </div>

                        <Dialog
                            open={isAddDialogOpen}
                            onOpenChange={(open) => {
                                setIsAddDialogOpen(open)
                                if (!open) {
                                    resetAddForm()
                                }
                            }}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    style={{ backgroundColor: "rgba(16, 185, 129, 0.8)" }}
                                    className="text-white"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Member
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-full md:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Add New Member</DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4 py-4" onSubmit={handleCreate}>
                                    {addError && (
                                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                            {addError}
                                        </div>
                                    )}

                                    <div>
                                        <Label>Select Role</Label>
                                        <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as BranchStaffRole)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roleOptions.map((role) => (
                                                    <SelectItem key={role.value} value={role.value}>
                                                        {role.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Name</Label>
                                        <Input
                                            placeholder="Enter full name"
                                            value={addFormData.name}
                                            onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>User Name / Login ID</Label>
                                        <Input
                                            placeholder="Auto-generated after create"
                                            value={addFormData.userName}
                                            onChange={(e) => setAddFormData({ ...addFormData, userName: e.target.value })}
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            placeholder="email@example.com"
                                            value={addFormData.email}
                                            onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Phone</Label>
                                        <Input
                                            placeholder="+1 (555) 000-0000"
                                            value={addFormData.phoneNumber}
                                            onChange={(e) => setAddFormData({ ...addFormData, phoneNumber: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label>Login Password</Label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Set temporary password"
                                                value={addFormData.password}
                                                onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                                                required
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <Label>Confirm Password</Label>
                                        <div className="relative">
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm temporary password"
                                                value={addFormData.confirmPassword}
                                                onChange={(e) => setAddFormData({ ...addFormData, confirmPassword: e.target.value })}
                                                required
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    {selectedRole === "parent" && (
                                        <div>
                                            <Label>Linked Student</Label>
                                            <Select value={addFormData.studentId} onValueChange={(value) => setAddFormData({ ...addFormData, studentId: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select student" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {branchStudents.map((student) => (
                                                        <SelectItem key={student.studentId} value={student.studentId}>
                                                            {student.name} ({student.studentId})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                    <Button
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                                        disabled={isCreating}
                                    >
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        {isCreating ? "Adding..." : "Add Member"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead style={{ backgroundColor: "rgba(16, 185, 129, 0.8)" }} className="rounded-t-lg">
                            <tr>
                                <th className="whitespace-nowrap rounded-tl-lg pb-3 pl-6 pt-3 text-left text-sm font-semibold text-white min-w-[200px]">Name</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[120px]">Role</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Login ID</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Details</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[200px]">Contact</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Joined Date</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[100px]">Status</th>
                                <th className="whitespace-nowrap rounded-tr-lg pb-3 pr-6 pt-3 text-right text-sm font-semibold text-white min-w-[150px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isStaffLoading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                                        Loading staff members...
                                    </td>
                                </tr>
                            ) : currentMembers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-500">
                                        No staff members found yet.
                                    </td>
                                </tr>
                            ) : (
                                currentMembers.map((member) => (
                                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="whitespace-nowrap py-4 pl-6">
                                            <p className="font-semibold text-gray-900">{member.name}</p>
                                        </td>
                                        <td className="whitespace-nowrap py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeColor(member.role)}`}>
                                                {formatRole(member.role)}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap py-4 text-sm font-medium text-gray-700">
                                            {member.generateId}
                                        </td>
                                        <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                                            {member.studentId ? `Linked student: ${member.studentId}` : `${formatRole(member.role)} account`}
                                        </td>
                                        <td className="whitespace-nowrap py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="text-xs">{member.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Phone className="h-3 w-3" />
                                                    <span className="text-xs">{member.phoneNumber}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap py-4 text-sm text-gray-600">
                                            {member.createdAt
                                                ? new Date(member.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })
                                                : "Not available"}
                                        </td>
                                        <td className="whitespace-nowrap py-4">
                                            <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                                                {member.status || "ACTIVE"}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap py-4 pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleView(member)}
                                                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(member)}
                                                    className="rounded-lg p-2 text-green-600 hover:bg-green-50 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(member)}
                                                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Delete"
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
                    itemLabel="members"
                />
            </div>

            {selectedMember && (
                <>
                    <ViewStaffDialog
                        open={isViewDialogOpen}
                        onOpenChange={setIsViewDialogOpen}
                        member={selectedMember}
                    />
                    <EditStaffDialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        member={selectedMember}
                        isLoading={isUpdating}
                        onSubmit={handleUpdate}
                    />
                    <DeleteStaffDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        memberName={selectedMember.name}
                        memberRole={formatRole(selectedMember.role)}
                        onConfirm={handleConfirmDelete}
                        isLoading={isDeleting}
                    />
                </>
            )}
        </div>
    )
}
