"use client"

import { useEffect, useMemo, useState } from "react"
import { Eye, EyeOff, X } from "lucide-react"

type AddStudentPayload = {
    name: string
    email: string
    branchName: string
    className: string
    guardianName: string
    guardianPhone: string
    password: string
    subscriptionId: string
}

interface AddStudentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    branchName?: string
    branchOptions?: Array<{ id: string; name: string }>
    subscriptionId?: string
    isLoading?: boolean
    onSubmit: (payload: AddStudentPayload) => Promise<string | null>
}

const classOptions = [
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "Grade 11",
    "Grade 12",
]

const initialFormData = {
    name: "",
    email: "",
    className: "",
    guardianName: "",
    guardianPhone: "",
    password: "",
    confirmPassword: "",
}

export function AddStudentDialog({
    open,
    onOpenChange,
    branchName,
    branchOptions = [],
    subscriptionId,
    isLoading = false,
    onSubmit,
}: AddStudentDialogProps) {
    const [formData, setFormData] = useState(initialFormData)
    const [selectedBranchName, setSelectedBranchName] = useState("")
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const branchOptionsWithFallback = useMemo(() => {
        if (branchOptions.length > 0) {
            return branchOptions
        }

        return branchName ? [{ id: branchName, name: branchName }] : []
    }, [branchOptions, branchName])

    useEffect(() => {
        if (open) {
            setFormData(initialFormData)
            setError("")
            setShowPassword(false)
            setShowConfirmPassword(false)
            setSelectedBranchName(branchOptionsWithFallback[0]?.name || branchName || "")
        }
    }, [open, branchName, branchOptionsWithFallback])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!branchName || !subscriptionId) {
            setError("Branch information is missing. Please sign in again.")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Password and confirm password do not match.")
            return
        }

        if (!selectedBranchName) {
            setError("Please select a branch.")
            return
        }

        const result = await onSubmit({
            name: formData.name.trim(),
            email: formData.email.trim(),
            branchName: selectedBranchName,
            className: formData.className,
            guardianName: formData.guardianName.trim(),
            guardianPhone: formData.guardianPhone.trim(),
            password: formData.password,
            subscriptionId,
        })

        if (result) {
            setError(result)
            return
        }

        onOpenChange(false)
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-2 md:mx-0">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Student</h2>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Student Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="Enter student name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="student@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Branch <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={selectedBranchName}
                            onChange={(e) => setSelectedBranchName(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                            <option value="">Select branch</option>
                            {branchOptionsWithFallback.map((branch: any, index: number) => {
                                const branchName = branch.schoolName || branch.name || `Unnamed Branch ${index}`;
                                return (
                                    <option key={branch.id || `branch-${index}`} value={branchName}>
                                        {branchName}
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Grade/Class <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={formData.className}
                            onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                            <option value="">Select grade</option>
                            {classOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Guardian Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.guardianName}
                            onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="Enter guardian name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.guardianPhone}
                            onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="123-456-7890"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="Set login password"
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
                        <label className="block text-sm font-medium text-gray-700">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                placeholder="Confirm login password"
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

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{ backgroundColor: "rgba(16, 185, 129, 0.8)" }}
                            className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isLoading ? "Adding..." : "Add Student"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
