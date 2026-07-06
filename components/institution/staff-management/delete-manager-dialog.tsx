"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DeleteManagerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    managerName: string
    onConfirm: () => Promise<void>
    isDeleting?: boolean
}

export function DeleteManagerDialog({ open, onOpenChange, managerName, onConfirm, isDeleting = false }: DeleteManagerDialogProps) {
    const handleDelete = async () => {
        await onConfirm()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90%] md:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle>Delete Branch Admin</DialogTitle>
                            <DialogDescription>This action cannot be undone</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete <span className="font-semibold text-gray-900">{managerName}</span>?
                        This will permanently remove their access and all associated data.
                    </p>
                    <div className="rounded-lg bg-red-50 p-4">
                        <p className="text-sm text-red-800">
                            <strong>Warning:</strong> This admin will lose access to their assigned branch and all management privileges.
                        </p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? "Deleting..." : "Delete Admin"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
