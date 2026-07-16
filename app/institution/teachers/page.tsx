"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TeacherStats } from "@/components/institution/teacher-management/teacher-stats"
import { TeachersTable } from "@/components/institution/teacher-management/teachers-table"
import { useGetAllTeachersQuery } from "@/redux/features/institutionAndBranch/teacher/teacherApi"

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

export default function TeachersPage() {
    const { data: teachersResponse, isLoading, isError } = useGetAllTeachersQuery(undefined)

    const fetchedTeachers = (teachersResponse?.data?.data || []).map((teacher: any) => ({
        id: teacher.id,
        name: teacher.teacherName,
        email: teacher.email,
        branch: teacher.branchName || "N/A",
        subject: Array.isArray(teacher.subject) ? teacher.subject.join(", ") : (teacher.subject || "N/A"),
        phone: teacher.phoneNumber || "N/A",
        address: teacher.address || "N/A",
        avatar: teacher.photo
    }))

    const totalTeachers = teachersResponse?.data?.meta?.total || fetchedTeachers.length

    return (
        <div className="space-y-6">
            {isLoading ? (
                <div className="py-10 text-center text-gray-500">Loading teachers...</div>
            ) : isError ? (
                <div className="py-10 text-center text-red-500">
                    <p>Failed to load teachers</p>
                </div>
            ) : (
                <TeachersTable teachersData={fetchedTeachers} totalTeachers={totalTeachers} />
            )}
        </div>
    )
}
