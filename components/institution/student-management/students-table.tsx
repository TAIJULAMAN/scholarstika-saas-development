"use client"

import { useState, useMemo, useEffect } from "react"
import { Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddStudentDialog } from "./add-student-dialog"
import { EditStudentDialog } from "./edit-student-dialog"
import { ViewStudentDialog } from "./view-student-dialog"
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog"
import { TablePagination } from "@/components/common/table-pagination"
import { students, type Student } from "@/data/students"

export function StudentsTable({ studentsData, totalStudents }: { studentsData?: Student[], totalStudents?: number }) {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [branchFilter, setBranchFilter] = useState("all")
    const [gradeFilter, setGradeFilter] = useState("all")

    const uniqueBranches = useMemo(() => {
        const sourceData = studentsData || students;
        return Array.from(new Set(sourceData.map(s => s.branch))).filter(Boolean);
    }, [studentsData]);

    const uniqueGrades = useMemo(() => {
        const sourceData = studentsData || students;
        return Array.from(new Set(sourceData.map(s => s.grade))).filter(Boolean);
    }, [studentsData]);

    const filteredStudents = useMemo(() => {
        const sourceData = studentsData || students;
        return sourceData.filter(student => {
            const matchesBranch = branchFilter === "all" || student.branch === branchFilter
            const matchesGrade = gradeFilter === "all" || student.grade === gradeFilter
            return matchesBranch && matchesGrade
        })
    }, [branchFilter, gradeFilter, studentsData])

    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentStudents = filteredStudents.slice(startIndex, endIndex)

    useEffect(() => {
        setCurrentPage(1)
    }, [branchFilter, gradeFilter])

    const handleView = (student: Student) => {
        setSelectedStudent(student)
        setIsViewDialogOpen(true)
    }

    return (
        <>
            <div className="mb-5 bg-white shadow-md flex flex-wrap items-center justify-between gap-4 px-4 sm:px-6 py-5 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900">Students Directory({totalStudents !== undefined ? totalStudents : filteredStudents.length})</h2>
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

                    <Select value={gradeFilter} onValueChange={setGradeFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All Grades" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Grades</SelectItem>
                            {uniqueGrades.map(grade => (
                                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="w-full">
                    <thead style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }} className="rounded-t-lg">
                        <tr>
                            <th className="whitespace-nowrap rounded-tl-lg pb-3 pl-6 pt-3 text-left text-sm font-semibold text-white min-w-[250px]">Student</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Branch</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[100px]">Grade</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[120px]">Phone</th>
                            <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Guardian</th>
                            <th className="whitespace-nowrap rounded-tr-lg pb-3 pr-6 pt-3 text-right text-sm font-semibold text-white min-w-[100px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentStudents.map((student) => (
                            <tr key={student.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                                <td className="whitespace-nowrap py-6 pl-6">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={student.avatar} />
                                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-gray-900">{student.name}</p>
                                            <p className="text-sm text-gray-600">{student.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap py-6 text-sm text-gray-700">{student.branch}</td>
                                <td className="whitespace-nowrap py-6 text-sm text-gray-700">{student.grade}</td>
                                <td className="whitespace-nowrap py-6 text-sm text-gray-700">
                                    {student.phone}
                                </td>
                                <td className="whitespace-nowrap py-6 text-sm text-gray-700">{student.guardian}</td>
                                <td className="whitespace-nowrap py-6 pr-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleView(student)}
                                            className="rounded-lg p-2 text-blue-600"
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
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
                totalItems={filteredStudents.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                itemLabel="students"
            />

            {/* Dialogs */}
            <AddStudentDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
            {selectedStudent && (
                <>
                    <EditStudentDialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        student={selectedStudent}
                    />
                    <ViewStudentDialog
                        open={isViewDialogOpen}
                        onOpenChange={setIsViewDialogOpen}
                        student={selectedStudent}
                    />
                    <DeleteConfirmationDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        studentName={selectedStudent.name}
                    />
                </>
            )}
        </>
    )
}
