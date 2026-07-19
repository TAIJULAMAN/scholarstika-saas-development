"use client"

import { useState, useMemo, useEffect } from "react"
import { Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViewTeacherDialog } from "./view-teacher-dialog"
import { TablePagination } from "@/components/common/table-pagination"
import { teachers, type Teacher } from "@/data/teachers"

export function TeachersTable({ teachersData, totalTeachers }: { teachersData?: Teacher[], totalTeachers?: number }) {
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [branchFilter, setBranchFilter] = useState("all")
    const [subjectFilter, setSubjectFilter] = useState("all")
    const uniqueBranches = useMemo(() => {
        const sourceData = teachersData || teachers;
        return Array.from(new Set(sourceData.map(t => t.branch))).filter(Boolean);
    }, [teachersData]);
    const uniqueSubjects = useMemo(() => {
        const sourceData = teachersData || teachers;
        return Array.from(new Set(sourceData.map(t => t.subject))).filter(Boolean);
    }, [teachersData]);
    const filteredTeachers = useMemo(() => {
        const sourceData = teachersData || teachers;
        return sourceData.filter(teacher => {
            const matchesBranch = branchFilter === "all" || teacher.branch === branchFilter
            const matchesSubject = subjectFilter === "all" || teacher.subject === subjectFilter
            return matchesBranch && matchesSubject
        })
    }, [branchFilter, subjectFilter, teachersData])
    const itemsPerPage = 8
    const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentTeachers = filteredTeachers.slice(startIndex, endIndex)

    useEffect(() => {
        setCurrentPage(1)
    }, [branchFilter, subjectFilter])

    const handleView = (teacher: Teacher) => {
        setSelectedTeacher(teacher)
        setIsViewDialogOpen(true)
    }

    return (
        <>
            <div className="mb-5 rounded-xl bg-white shadow-sm flex flex-wrap items-center justify-between gap-4 px-4 py-5">
                <h2 className="text-lg font-semibold text-gray-900">Teachers Directory({totalTeachers !== undefined ? totalTeachers : (teachersData || teachers).length})</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <Select value={branchFilter} onValueChange={setBranchFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All Branches" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Branches</SelectItem>
                            {uniqueBranches.map(branch => (
                                <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All Subjects" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Subjects</SelectItem>
                            {uniqueSubjects.map(subject => (
                                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
                <table className="w-full">
                    <thead style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }} className="rounded-t-lg">
                        <tr>
                            <th className="whitespace-nowrap rounded-tl-lg pb-3 pl-6 pt-3 text-left text-sm font-semibold text-white min-w-[250px]">Teacher</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Branch</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Subject</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Phone</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[200px]">Address</th>
                            <th className="whitespace-nowrap rounded-tr-lg pb-3 pr-6 pt-3 text-right text-sm font-semibold text-white min-w-[100px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTeachers.map((teacher) => (
                            <tr key={teacher.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                                <td className="whitespace-nowrap py-6 pl-6">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={teacher.avatar} />
                                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                                {teacher.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-gray-900">{teacher.name}</p>
                                            <p className="text-sm text-gray-600">{teacher.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap py-6 text-sm text-gray-700">{teacher.branch}</td>
                                <td className="whitespace-nowrap py-6 text-sm text-gray-700">{teacher.subject}</td>
                                <td className="whitespace-nowrap py-6 text-sm text-gray-700">
                                    {teacher.phone}
                                </td>
                                <td className="whitespace-nowrap py-6 text-sm text-gray-700">{teacher.address}</td>
                                <td className="whitespace-nowrap py-6 pr-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleView(teacher)}
                                            className="rounded-lg p-2 text-blue-600"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        {/* <button
                                            onClick={() => handleEdit(teacher)}
                                            className="rounded-lg p-2 text-green-600"
                                            title="Edit Teacher"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(teacher)}
                                            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
                                            title="Delete Teacher"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button> */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredTeachers.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                itemLabel="teachers"
            />

            {selectedTeacher && (
                <>
                    <ViewTeacherDialog
                        open={isViewDialogOpen}
                        onOpenChange={setIsViewDialogOpen}
                        teacher={selectedTeacher}
                    />
                </>
            )}
        </>
    )
}
