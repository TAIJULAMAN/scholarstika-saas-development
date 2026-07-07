"use client"

import { useEffect, useState } from "react"
import { Check, ChevronDown, Eye, EyeOff, X } from "lucide-react"

type AddTeacherPayload = {
    teacherName: string
    email: string
    phoneNumber: string
    branchName: string
    subject: string[]
    assignClass: string[]
    password: string
    address: string
    subscriptionId: string
}

interface AddTeacherDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    branchName?: string
    subscriptionId?: string
    isLoading?: boolean
    onSubmit: (payload: AddTeacherPayload) => Promise<string | null>
}

const subjects = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
]

const classOptions = ["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"]

const initialFormData = {
    teacherName: "",
    email: "",
    phoneNumber: "",
    subject: [] as string[],
    assignClass: "",
    password: "",
    confirmPassword: "",
    address: "",
}

export function AddTeacherDialog({
    open,
    onOpenChange,
    branchName,
    subscriptionId,
    isLoading = false,
    onSubmit,
}: AddTeacherDialogProps) {
    const [formData, setFormData] = useState(initialFormData)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false)

    useEffect(() => {
        if (open) {
            setFormData(initialFormData)
            setError("")
            setShowPassword(false)
            setShowConfirmPassword(false)
            setIsSubjectMenuOpen(false)
        }
    }, [open])

    const toggleSubject = (subjectName: string) => {
        setFormData((prev) => ({
            ...prev,
            subject: prev.subject.includes(subjectName)
                ? prev.subject.filter((item) => item !== subjectName)
                : [...prev.subject, subjectName],
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (!branchName || !subscriptionId) {
            setError("Branch information is missing. Please sign in again.")
            return
        }

        if (formData.subject.length === 0) {
            setError("Please select at least one subject.")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Password and confirm password do not match.")
            return
        }

        const result = await onSubmit({
            teacherName: formData.teacherName.trim(),
            email: formData.email.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            branchName,
            subject: formData.subject,
            assignClass: formData.assignClass ? [formData.assignClass] : [],
            password: formData.password,
            address: formData.address.trim(),
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
                    <h2 className="text-xl font-semibold text-gray-900">Add New Teacher</h2>
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
                            Teacher Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.teacherName}
                            onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="Enter teacher name"
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
                            placeholder="teacher@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Branch <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={branchName || ""}
                            onChange={() => {}}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                            <option value={branchName || ""}>{branchName || "Assigned branch"}</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700">Subjects</label>
                            <button
                                type="button"
                                onClick={() => setIsSubjectMenuOpen((prev) => !prev)}
                                className="mt-1 flex min-h-[42px] w-full items-center justify-between rounded-lg border border-gray-300 px-3 py-2 text-left text-sm"
                            >
                                <span className="truncate text-gray-700">
                                    {formData.subject.length > 0 ? formData.subject.join(", ") : "Select subjects"}
                                </span>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                            </button>
                            {isSubjectMenuOpen && (
                                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                                    <div className="max-h-40 space-y-1 overflow-auto">
                                        {subjects.map((subjectName) => {
                                            const checked = formData.subject.includes(subjectName)
                                            return (
                                                <button
                                                    key={subjectName}
                                                    type="button"
                                                    onClick={() => toggleSubject(subjectName)}
                                                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-gray-50"
                                                >
                                                    <span className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-300"}`}>
                                                        {checked ? <Check className="h-3 w-3" /> : null}
                                                    </span>
                                                    {subjectName}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Assigned Class</label>
                            <select
                                value={formData.assignClass}
                                onChange={(e) => setFormData({ ...formData, assignClass: e.target.value })}
                                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                                <option value="">Select Class</option>
                                {classOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="123-456-7890"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            placeholder="123 Main St, City, Country"
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
                            {isLoading ? "Adding..." : "Add Teacher"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
