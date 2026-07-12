"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, MapPin, GraduationCap, BookOpen, Users, Edit, Key } from "lucide-react"
import { EditProfileDialog } from "@/components/teacher/profile/edit-profile-dialog"
import { ChangePasswordDialog } from "@/components/teacher/profile/change-password-dialog"
import { useGetMyProfileQuery } from "@/redux/features/auth/authApi"

export default function TeacherProfilePage() {
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)

    const { data: profileResponse, isLoading } = useGetMyProfileQuery({});
    const profile = profileResponse?.data || {};

    // Teacher data
    const teacherData = {
        name: profile.teacherName || "N/A",
        employeeId: profile.teacherId || "N/A",
        email: profile.email || "N/A",
        phone: profile.phoneNumber || "N/A",
        address: profile.address || "N/A",
        avatar: profile.photo || "",
        subject: profile.subject?.join(', ') || "N/A",
        qualification: profile.qualification || "N/A",
        experience: profile.experience || "N/A",
        joiningDate: profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"
    }

    // Teaching stats
    const teachingStats = [
        { label: "Classes Teaching", value: "5", icon: BookOpen, color: "blue" },
        { label: "Total Students", value: "142", icon: Users, color: "green" },
        { label: "Subjects", value: "2", icon: GraduationCap, color: "purple" },
        { label: "Experience", value: "8 Years", icon: User, color: "orange" }
    ]

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="text-gray-500">Loading profile data...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        View and manage your professional information
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setIsEditProfileOpen(true)}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                        Edit Profile
                    </button>
                    <button
                        onClick={() => setIsChangePasswordOpen(true)}
                        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                    >
                        <Key className="h-4 w-4" />
                        Change Password
                    </button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-4 md:w-64">
                        <Avatar className="h-32 w-32 border-4 border-gray-200">
                            <AvatarImage src={teacherData.avatar} />
                            <AvatarFallback className="bg-linear-to-br from-emerald-500 to-teal-600 text-3xl text-white">
                                {teacherData.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-900">{teacherData.name}</h2>
                            <p className="text-sm text-gray-500">{teacherData.employeeId}</p>
                            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                                <GraduationCap className="h-3 w-3" />
                                {teacherData.subject} Teacher
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div className="flex-1 space-y-6">
                        {/* Personal Information */}
                        <div>
                            <div className="mb-4 flex items-center gap-2 border-b pb-2">
                                <User className="h-5 w-5 text-emerald-600" />
                                <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Full Name</p>
                                    <p className="text-sm font-semibold text-gray-900">{teacherData.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Employee ID</p>
                                    <p className="text-sm font-semibold text-gray-900">{teacherData.employeeId}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Email Address</p>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm text-gray-900">{teacherData.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Phone Number</p>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm text-gray-900">{teacherData.phone}</p>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <p className="text-xs font-medium text-gray-500 mb-1">Address</p>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <p className="text-sm text-gray-900">{teacherData.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Professional Information */}
                        <div>
                            <div className="mb-4 flex items-center gap-2 border-b pb-2">
                                <GraduationCap className="h-5 w-5 text-emerald-600" />
                                <h3 className="text-lg font-bold text-gray-900">Professional Information</h3>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Subject</p>
                                    <p className="text-sm font-semibold text-gray-900">{teacherData.subject}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Qualification</p>
                                    <p className="text-sm font-semibold text-gray-900">{teacherData.qualification}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Experience</p>
                                    <p className="text-sm text-gray-900">{teacherData.experience}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Joining Date</p>
                                    <p className="text-sm text-gray-900">{teacherData.joiningDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <EditProfileDialog
                open={isEditProfileOpen}
                onOpenChange={setIsEditProfileOpen}
                teacherData={teacherData}
            />

            <ChangePasswordDialog
                open={isChangePasswordOpen}
                onOpenChange={setIsChangePasswordOpen}
            />
        </div>
    )
}
