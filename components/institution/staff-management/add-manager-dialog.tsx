"use client"

import { useMemo, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BranchAdminFormData, BranchOption } from "@/types/branch-admin"
import { CalendarDays, Eye, EyeOff } from "lucide-react"

interface AddManagerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    branchOptions: BranchOption[]
    onSubmit: (data: BranchAdminFormData) => Promise<string | null>
    isSubmitting?: boolean
}

export function AddManagerDialog({
    open,
    onOpenChange,
    branchOptions,
    onSubmit,
    isSubmitting = false,
}: AddManagerDialogProps) {
    const joinDateInputRef = useRef<HTMLInputElement | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState<BranchAdminFormData & { confirmPassword: string }>({
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        assignBranch: "",
        joinDate: "",
        password: "",
        confirmPassword: "",
        subscriptionId: "",
    })
    const [formError, setFormError] = useState("")
    const [selectedBranchId, setSelectedBranchId] = useState<string>("")

    const availableBranches = useMemo(
        () => branchOptions.filter((branch) => !branch.hasAssignedAdmin),
        [branchOptions],
    )

    const resetForm = () => {
        setFormData({
            fullName: "",
            emailAddress: "",
            phoneNumber: "",
            assignBranch: "",
            joinDate: "",
            password: "",
            confirmPassword: "",
            subscriptionId: "",
        })
        setFormError("")
        setShowPassword(false)
        setShowConfirmPassword(false)
        setSelectedBranchId("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormError("")

        if (formData.password !== formData.confirmPassword) {
            setFormError("Passwords do not match.")
            return
        }

        if (!formData.subscriptionId) {
            setFormError("Please select a valid branch.")
            return
        }

        const submitError = await onSubmit(formData)

        if (submitError) {
            setFormError(submitError)
            return
        }

        resetForm()
    }

    const openDatePicker = () => {
        const input = joinDateInputRef.current as HTMLInputElement & { showPicker?: () => void }
        if (!input) {
            return
        }

        input.focus()

        try {
            input.showPicker?.()
        } catch {
            // Some browsers only allow showPicker during a direct user gesture.
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                onOpenChange(nextOpen)
                if (!nextOpen) {
                    resetForm()
                }
            }}
        >
            <DialogContent className="w-[90%] md:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Add New Branch Admin</DialogTitle>
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
                            <div className="relative">
                                <Input
                                    ref={joinDateInputRef}
                                    id="joinDate"
                                    type="date"
                                    value={formData.joinDate}
                                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                                    onClick={openDatePicker}
                                    className="pr-10 cursor-pointer"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={openDatePicker}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label="Open date picker"
                                >
                                    <CalendarDays className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password *</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Enter password"
                                    minLength={6}
                                    className="pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password *</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="Confirm password"
                                    minLength={6}
                                    className="pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {formError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {formError}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting} style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }} className="text-white">
                            {isSubmitting ? "Adding..." : "Add Admin"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
