"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DeleteStaffDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    memberName: string
    memberRole: string
    onConfirm: () => Promise<void> | void
    isLoading?: boolean
}

export function DeleteStaffDialog({
    open,
    onOpenChange,
    memberName,
    memberRole,
    onConfirm,
    isLoading = false,
}: DeleteStaffDialogProps) {
    const handleDelete = () => {
        void onConfirm()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full md:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle>Delete Staff Member</DialogTitle>
                            <DialogDescription>This action cannot be undone</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete <span className="font-semibold text-gray-900">{memberName}</span> ({memberRole})?
                        This will permanently remove their access and all associated data.
                    </p>
                    <div className="rounded-lg bg-red-50 p-4">
                        <p className="text-sm text-red-800">
                            <strong>Warning:</strong> This {memberRole.toLowerCase()} will lose access to the system and all their data will be permanently deleted.
                        </p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isLoading ? "Deleting..." : `Delete ${memberRole}`}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
