"use client"

import { X, AlertTriangle } from "lucide-react"

import { useDeleteAnnouncementMutation } from "@/redux/features/announcements/announcementsApi"

interface DeleteConfirmationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    announcementTitle: string
    announcementId: string
}

export function DeleteConfirmationDialog({ open, onOpenChange, announcementTitle, announcementId }: DeleteConfirmationDialogProps) {
    const [deleteAnnouncement, { isLoading }] = useDeleteAnnouncementMutation()
    const handleDelete = async () => {
        try {
            await deleteAnnouncement(announcementId).unwrap()
            onOpenChange(false)
        } catch (error: any) {
            const errorMessage = error?.data?.message || error?.error || "Unknown error occurred"
            alert(`Failed to delete: ${errorMessage}`)
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-2 md:mx-0">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="rounded-full bg-red-100 p-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Delete Announcement</h2>
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
                        Are you sure you want to delete the announcement{" "}
                        <span className="font-semibold text-gray-900">"{announcementTitle}"</span>?
                    </p>
                    <p className="mt-2 text-sm text-gray-600">This action cannot be undone.</p>
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
                        disabled={isLoading}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                        {isLoading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    )
}
