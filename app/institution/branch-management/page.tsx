"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BranchStats } from "@/components/institution/branch-management/branch-stats"
import { BranchesTable } from "@/components/institution/branch-management/branches-table"
import { useGetInstitutionBranchOptionsQuery } from "@/redux/features/branchManagement/branchManagementApi"

export default function BranchManagementPage() {
    const [selectedBranch, setSelectedBranch] = useState("all")
    const { data: branchOptionsResponse } = useGetInstitutionBranchOptionsQuery(undefined)
    const branchOptionsData = branchOptionsResponse?.data || branchOptionsResponse || []
    const branchOptions = [
        { value: "all", label: "All Branches" },
        ...branchOptionsData.map((branch: { id: string; name: string }) => ({
            value: branch.id,
            label: branch.name,
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
            <BranchStats branchId={selectedBranch} />
            <BranchesTable branchId={selectedBranch} />
        </div >
    )
}
