"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/common/page-header"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Save, Mail, Phone, UserCheck, UserX, Clock, Search } from "lucide-react"
import { format } from "date-fns"
import { useGetTeacherScheduleQuery, useGetTeacherAttendanceQuery, useUpdateTeacherAttendanceMutation } from "@/redux/features/teacher/teacherApi"

const EMPTY_ARRAY: any[] = [];

export default function TeacherAttendancePage() {
    const [selectedClass, setSelectedClass] = useState("")
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [attendance, setAttendance] = useState<{ [key: string]: string }>({})
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const [emailSubject, setEmailSubject] = useState("")
    const [emailMessage, setEmailMessage] = useState("")
    const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    const { data: scheduleData, isLoading: isScheduleLoading, isError: isScheduleError } = useGetTeacherScheduleQuery({});
    const classes = scheduleData?.data?.data || EMPTY_ARRAY;

    const { data: attendanceResponse, isLoading: isLoadingAttendance, isError: isAttendanceError } = useGetTeacherAttendanceQuery(selectedClass, {
        skip: !selectedClass
    });
    const students = attendanceResponse?.data?.data || EMPTY_ARRAY;

    const [updateAttendance, { isLoading: isUpdating }] = useUpdateTeacherAttendanceMutation();

    useEffect(() => {
        if (classes.length > 0 && !selectedClass) {
            setSelectedClass(classes[0].id)
        }
    }, [classes, selectedClass])

    useEffect(() => {
        if (students.length > 0) {
            const initial: any = {};
            students.forEach((s: any) => {
                initial[s.id] = s.attendanceStatus?.toLowerCase() || "absent";
            });
            setAttendance(initial);
        } else {
            setAttendance({});
        }
    }, [students])

    const handleStatusChange = (studentId: string, status: string) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }))
    }

    const handleMarkAllPresent = () => {
        const newAttendance = { ...attendance }
        students.forEach((student: any) => {
            newAttendance[student.id] = "present"
        })
        setAttendance(newAttendance)
    }

    const handleSave = async () => {
        if (!selectedClass) {
            alert("Please select a class first");
            return;
        }

        const payload = {
            attendanceDate: format(selectedDate, 'yyyy-MM-dd'),
            subscriptionId: selectedClass,
            students: students.map((student: any) => ({
                studentId: student.studentId,
                attendanceStatus: (attendance[student.id] || "absent").toUpperCase()
            }))
        };

        try {
            await updateAttendance(payload).unwrap();
            alert("Attendance updated successfully!");
        } catch (error) {
            console.error("Failed to update attendance", error);
            alert("Failed to update attendance. Please try again.");
        }
    }

    const handleOpenEmailDialog = (student: any) => {
        setSelectedStudent(student)
        setEmailSubject(`Absence Notification - ${student.name}`)
        setEmailMessage(`Dear ${student.staffs?.name || 'Parent'},\n\nThis is to inform you that your child, ${student.name}, was marked absent on ${format(selectedDate, 'PPPP')}.\n\nIf you have any questions or concerns, please don't hesitate to contact us.\n\nBest regards,\nTeacher`)
        setIsEmailDialogOpen(true)
    }

    const handleSendEmail = () => {
        if (selectedStudent) {
            console.log("Sending email to:", selectedStudent.staffs?.email, {
                subject: emailSubject,
                message: emailMessage
            })
            alert(`Email sent successfully to ${selectedStudent.staffs?.name || 'Parent'} (${selectedStudent.staffs?.email || 'N/A'})`)
            setIsEmailDialogOpen(false)
            setSelectedStudent(null)
            setEmailSubject("")
            setEmailMessage("")
        }
    }

    const stats = {
        present: Object.values(attendance).filter(s => s === "present").length,
        absent: Object.values(attendance).filter(s => s === "absent").length,
        late: Object.values(attendance).filter(s => s === "late").length,
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-5 rounded-xl bg-white p-5 shadow-md">
                <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Select Class</label>
                    {isScheduleLoading ? (
                        <div className="text-sm text-gray-500 py-2">Loading classes...</div>
                    ) : isScheduleError ? (
                        <div className="text-sm text-red-500 py-2">Failed to load classes.</div>
                    ) : (
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map((cls: any) => (
                                    <SelectItem key={cls.id} value={cls.id}>
                                        {cls.classLevel} - {cls.assignableSubject}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">Select Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => date && setSelectedDate(date)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="flex text-emerald-500 items-center gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                    <div className="rounded-lg p-3 bg-emerald-50">
                        <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.present}</h3>
                        <p className="text-sm font-medium text-gray-600">Present</p>
                    </div>
                </div>
                <div className="flex text-emerald-500 items-center gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                    <div className="rounded-lg p-3 bg-emerald-50">
                        <UserX className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.absent}</h3>
                        <p className="text-sm font-medium text-gray-600">Absent</p>
                    </div>
                </div>
                <div className="flex text-emerald-500 items-center gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                    <div className="rounded-lg p-3 bg-emerald-50">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.late}</h3>
                        <p className="text-sm font-medium text-gray-600">Late</p>
                    </div>
                </div>
            </div>

            {/* Attendance Sheet */}
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Attendance Sheet</h2>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleMarkAllPresent}
                                variant="outline"
                                className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
                            >
                                <UserCheck className="mr-2 h-4 w-4" />
                                Mark All Present
                            </Button>
                            <Button 
                                onClick={handleSave} 
                                disabled={isUpdating}
                                className="bg-emerald-500 hover:bg-emerald-600"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {isUpdating ? "Saving..." : "Save Attendance"}
                            </Button>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }}>
                            <tr>
                                <th className="whitespace-nowrap rounded-tl-lg pb-3 pl-6 pt-3 text-left text-sm font-semibold text-white">Student Name</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white">Parent Contact</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white">Status</th>
                                <th className="whitespace-nowrap rounded-tr-lg pb-3 pr-6 pt-3 text-right text-sm font-semibold text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingAttendance ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-500">
                                        Loading attendance data...
                                    </td>
                                </tr>
                            ) : isAttendanceError ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-red-500">
                                        Failed to load attendance data.
                                    </td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-500">
                                        No students found.
                                    </td>
                                </tr>
                            ) : (
                                students.filter((student: any) =>
                                    student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    student.staffs?.name?.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map((student: any) => (
                                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="whitespace-nowrap py-4 pl-6 font-medium text-gray-900">{student.name}</td>
                                    <td className="whitespace-nowrap py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <span className="font-medium">{student.staffs?.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Mail className="h-3 w-3" />
                                                <span>{student.staffs?.email || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Phone className="h-3 w-3" />
                                                <span>{student.staffs?.phoneNumber || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatusChange(student.id, "present")}
                                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${attendance[student.id] === "present"
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                Present
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(student.id, "absent")}
                                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${attendance[student.id] === "absent"
                                                    ? "bg-red-500 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                Absent
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(student.id, "late")}
                                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${attendance[student.id] === "late"
                                                    ? "bg-yellow-500 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                Late
                                            </button>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap py-4 pr-6">
                                        <div className="flex justify-end">
                                            {attendance[student.id] === "absent" && (
                                                <Button
                                                    onClick={() => handleOpenEmailDialog(student)}
                                                    size="sm"
                                                    className="bg-emerald-500"
                                                >
                                                    <Mail className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Email Dialog */}
            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Send Email to Parent</DialogTitle>
                    </DialogHeader>
                    {selectedStudent && (
                        <div className="space-y-4 py-4">
                            <div className="rounded-lg bg-gray-50 p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Student</p>
                                        <p className="text-sm text-gray-900">{selectedStudent.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Parent</p>
                                        <p className="text-sm text-gray-900">{selectedStudent.staffs?.name || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm font-medium text-gray-700">Email Address</p>
                                        <p className="text-sm text-gray-900">{selectedStudent.staffs?.email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    placeholder="Email subject"
                                />
                            </div>
                            <div>
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    value={emailMessage}
                                    onChange={(e) => setEmailMessage(e.target.value)}
                                    placeholder="Email message"
                                    rows={10}
                                    className="resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsEmailDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSendEmail}
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Email
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
