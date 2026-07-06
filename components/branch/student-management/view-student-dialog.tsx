"use client"

import { X, Mail, Building2, GraduationCap, Phone, User } from "lucide-react"
import type { BranchStudent } from "@/types/branch-user"

interface ViewStudentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    student: BranchStudent
}

export function ViewStudentDialog({ open, onOpenChange, student }: ViewStudentDialogProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl mx-2">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Student Details</h2>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-5">
                    <div>
                        <h3 className="mb-3 text-lg font-semibold text-gray-900">{student.name}</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-blue-50 p-2">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="mt-1 text-sm text-gray-900">{student.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-green-50 p-2">
                                    <Building2 className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Branch</p>
                                    <p className="mt-1 text-sm text-gray-900">{student.branchName}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-gray-700">Details</h4>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-purple-600" />
                                    <p className="text-sm font-medium text-gray-500">Grade</p>
                                </div>
                                <p className="mt-2 text-xl font-bold text-gray-900">{student.className}</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-blue-600" />
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                </div>
                                <p className="mt-2 text-sm font-semibold text-gray-900">{student.guardianPhone}</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-orange-600" />
                                    <p className="text-sm font-medium text-gray-500">Guardian</p>
                                </div>
                                <p className="mt-2 text-sm font-semibold text-gray-900">{student.guardianName}</p>
                            </div>
                        </div>
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
