"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { type BranchEarnings } from "./earnings-table"

interface EditEarningDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    earning: BranchEarnings
}

export function EditEarningDialog({ open, onOpenChange, earning }: EditEarningDialogProps) {
    const [formData, setFormData] = useState({
        branchName: earning.branchName,
        branchId: earning.branchId,
        totalStudents: (earning.totalStudents || 0).toString(),
        totalPaid: (earning.totalPaid || 0).toString(),
        totalUnpaid: (earning.totalUnpaid || 0).toString(),
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Updating earning:", formData)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full md:max-w-2xl h-full md:h-auto max-h-[80vh] overflow-y-auto p-5 md:p-6 rounded-xl">
                <DialogHeader>
                    <DialogTitle>Edit Earning</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="branchName">Branch Name</Label>
                            <Input
                                id="branchName"
                                value={formData.branchName}
                                onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                                placeholder="Enter branch name"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="branchId">Branch ID</Label>
                            <Input
                                id="branchId"
                                value={formData.branchId}
                                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                                placeholder="BRN-XXX"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="totalStudents">Total Students</Label>
                            <Input
                                id="totalStudents"
                                type="number"
                                value={formData.totalStudents}
                                onChange={(e) => setFormData({ ...formData, totalStudents: e.target.value })}
                                placeholder="0"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="collected">Fees Collected ($)</Label>
                            <Input
                                id="collected"
                                type="number"
                                value={formData.totalPaid}
                                onChange={(e) => setFormData({ ...formData, totalPaid: e.target.value })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="outstanding">Outstanding Fees ($)</Label>
                            <Input
                                id="outstanding"
                                type="number"
                                value={formData.totalUnpaid}
                                onChange={(e) => setFormData({ ...formData, totalUnpaid: e.target.value })}
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }} className="text-white">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
