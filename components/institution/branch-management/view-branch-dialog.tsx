"use client"

import { X, MapPin, Phone, Users, GraduationCap, TrendingUp, DollarSign } from "lucide-react"

import { InstitutionBranch } from "@/types/institution-branch"

interface ViewBranchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    branch: InstitutionBranch
}

export function ViewBranchDialog({ open, onOpenChange, branch }: ViewBranchDialogProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl rounded-xl bg-white p-4 shadow-xl md:p-6 max-h-[90vh] overflow-y-auto">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Branch Details</h2>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h3 className="mb-3 text-lg font-semibold text-gray-900">{branch.name}</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-blue-50 p-2">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Location</p>
                                    <p className="mt-1 text-sm text-gray-900">{branch.location}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-green-50 p-2">
                                    <Phone className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Contact</p>
                                    <p className="mt-1 text-sm text-gray-900">{branch.contact}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-gray-700">Statistics</h4>
                        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
                            <div className="rounded-lg border border-gray-200 p-3 md:p-4">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                                    <p className="text-xs md:text-sm font-medium text-gray-500">Students</p>
                                </div>
                                <p className="mt-2 text-xl md:text-2xl font-bold text-gray-900">{branch.students}</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-3 md:p-4">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                                    <p className="text-xs md:text-sm font-medium text-gray-500">Teachers</p>
                                </div>
                                <p className="mt-2 text-xl md:text-2xl font-bold text-gray-900">{branch.teachers}</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-3 md:p-4">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                                    <p className="text-xs md:text-sm font-medium text-gray-500">Attendance</p>
                                </div>
                                <p className="mt-2 text-xl md:text-2xl font-bold text-gray-900">{branch.attendance}</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-3 md:p-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                                    <p className="text-xs md:text-sm font-medium text-gray-500">Earnings</p>
                                </div>
                                <p className="mt-2 text-xl md:text-2xl font-bold text-gray-900">{branch.earnings}</p>
                            </div>
                        </div>
                    </div>

                    {/* Branch Type */}
                    <div>
                        <p className="text-sm font-medium text-gray-500">Branch Type</p>
                        <p className="mt-1 inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                            {branch.type}
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
