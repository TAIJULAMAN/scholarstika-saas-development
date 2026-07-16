"use client"

import { useState, useMemo, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

const sections = [
    {
        id: 1,
        grade: "Grade 1",
        section: "A",
        classTeacher: "Sarah Johnson",
        capacity: 40,
        enrolled: 38,
        room: "101",
        status: "Active",
    },
    {
        id: 2,
        grade: "Grade 1",
        section: "B",
        classTeacher: "Michael Chen",
        capacity: 40,
        enrolled: 40,
        room: "102",
        status: "Active",
    },
    {
        id: 3,
        grade: "Grade 2",
        section: "A",
        classTeacher: "Emily Davis",
        capacity: 40,
        enrolled: 35,
        room: "201",
        status: "Active",
    },
    {
        id: 4,
        grade: "Grade 3",
        section: "A",
        classTeacher: "James Wilson",
        capacity: 40,
        enrolled: 39,
        room: "301",
        status: "Active",
    },
    {
        id: 5,
        grade: "Grade 4",
        section: "A",
        classTeacher: "Lisa Anderson",
        capacity: 40,
        enrolled: 37,
        room: "401",
        status: "Active",
    },
    {
        id: 6,
        grade: "Grade 5",
        section: "A",
        classTeacher: "Robert Brown",
        capacity: 40,
        enrolled: 40,
        room: "501",
        status: "Active",
    },
]

export function SectionsTable({ sectionsData, totalSections }: { sectionsData?: any[], totalSections?: number }) {
    const [gradeFilter, setGradeFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedSection, setSelectedSection] = useState<typeof sections[0] | null>(null)

    const filteredSections = useMemo(() => {
        const sourceData = sectionsData || sections;
        return sourceData.filter(section => {
            const matchesGrade = gradeFilter === "all" || section.grade === gradeFilter
            const matchesStatus = statusFilter === "all" || section.status.toLowerCase() === statusFilter
            const matchesSearch = searchQuery === "" ||
                section.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (section.section && section.section.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (section.classTeacher && section.classTeacher.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (section.room && section.room.toLowerCase().includes(searchQuery.toLowerCase()))
            return matchesGrade && matchesStatus && matchesSearch
        })
    }, [gradeFilter, statusFilter, searchQuery, sectionsData])

    const itemsPerPage = 6
    const totalPages = Math.ceil(filteredSections.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentSections = filteredSections.slice(startIndex, endIndex)

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [gradeFilter, statusFilter, searchQuery])

    return (
        <>
            <div className="rounded-xl bg-white py-4 shadow-sm sm:py-6">
                <div className="mb-4 flex flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <h2 className="text-lg font-semibold text-gray-900">All Sections({totalSections !== undefined ? totalSections : filteredSections.length})</h2>
                    <div className="flex items-center gap-2"    >
                        <div className="relative flex-1 w-full sm:min-w-[250px]">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search sections..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }} className="rounded-t-lg">
                            <tr>
                                <th className="whitespace-nowrap rounded-tl-lg pb-3 pl-6 pt-3 text-left text-sm font-semibold text-white min-w-[150px]">Section</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[200px]">Class Teacher</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[100px]">Room</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[120px]">Enrollment</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[100px]">Capacity</th>
                                <th className="whitespace-nowrap rounded-tr-lg pb-3 pt-3 text-left text-sm font-semibold text-white min-w-[100px]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentSections.map((section) => (
                                <tr key={section.id} className="border-b border-gray-100 transition-colors hover:bg-gray-50">
                                    <td className="whitespace-nowrap py-6 pl-6">
                                        <div>
                                            <p className="font-medium text-gray-900">{section.grade} - {section.section}</p>
                                            <p className="text-xs text-gray-500">{section.day} • {section.time}</p>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-6 text-sm text-gray-700">{section.classTeacher}</td>
                                    <td className="whitespace-nowrap py-6 text-sm text-gray-700">{section.room}</td>
                                    <td className="whitespace-nowrap py-6">
                                        <span className="text-sm font-semibold text-gray-900">{section.enrolled}</span>
                                    </td>
                                    <td className="whitespace-nowrap py-6 text-sm text-gray-700">{section.capacity}</td>
                                    <td className="whitespace-nowrap py-6">
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                            {section.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-4 flex flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
                    <p className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredSections.length)} of {filteredSections.length} results
                    </p>
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            const pageNum = i + 1
                            return (
                                <Button
                                    key={pageNum}
                                    size="sm"
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    style={currentPage === pageNum ? { backgroundColor: 'rgba(16, 185, 129, 0.8)' } : {}}
                                    className={currentPage === pageNum ? "text-white hover:bg-emerald-700" : ""}
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            )
                        })}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Section</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Grade Level</Label>
                            <Select defaultValue={selectedSection?.grade.split(' ')[1]}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Grade 1</SelectItem>
                                    <SelectItem value="2">Grade 2</SelectItem>
                                    <SelectItem value="3">Grade 3</SelectItem>
                                    <SelectItem value="4">Grade 4</SelectItem>
                                    <SelectItem value="5">Grade 5</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Section Name</Label>
                            <Input placeholder="e.g., A, B, C" defaultValue={selectedSection?.section} />
                        </div>
                        <div>
                            <Label>Class Teacher</Label>
                            <Select defaultValue={selectedSection?.classTeacher}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                                    <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                                    <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                                    <SelectItem value="James Wilson">James Wilson</SelectItem>
                                    <SelectItem value="Lisa Anderson">Lisa Anderson</SelectItem>
                                    <SelectItem value="Robert Brown">Robert Brown</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Capacity</Label>
                            <Input type="number" placeholder="40" defaultValue={selectedSection?.capacity} />
                        </div>
                        <div>
                            <Label>Room Number</Label>
                            <Input placeholder="e.g., 101" defaultValue={selectedSection?.room} />
                        </div>
                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => {
                                // Handle update logic here
                                setIsEditDialogOpen(false)
                                setSelectedSection(null)
                            }}
                        >
                            Update Section
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Archive Section</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Are you sure you want to archive this section? This will mark the section as inactive.
                        </p>
                        <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-700">Section:</span>
                                <span className="text-sm text-gray-900">{selectedSection?.grade} - {selectedSection?.section}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-700">Class Teacher:</span>
                                <span className="text-sm text-gray-900">{selectedSection?.classTeacher}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-700">Room:</span>
                                <span className="text-sm text-gray-900">{selectedSection?.room}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-700">Enrolled Students:</span>
                                <span className="text-sm text-gray-900">{selectedSection?.enrolled} / {selectedSection?.capacity}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setIsDeleteDialogOpen(false)
                                    setSelectedSection(null)
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 bg-orange-600 hover:bg-orange-700"
                                onClick={() => {
                                    // Handle archive logic here
                                    setIsDeleteDialogOpen(false)
                                    setSelectedSection(null)
                                }}
                            >
                                Archive Section
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
