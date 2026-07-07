"use client"

import { X, Mail, Building2, BookOpen, Phone, MapPin, Users } from "lucide-react"
import type { BranchTeacher } from "@/types/branch-user"

interface ViewTeacherDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    teacher: BranchTeacher
}

export function ViewTeacherDialog({ open, onOpenChange, teacher }: ViewTeacherDialogProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto pt-10 pb-10">
            <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl mx-2 md:mx-0 my-auto">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Teacher Details</h2>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{teacher.teacherName}</h3>
                            {teacher.assignClass?.[0] && (
                                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                    <Users className="h-4 w-4" />
                                    Class Teacher: {teacher.assignClass[0]}
                                </div>
                            )}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-blue-50 p-2">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="mt-1 text-sm text-gray-900">{teacher.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="rounded-lg bg-green-50 p-2">
                                    <Building2 className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Branch</p>
                                    <p className="mt-1 text-sm text-gray-900">{teacher.branchName}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-3 text-sm font-semibold text-gray-700">Details</h4>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-purple-600" />
                                    <p className="text-sm font-medium text-gray-500">Subjects</p>
                                </div>
                                <p className="mt-2 text-sm font-semibold text-gray-900">{teacher.subject.join(", ") || "Not assigned"}</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-blue-600" />
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                </div>
                                <p className="mt-2 text-sm font-semibold text-gray-900">{teacher.phoneNumber}</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-orange-600" />
                                    <p className="text-sm font-medium text-gray-500">Address</p>
                                </div>
                                <p className="mt-2 text-sm font-semibold text-gray-900">{teacher.address}</p>
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
