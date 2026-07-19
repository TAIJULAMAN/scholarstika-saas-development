"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BranchAdmin, BranchOption } from "@/types/branch-admin"

interface EditManagerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    manager: BranchAdmin
    branchOptions: BranchOption[]
    onSubmit: (data: {
        id: string
        fullName: string
        emailAddress: string
        phoneNumber: string
        assignBranch: string
        joinDate: string
        subscriptionId?: string
    }) => Promise<void>
    isSubmitting?: boolean
}

export function EditManagerDialog({
    open,
    onOpenChange,
    manager,
    branchOptions,
    onSubmit,
    isSubmitting = false,
}: EditManagerDialogProps) {
    const [formData, setFormData] = useState({
        fullName: manager.fullName,
        emailAddress: manager.emailAddress,
        phoneNumber: manager.phoneNumber,
        assignBranch: manager.assignBranch,
        joinDate: manager.joinDate ? manager.joinDate.slice(0, 10) : "",
        subscriptionId: manager.subscriptionId || "",
    })

    const initialBranch = branchOptions.find((b: any) => (b.schoolName || b.name) === manager.assignBranch)
    const [selectedBranchId, setSelectedBranchId] = useState<string>(initialBranch?.id || initialBranch?.subscriptionId || "")

    useEffect(() => {
        setFormData({
            fullName: manager.fullName,
            emailAddress: manager.emailAddress,
            phoneNumber: manager.phoneNumber,
            assignBranch: manager.assignBranch,
            joinDate: manager.joinDate ? manager.joinDate.slice(0, 10) : "",
            subscriptionId: manager.subscriptionId || "",
        })
        const branch = branchOptions.find((b: any) => (b.schoolName || b.name) === manager.assignBranch)
        setSelectedBranchId(branch?.id || branch?.subscriptionId || "")
    }, [manager, branchOptions])

    const availableBranches = useMemo(
        () =>
            branchOptions.filter(
                (branch: any) => !branch.hasAssignedAdmin || (branch.schoolName || branch.name) === manager.assignBranch,
            ),
        [branchOptions, manager.assignBranch],
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSubmit({
            id: manager.id,
            ...formData,
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90%] md:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Branch Admin</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="emailAddress">Email Address *</Label>
                            <Input
                                id="emailAddress"
                                type="email"
                                value={formData.emailAddress}
                                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                                placeholder="admin@scholastika.edu"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number *</Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                placeholder="+1 (555) 123-4567"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="branch">Assign Branch *</Label>
                            <Select
                                value={selectedBranchId}
                                onValueChange={(value) => {
                                    setSelectedBranchId(value)
                                    const selectedBranch = branchOptions.find((branch: any) => branch.id === value || branch.subscriptionId === value)
                                    setFormData({
                                        ...formData,
                                        assignBranch: selectedBranch?.schoolName || selectedBranch?.name || "",
                                        subscriptionId: selectedBranch?.subscriptionId || selectedBranch?.id || "",
                                    })
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a branch" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableBranches.map((branch: any, index) => {
                                        const branchName = branch.schoolName || branch.name || `Unnamed Branch ${index}`;
                                        const uniqueValue = branch.id || branch.subscriptionId || `branch-${index}`;
                                        return (
                                            <SelectItem key={uniqueValue} value={uniqueValue}>
                                                {branchName}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="joinDate">Joining Date *</Label>
                            <Input
                                id="joinDate"
                                type="date"
                                value={formData.joinDate}
                                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }} className="text-white">
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
