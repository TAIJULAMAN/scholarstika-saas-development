"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Calendar } from "lucide-react"
import { BranchAdmin } from "@/types/branch-admin"

interface ViewManagerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    manager: BranchAdmin
}

export function ViewManagerDialog({ open, onOpenChange, manager }: ViewManagerDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full md:max-w-2xl h-full md:h-auto max-h-[80vh] overflow-y-auto rounded-xl bg-white p-5 md:p-6 shadow-xl">
                <DialogHeader>
                    <DialogTitle>Branch Admin Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    {/* Manager Info */}
                    <div className="rounded-lg bg-green-50 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white text-2xl font-bold">
                                {manager.fullName.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{manager.fullName}</h3>
                                <p className="text-sm text-gray-600">Branch Admin</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                                {manager.status}
                            </span>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="rounded-lg bg-blue-50 p-2">
                                    <Mail className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email Address</p>
                                    <p className="font-medium text-gray-900">{manager.emailAddress}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="rounded-lg bg-green-50 p-2">
                                    <Phone className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phone Number</p>
                                    <p className="font-medium text-gray-900">{manager.phoneNumber}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="rounded-lg bg-purple-50 p-2">
                                    <MapPin className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Assigned Branch</p>
                                    <p className="font-medium text-gray-900">{manager.assignBranch}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="rounded-lg bg-orange-50 p-2">
                                    <Calendar className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Joined Date</p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(manager.joinDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={() => onOpenChange(false)}
                            className="bg-gray-900 hover:bg-gray-800 text-white"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
