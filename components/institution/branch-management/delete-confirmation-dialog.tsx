"use client"

import { useState } from "react"
import { AlertTriangle, X } from "lucide-react"

interface DeleteConfirmationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    branchName: string
    onConfirm: () => Promise<void>
}

export function DeleteConfirmationDialog({ open, onOpenChange, branchName, onConfirm }: DeleteConfirmationDialogProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        await onConfirm()
        onOpenChange(false)
        setIsDeleting(false)
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-2 md:mx-0">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-red-100 p-2">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Delete Branch</h2>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete <span className="font-semibold text-gray-900">{branchName}</span>?
                    </p>
                    <p className="mt-2 text-sm text-red-600">
                        This action cannot be undone. All data associated with this branch will be permanently removed.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                    >
                        {isDeleting ? "Deleting..." : "Delete Branch"}
                    </button>
                </div>
            </div>
        </div>
    )
}
