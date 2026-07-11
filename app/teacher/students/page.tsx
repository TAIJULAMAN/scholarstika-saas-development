"use client"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Mail, Phone, Users, UserCheck, AlertCircle, MessageSquare } from "lucide-react"
import { useGetTeacherStudentsQuery } from "@/redux/features/teacher/teacherApi"

type Student = {
    id: string;
    name: string;
    email: string;
    phone: string;
    class: string;
    status: string;
    avatar: string | undefined;
    studentId: string;
    original: any;
}

export default function TeacherStudentsPage() {
    const [classFilter, setClassFilter] = useState("all")
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

    const { data: studentsData, isLoading } = useGetTeacherStudentsQuery({});

    // Safely extract the array to handle nested pagination responses
    const fetchedStudents = Array.isArray(studentsData?.data)
        ? studentsData.data
        : (studentsData?.data?.data || []);

    const students: Student[] = fetchedStudents.map((s: any) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.guardianPhone || "N/A",
        class: s.className || (s.classDistributions?.[0]?.classLevel) || "N/A",
        status: "Present",
        avatar: s.photo || undefined,
        studentId: s.studentId || "N/A",
        original: s
    }));

    const uniqueClasses = Array.from(new Set(students.map(s => s.class))).filter(c => c && c !== "N/A");

    const filteredStudents = classFilter === "all"
        ? students
        : students.filter(s => s.class === classFilter)

    const stats = [
        {
            label: "Total Students",
            value: filteredStudents.length.toString(),
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            label: "Present Today",
            value: filteredStudents.filter(s => s.status === "Present").length.toString(),
            icon: UserCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "At Risk",
            value: filteredStudents.filter(s => s.status !== "Present").length.toString(),
            icon: AlertCircle,
            color: "text-red-600",
            bg: "bg-red-50",
        },
    ]

    if (isLoading) {
        return <div className="p-6 text-center text-lg font-medium text-emerald-600">Loading students...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-emerald-500 p-6 text-white shadow-lg">
                <h1 className="text-2xl font-bold">My Students</h1>
                <p className="mt-1 text-emerald-50 opacity-90">View and manage students in your classes</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <div key={index} className="flex text-emerald-500 items-center gap-4 rounded-xl p-6 shadow-sm ring-1 ring-gray-100">
                            <div className={`rounded-lg p-3 bg-emerald-50`}>
                                <Icon className={`h-6 w-6`} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Student Directory</h2>
                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            {uniqueClasses.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }}>
                            <tr>
                                <th className="whitespace-nowrap rounded-tl-lg pb-3 pl-6 pt-3 text-left text-sm font-semibold text-white">Student</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white">Class</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white">Status</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white">Contact</th>
                                <th className="whitespace-nowrap rounded-tr-lg pb-3 pr-6 pt-3 text-right text-sm font-semibold text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="group transition-colors hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-gray-100">
                                                <AvatarImage src={student.avatar} />
                                                <AvatarFallback className="bg-emerald-100 text-emerald-600">
                                                    {student.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-gray-900">{student.name}</p>
                                                <p className="text-xs text-gray-500">{student.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                            {student.class}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${student.status === "Present" ? "bg-green-100 text-green-700" :
                                            student.status === "Absent" ? "bg-red-100 text-red-700" :
                                                "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-3 w-3" />
                                            {student.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                className="rounded p-2 text-emerald-600 hover:bg-emerald-50" 
                                                title="View Profile"
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setIsViewModalOpen(true);
                                                }}
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
            </div>

            {/* View Student Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Student Profile</DialogTitle>
                    </DialogHeader>
                    {selectedStudent && (
                        <div className="space-y-6 py-4">
                            <div className="flex items-center gap-6 border-b border-gray-100 pb-6">
                                <Avatar className="h-20 w-20 border border-gray-100 shadow-sm">
                                    <AvatarImage src={selectedStudent.avatar} />
                                    <AvatarFallback className="bg-emerald-100 text-emerald-600 text-2xl font-bold">
                                        {selectedStudent.name.split(' ').map((n: string) => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
                                    <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-700">Student ID:</span> {selectedStudent.studentId}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-700">Primary Class:</span> {selectedStudent.class}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Mail className="h-4 w-4 text-emerald-600" />
                                            <span>{selectedStudent.email}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Phone className="h-4 w-4 text-emerald-600" />
                                            <span>{selectedStudent.phone} (Guardian)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900 border-b pb-2">Current Status</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-semibold ${selectedStudent.status === "Present" ? "bg-green-100 text-green-700" :
                                            selectedStudent.status === "Absent" ? "bg-red-100 text-red-700" :
                                                "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {selectedStudent.status} Today
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900 border-b pb-2">Enrolled Subjects</h3>
                                {selectedStudent.original.classDistributions && selectedStudent.original.classDistributions.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selectedStudent.original.classDistributions.map((cd: any, idx: number) => (
                                            <div key={idx} className="rounded-lg bg-gray-50 p-3 border border-gray-100 shadow-sm">
                                                <p className="font-semibold text-gray-800">{cd.assignableSubject}</p>
                                                <p className="text-xs text-gray-500 mt-1">{cd.day} • {cd.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No assigned subjects found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
