"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

import { InstitutionBranch } from "@/types/institution-branch"

interface EditBranchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    branch: InstitutionBranch
    onSubmit: (data: {
        id: string
        name: string
        type: string
        location: string
        contact: string
    }) => Promise<void>
}

export function EditBranchDialog({ open, onOpenChange, branch, onSubmit }: EditBranchDialogProps) {
    const [formData, setFormData] = useState({
        name: branch.name,
        type: branch.type,
        location: branch.location,
        contact: branch.contact,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        setFormData({
            name: branch.name,
            type: branch.type,
            location: branch.location,
            contact: branch.contact,
        })
    }, [branch])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        await onSubmit({
            id: branch.id,
            ...formData,
        })
        onOpenChange(false)
        setIsSubmitting(false)
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-2 md:mx-0">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Edit Branch</h2>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Branch Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Branch Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <option value="Primary School">Primary School</option>
                            <option value="Secondary School">Secondary School</option>
                            <option value="Primary & Secondary">Primary & Secondary</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Location <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Contact Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
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
                            disabled={isSubmitting}
                            className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                        >
                            {isSubmitting ? "Updating..." : "Update Branch"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
