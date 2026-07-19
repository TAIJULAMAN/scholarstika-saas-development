"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StudentStats } from "@/components/institution/student-management/student-stats"
import { StudentsTable } from "@/components/institution/student-management/students-table"
import { useGetAllStudentsQuery } from "@/redux/features/institutionAndBranch/student/student"
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

export default function StudentsPage() {
    const [selectedBranch, setSelectedBranch] = useState("all")
    const { subscriptionId } = useSelector((state: any) => state.auth)

    const { data: studentsResponse, isLoading, isError, error } = useGetAllStudentsQuery(subscriptionId, { skip: !subscriptionId })

    const fetchedStudents = (studentsResponse?.data?.data || []).map((student: any) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        branch: student.branchName || "N/A",
        grade: student.className || "N/A",
        phone: student.guardianPhone || "N/A",
        guardian: student.guardianName || "N/A",
        avatar: student.photo
    }))

    const totalStudents = studentsResponse?.data?.meta?.total || fetchedStudents.length;

    return (
        <div className="space-y-6">
            {isLoading ? (
                <div className="py-10 text-center text-gray-500">Loading students...</div>
            ) : isError ? (
                <div className="py-10 text-center text-red-500">
                    <p>Failed to load students</p>
                </div>
            ) : (
                <StudentsTable studentsData={fetchedStudents} totalStudents={totalStudents} />
            )}
        </div>
    )
}
