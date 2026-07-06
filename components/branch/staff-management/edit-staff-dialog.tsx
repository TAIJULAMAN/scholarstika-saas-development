"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { BranchStaff } from "@/types/branch-user"

interface EditStaffDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    member: BranchStaff
    isLoading?: boolean
    onSubmit: (id: string, payload: {
        name: string
        email: string
        phoneNumber: string
    }) => Promise<string | null>
}

export function EditStaffDialog({
    open,
    onOpenChange,
    member,
    isLoading = false,
    onSubmit,
}: EditStaffDialogProps) {
    const [formData, setFormData] = useState({
        name: member.name,
        email: member.email,
        phoneNumber: member.phoneNumber,
    })
    const [error, setError] = useState("")

    useEffect(() => {
        if (open) {
            setFormData({
                name: member.name,
                email: member.email,
                phoneNumber: member.phoneNumber,
            })
            setError("")
        }
    }, [open, member])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        const result = await onSubmit(member.id, formData)

        if (result) {
            setError(result)
            return
        }

        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full md:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Staff Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                placeholder="+1 (555) 123-4567"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Role</Label>
                            <Input value={member.role.toUpperCase()} disabled />
                        </div>

                        <div className="space-y-2">
                            <Label>Login ID</Label>
                            <Input value={member.generateId} disabled />
                        </div>

                        {member.studentId && (
                            <div className="space-y-2">
                                <Label>Linked Student ID</Label>
                                <Input value={member.studentId} disabled />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} style={{ backgroundColor: "rgba(16, 185, 129, 0.8)" }} className="text-white">
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
