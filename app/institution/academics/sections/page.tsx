"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SectionStats } from "@/components/institution/section-management/section-stats"
import { SectionsTable } from "@/components/institution/section-management/sections-table"
import { useGetAllSectionsAndClassesQuery } from "@/redux/features/institutionAndBranch/sectionAndClasses/sectionAndClassesApi"
import { useSelector } from "react-redux"

const branchOptions = [
    { value: "all", label: "All Branches" },
    { value: "1", label: "Hillcrest School" },
    { value: "2", label: "Lakeside Learning Center" },
    { value: "3", label: "Southpark Academy" },
    { value: "4", label: "Greenfield University" },
    { value: "5", label: "Oakwood College" },
    { value: "6", label: "Mountainside High School" },
    { value: "7", label: "Riverdale Junior High" },
    { value: "8", label: "Sunset Middle School" },
    { value: "9", label: "Bayview Elementary" },
    { value: "10", label: "Crestview Elementary" },
    { value: "11", label: "Greenfield Elementary" },
    { value: "12", label: "Oakwood Elementary" },
    { value: "13", label: "Mountainside Elementary" },
    { value: "14", label: "Riverdale Elementary" },
    { value: "15", label: "Sunset Elementary" },
]

export default function SectionsPage() {
    const [selectedBranch, setSelectedBranch] = useState("all")
    const { subscriptionId } = useSelector((state: any) => state.auth)

    const { data: sectionsResponse, isLoading, isError } = useGetAllSectionsAndClassesQuery(undefined)

    const overviewData = sectionsResponse?.data?.overview

    const sectionsData = (sectionsResponse?.data?.data || []).map((section: any) => ({
        id: section.id,
        grade: section.classLevel,
        section: section.assignableSubject, 
        classTeacher: section.teacher?.teacherName || "N/A",
        capacity: section.capacity,
        room: section.roomNumber,
        status: section.status || "Active", 
        enrolled: section.enrolled || 0,
        time: section.time,
        day: section.day
    }))
    
    const totalSections = sectionsResponse?.data?.meta?.total || sectionsData.length

    return (
        <div className="space-y-6">
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
            <SectionStats branchId={selectedBranch} overviewData={overviewData} />
            
            {isLoading ? (
                <div className="py-10 text-center text-gray-500">Loading sections...</div>
            ) : isError ? (
                <div className="py-10 text-center text-red-500">
                    <p>Failed to load sections</p>
                </div>
            ) : (
                <SectionsTable sectionsData={sectionsData} totalSections={totalSections} />
            )}
        </div>
    )
}
