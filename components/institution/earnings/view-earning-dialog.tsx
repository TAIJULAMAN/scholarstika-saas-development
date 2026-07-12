"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { type BranchEarnings } from "./earnings-table"
import { Building2, MapPin, Users, DollarSign, AlertCircle } from "lucide-react"

interface ViewEarningDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    earning: BranchEarnings
}

export function ViewEarningDialog({ open, onOpenChange, earning }: ViewEarningDialogProps) {
    const totalAmount = earning.totalFees || (earning.totalPaid + earning.totalUnpaid)
    const collectionRate = totalAmount > 0 ? ((earning.totalPaid / totalAmount) * 100).toFixed(1) : "0.0"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full md:max-w-2xl h-full md:h-auto max-h-[90vh] overflow-y-auto rounded-xl bg-white p-5 mx-2 md:mx-0 shadow-xl">
                <DialogHeader>
                    <DialogTitle>Branch Earning Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    {/* Branch Info */}
                    <div className="rounded-lg bg-green-50 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{earning.branchName}</h3>
                                <p className="text-sm text-gray-600">{earning.branchId}</p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="rounded-lg bg-blue-50 p-2">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Students</p>
                                    <p className="text-2xl font-bold text-gray-900">{earning.totalStudents.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="rounded-lg bg-green-50 p-2">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Fees Collected</p>
                                    <p className="text-2xl font-bold text-green-600">${earning.totalPaid.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="rounded-lg bg-orange-50 p-2">
                                    <AlertCircle className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Outstanding Fees</p>
                                    <p className="text-2xl font-bold text-orange-600">${earning.totalUnpaid.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="rounded-lg bg-purple-50 p-2">
                                    <DollarSign className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Amount</p>
                                    <p className="text-2xl font-bold text-purple-600">${totalAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Collection Rate */}
                    <div className="rounded-lg bg-gray-50 p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Collection Rate</span>
                            <span className="text-lg font-bold text-green-600">{collectionRate}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                                className="h-2 rounded-full bg-green-600"
                                style={{ width: `${collectionRate}%` }}
                            />
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
