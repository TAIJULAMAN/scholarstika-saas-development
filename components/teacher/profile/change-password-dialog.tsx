"use client"

import { useState } from "react"
import { X, Key, Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useChangePasswordMutation } from "@/redux/features/auth/authApi"
import { toast } from "sonner"

interface ChangePasswordDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
    const [changePassword, { isLoading }] = useChangePasswordMutation()
    
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match!")
            return
        }

        try {
            const res = await changePassword({
                oldpassword: formData.currentPassword,
                newpassword: formData.newPassword
            }).unwrap()
            
            if (res?.success) {
                toast.success(res?.message || "Password updated successfully")
                onOpenChange(false)
                setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
            } else {
                toast.error(res?.message || "Failed to update password")
            }
        } catch (error: any) {
            toast.error(error?.data?.message || error?.message || "Failed to update password")
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-2 md:mx-0">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-emerald-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                    </div>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                        disabled={isLoading}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Current Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                required
                                type={showCurrentPassword ? "text" : "password"}
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                className="pr-10"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                disabled={isLoading}
                            >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                required
                                type={showNewPassword ? "text" : "password"}
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                className="pr-10"
                                minLength={6}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                disabled={isLoading}
                            >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Confirm New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Input
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="pr-10"
                                minLength={6}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-70 flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
