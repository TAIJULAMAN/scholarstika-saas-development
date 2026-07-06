"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Calendar, UserRound, Users, Key } from "lucide-react"
import type { BranchStaff } from "@/types/branch-user"

interface ViewStaffDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    member: BranchStaff
}

export function ViewStaffDialog({ open, onOpenChange, member }: ViewStaffDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full md:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{member.role.toUpperCase()} Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-white p-6">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-2xl font-bold text-white">
                                {member.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                                <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                                {member.status || "ACTIVE"}
                            </span>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-200 p-4">
                            <div className="mb-2 flex items-center gap-3">
                                <div className="rounded-lg bg-blue-50 p-2">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email Address</p>
                                    <p className="font-medium text-gray-900">{member.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                            <div className="mb-2 flex items-center gap-3">
                                <div className="rounded-lg bg-green-50 p-2">
                                    <Phone className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phone Number</p>
                                    <p className="font-medium text-gray-900">{member.phoneNumber}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                            <div className="mb-2 flex items-center gap-3">
                                <div className="rounded-lg bg-purple-50 p-2">
                                    <Key className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Login ID</p>
                                    <p className="font-medium text-gray-900">{member.generateId}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                            <div className="mb-2 flex items-center gap-3">
                                <div className="rounded-lg bg-orange-50 p-2">
                                    <UserRound className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Role</p>
                                    <p className="font-medium text-gray-900 capitalize">{member.role}</p>
                                </div>
                            </div>
                        </div>

                        {member.studentId && (
                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="mb-2 flex items-center gap-3">
                                    <div className="rounded-lg bg-amber-50 p-2">
                                        <Users className="h-5 w-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Linked Student ID</p>
                                        <p className="font-medium text-gray-900">{member.studentId}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="rounded-lg border border-gray-200 p-4">
                            <div className="mb-2 flex items-center gap-3">
                                <div className="rounded-lg bg-slate-50 p-2">
                                    <Calendar className="h-5 w-5 text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Joined Date</p>
                                    <p className="font-medium text-gray-900">
                                        {member.createdAt
                                            ? new Date(member.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                            : "Not available"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={() => onOpenChange(false)}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
