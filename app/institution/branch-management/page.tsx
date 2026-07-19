"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BranchStats } from "@/components/institution/branch-management/branch-stats"
import { BranchesTable } from "@/components/institution/branch-management/branches-table"
import {
    useGetInstitutionBranchesQuery,
    useGetInstitutionBranchStatsQuery,
} from "@/redux/features/branchManagement/branchManagementApi"

export default function BranchManagementPage() {
    const [selectedBranch, setSelectedBranch] = useState("all")
    const { data: branchesResponse, isLoading: areBranchesLoading } =
        useGetInstitutionBranchesQuery({ page: 1, limit: 100 })
    const { data: statsResponse, isLoading: areStatsLoading } =
        useGetInstitutionBranchStatsQuery(selectedBranch === "all" ? undefined : selectedBranch)

    const branchPayload = branchesResponse?.data || branchesResponse || {}
    const statsPayload = statsResponse?.data || statsResponse || {}
    const payload = { ...branchPayload, overall: statsPayload }
    const extractedData = branchPayload.data || []
    const branchOptionsData = Array.isArray(extractedData) ? extractedData : []

    const branchOptions = [
        { value: "all", label: "All Branches" },
        ...branchOptionsData.map((branch: any) => ({
            value: branch.id,
            label: branch.name || branch.branchName,
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
            <BranchStats branchId={selectedBranch} payload={payload} isLoading={areBranchesLoading || areStatsLoading} />
            <BranchesTable branchId={selectedBranch} payload={payload} isLoading={areBranchesLoading} />
        </div >
    )
}
