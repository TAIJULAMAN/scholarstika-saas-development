"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BranchStats } from "@/components/institution/branch-management/branch-stats"
import { BranchesTable } from "@/components/institution/branch-management/branches-table"
import { useGetAllBranchesQuery } from "@/redux/features/institutionAndBranch/branchManagement/branchManagementApi"

export default function BranchManagementPage() {
    const [selectedBranch, setSelectedBranch] = useState("all")
    const { data: branchOptionsResponse, isLoading } = useGetAllBranchesQuery()
    
    // Safely extract the payload regardless of the API response structure wrapper
    const payload = branchOptionsResponse?.data || branchOptionsResponse || {}
    const extractedData = payload.data || []
    const branchOptionsData = Array.isArray(extractedData) ? extractedData : []

    const branchOptions = [
        { value: "all", label: "All Branches" },
        ...branchOptionsData.map((branch: any) => ({
            value: branch.id,
            label: branch.branchName,
        })),
    ]

    return (
        <div className="space-y-5">
            <div className="flex justify-end">
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                        {branchOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <BranchStats branchId={selectedBranch} payload={payload} isLoading={isLoading} />
            <BranchesTable branchId={selectedBranch} payload={payload} isLoading={isLoading} />
        </div >
    )
}
