"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import type { BranchStudent } from "@/types/branch-user"

interface EditStudentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    student: BranchStudent
    isLoading?: boolean
    onSubmit: (id: string, payload: {
        name: string
        email: string
        branchName: string
        className: string
        guardianName: string
        guardianPhone: string
    }) => Promise<string | null>
}

const classOptions = ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"]

export function EditStudentDialog({
    open,
    onOpenChange,
    student,
    isLoading = false,
    onSubmit,
}: EditStudentDialogProps) {
    const [formData, setFormData] = useState({
        name: student.name,
        email: student.email,
        branchName: student.branchName,
        className: student.className,
        guardianName: student.guardianName,
        guardianPhone: student.guardianPhone,
    })
    const [error, setError] = useState("")

    useEffect(() => {
        if (open) {
            setFormData({
                name: student.name,
                email: student.email,
                branchName: student.branchName,
                className: student.className,
                guardianName: student.guardianName,
                guardianPhone: student.guardianPhone,
            })
            setError("")
        }
    }, [open, student])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const result = await onSubmit(student.id, formData)

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
                    <h2 className="text-xl font-semibold text-gray-900">Edit Student</h2>
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
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Branch <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.branchName}
                            disabled
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700"
                        />
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
                        />
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
                            {isLoading ? "Updating..." : "Update Student"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
