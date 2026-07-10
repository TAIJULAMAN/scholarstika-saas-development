"use client"

import { useState, useRef } from "react"
import { X, User, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUpdateMyProfileMutation } from "@/redux/features/auth/authApi"
import { toast } from "sonner"

interface EditProfileDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    teacherData: {
        name: string
        email: string
        phone: string
        address: string
        avatar: string
        subject: string
        qualification: string
    }
}

export function EditProfileDialog({ open, onOpenChange, teacherData }: EditProfileDialogProps) {
    const [updateMyProfile, { isLoading }] = useUpdateMyProfileMutation()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [profileImage, setProfileImage] = useState<File | null>(null)
    
    const [formData, setFormData] = useState({
        name: teacherData.name,
        email: teacherData.email,
        phone: teacherData.phone,
        address: teacherData.address,
        subject: teacherData.subject,
        qualification: teacherData.qualification,
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(e.target.files[0])
        }
    }

    const previewUrl = profileImage ? URL.createObjectURL(profileImage) : teacherData.avatar

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const payload = new FormData()
        
        // The backend only accepts name, phoneNumber, and address in the data object
        const dataPayload = {
            name: formData.name,
            phoneNumber: formData.phone,
            address: formData.address,
        }
        
        payload.append('data', JSON.stringify(dataPayload))
        
        if (profileImage) {
            payload.append('profileImage', profileImage)
        }

        try {
            const res = await updateMyProfile(payload).unwrap()
            console.log("Update profile response:", res)
            if (res?.success || res?.status) {
                toast.success(res.message || "Profile updated successfully")
                onOpenChange(false)
            } else {
                toast.error(res.message || "Failed to update profile")
            }
        } catch (error: any) {
            toast.error(error?.data?.message || error?.message || "Failed to update profile")
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl mx-2 md:mx-0">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-emerald-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
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
                        <label className="mb-2 block text-sm font-medium text-gray-700">Profile Picture</label>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-gray-200">
                                <AvatarImage src={previewUrl} />
                                <AvatarFallback className="bg-linear-to-br from-emerald-500 to-teal-600 text-xl text-white">
                                    {formData.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                disabled={isLoading}
                            >
                                <Upload className="mr-2 inline h-4 w-4" />
                                Change Photo
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <Input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Phone Number <span className="text-red-500">*</span>
                        </label>
                        <Input
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Subject
                        </label>
                        <Input
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder="e.g. Mathematics, Physics"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Qualification
                        </label>
                        <Input
                            value={formData.qualification}
                            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <Input
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            disabled={isLoading}
                        />
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
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
