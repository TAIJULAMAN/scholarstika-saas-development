"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, User, Mail, Phone, Globe, MapPin, Key, CreditCard, CalendarDays, Landmark, CircleDollarSign } from "lucide-react"
import { EditInstitutionDialog } from "@/components/institution/settings/edit-institution-dialog"
import { EditProfileDialog } from "@/components/institution/settings/edit-profile-dialog"
import { ChangePasswordDialog } from "@/components/institution/settings/change-password-dialog"
import { useUser } from "@/context/user-context"
import { useGetMyPaymentStatusQuery } from "@/redux/features/subscription/subscriptionApi"

export default function InstitutionSettingsPage() {
    const [isEditInstitutionOpen, setIsEditInstitutionOpen] = useState(false)
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
    const { user } = useUser()
    const { data: paymentStatusResponse, isLoading: isPaymentStatusLoading } = useGetMyPaymentStatusQuery(undefined, {
        skip: !user,
    })

    // Institution data
    const institutionData = {
        name: user?.schoolName || "Institution not set",
        type: "Primary & Secondary School",
        address: [user?.city, user?.state, user?.country].filter(Boolean).join(", ") || "Address not available",
        phone: "Not available",
        email: user?.email || "Not available",
        website: "Not available",
        country: user?.country || "Not available",
        logo: "/institution-logo.png",
    }

    // Owner data
    const ownerData = {
        name: user?.name || "Institution Owner",
        email: user?.email || "Not available",
        phone: "Not available",
        avatar: user?.avatar,
    }

    const paymentStatus = paymentStatusResponse?.data || paymentStatusResponse
    const latestSubscription = paymentStatus?.latestSubscription
    const isPaid = Boolean(paymentStatus?.isPaid)
    const branchCount = latestSubscription?.branchesCount ?? 0
    const latestSchools = latestSubscription?.schools ?? []
    const latestPaidDate = latestSubscription?.createdAt
        ? new Date(latestSubscription.createdAt).toLocaleDateString()
        : "Not paid yet"

    return (
        <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                >
                    <User className="h-4 w-4" />
                    Edit Profile
                </button>
                <button
                    onClick={() => setIsEditInstitutionOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                >
                    <Building2 className="h-4 w-4" />
                    Edit Institution
                </button>
                <button
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                >
                    <Key className="h-4 w-4" />
                    Change Password
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-1">
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-green-600" />
                                <h2 className="text-lg font-bold text-gray-900">Institution Information</h2>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Institution Name</p>
                                    <p className="text-sm font-semibold text-gray-900">{institutionData.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Type</p>
                                    <p className="text-sm font-semibold text-gray-900">{institutionData.type}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">Address</p>
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <p className="text-sm text-gray-900">{institutionData.address}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Phone Number</p>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm text-gray-900">{institutionData.phone}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Email Address</p>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm text-gray-900">{institutionData.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Website</p>
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-gray-400" />
                                        <a href={institutionData.website === "Not available" ? "#" : institutionData.website} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:underline">
                                            {institutionData.website}
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Country</p>
                                    <p className="text-sm text-gray-900">{institutionData.country}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-green-600" />
                                <h2 className="text-lg font-bold text-gray-900">Owner Profile</h2>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 pb-4 border-b">
                                <Avatar className="h-16 w-16 border-2 border-gray-200">
                                    <AvatarImage src={ownerData.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-xl text-white">
                                        {ownerData.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Profile Picture</p>
                                    <p className="text-xs text-gray-500">Click edit to update photo</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">Full Name</p>
                                <p className="text-sm font-semibold text-gray-900">{ownerData.name}</p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Email Address</p>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm text-gray-900">{ownerData.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">Phone Number</p>
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <p className="text-sm text-gray-900">{ownerData.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-green-600" />
                        <h2 className="text-lg font-bold text-gray-900">Subscription & Payment Status</h2>
                    </div>
                    <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                            isPaid
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                        }`}
                    >
                        {isPaid ? "Paid" : "Unpaid"}
                    </span>
                </div>

                {isPaymentStatusLoading ? (
                    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                        Loading payment status...
                    </div>
                ) : isPaid && latestSubscription ? (
                    <div className="space-y-5">
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="rounded-xl bg-emerald-50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-emerald-700">
                                    <CircleDollarSign className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wide">Amount Paid</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">${latestSubscription.price}</p>
                            </div>
                            <div className="rounded-xl bg-blue-50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-blue-700">
                                    <CalendarDays className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wide">Latest Payment</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">{latestPaidDate}</p>
                            </div>
                            <div className="rounded-xl bg-violet-50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-violet-700">
                                    <Landmark className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wide">Branches Covered</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{branchCount}</p>
                            </div>
                            <div className="rounded-xl bg-slate-50 p-4">
                                <div className="mb-2 flex items-center gap-2 text-slate-700">
                                    <CreditCard className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wide">Status</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">Payment completed</p>
                            </div>
                        </div>

                        <div>
                            <p className="mb-3 text-sm font-semibold text-gray-900">Paid Schools</p>
                            <div className="grid gap-3 md:grid-cols-2">
                                {latestSchools.map((school: {
                                    id: string
                                    schoolName: string
                                    city: string
                                    state: string
                                    country: string
                                    schoolType: string
                                    studentLimit: string
                                }) => (
                                    <div key={school.id} className="rounded-lg border border-gray-200 p-4">
                                        <p className="text-sm font-semibold text-gray-900">{school.schoolName}</p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {[school.city, school.state, school.country].filter(Boolean).join(", ")}
                                        </p>
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                                {school.schoolType.replaceAll("_", " ")}
                                            </span>
                                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                                {school.studentLimit} students
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-5">
                        <p className="text-sm font-semibold text-amber-800">No completed payment found yet.</p>
                        <p className="mt-1 text-sm text-amber-700">
                            This profile does not have an active paid subscription yet.
                        </p>
                        <Link
                            href="/pricing"
                            className="mt-4 inline-flex items-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                        >
                            Go to Pricing
                        </Link>
                    </div>
                )}
            </div>


            {/* Dialogs */}
            <EditInstitutionDialog
                open={isEditInstitutionOpen}
                onOpenChange={setIsEditInstitutionOpen}
                institutionData={institutionData}
            />

            <EditProfileDialog
                open={isEditProfileOpen}
                onOpenChange={setIsEditProfileOpen}
                ownerData={ownerData}
            />

            <ChangePasswordDialog
                open={isChangePasswordOpen}
                onOpenChange={setIsChangePasswordOpen}
            />
        </div>
    )
}
