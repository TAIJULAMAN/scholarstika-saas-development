"use client"

import { Clock, Plus, FileText, CheckSquare, Calendar, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardAnnouncements } from "@/components/common/dashboard-announcements"
import { useGetTeacherScheduleQuery } from "@/redux/features/teacher/teacherApi"
import { useGetSpecificTeacherAssignmentsQuery } from "@/redux/features/assignments/assignmentsApi"

export default function TeacherDashboardPage() {
    const router = useRouter()

    const { data: scheduleData, isLoading: isScheduleLoading, isError: isScheduleError } = useGetTeacherScheduleQuery({});
    const { data: assignmentsData, isLoading: isAssignmentsLoading, isError: isAssignmentsError } = useGetSpecificTeacherAssignmentsQuery({});
    
    const rawSchedule = scheduleData?.data?.data || [];
    const rawAssignments = assignmentsData?.data?.data || [];
    
    const assignments = rawAssignments.slice(0, 3).map((a: any) => {
        const isPastDue = new Date(a.assignmentDueDate) < new Date();
        return {
            title: a.assignmentTitle,
            class: `${a.classDistributions?.classLevel || "N/A"} • ${a.assignmentType || "N/A"}`,
            due: `Due: ${new Date(a.assignmentDueDate).toLocaleDateString()}`,
            status: isPastDue ? "Completed" : "Pending",
            statusColor: isPastDue ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800",
        };
    });
    const schedule = rawSchedule.map((item: any) => ({
        subject: item.assignableSubject || "N/A",
        grade: item.classLevel || "N/A",
        time: item.time || "N/A",
        bg: "bg-emerald-50",
        text: "text-emerald-500",
    }));

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="rounded-xl bg-emerald-500 p-6 text-white shadow-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
                        <p className="mt-1 text-emerald-50 opacity-90">Manage your classes, students, and tasks efficiently</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Today's Schedule */}
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Today's Schedule</h2>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-500">
                            <Calendar className="h-4 w-4" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        {isScheduleLoading ? (
                            <div className="text-sm text-gray-500">Loading schedule...</div>
                        ) : isScheduleError ? (
                            <div className="text-sm text-red-500">Failed to load schedule.</div>
                        ) : schedule.length > 0 ? (
                            schedule.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between rounded-lg p-4 transition-colors hover:opacity-80 ${item.bg}`}
                                >
                                    <div>
                                        <h3 className="font-bold text-gray-900">{item.subject}</h3>
                                        <p className="text-sm text-gray-500">{item.grade}</p>
                                    </div>
                                    <div className={`font-medium ${item.text}`}>{item.time}</div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500">No classes scheduled for today.</div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                    <h2 className="mb-6 text-lg font-bold text-gray-900">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => router.push('/teacher/attendance')}
                            className="flex flex-col items-center justify-center gap-3 rounded-xl bg-emerald-50 p-6 text-emerald-900 transition-transform hover:scale-105"
                        >
                            <div className="rounded-full bg-emerald-500 p-2 text-white">
                                <CheckSquare className="h-6 w-6" />
                            </div>
                            <span className="font-semibold">Mark Attendance</span>
                        </button>
                        <button
                            onClick={() => router.push('/teacher/assignments')}
                            className="flex flex-col items-center justify-center gap-3 rounded-xl bg-emerald-50 p-6 text-emerald-900 transition-transform hover:scale-105"
                        >
                            <div className="rounded-full bg-emerald-500 p-2 text-white">
                                <Plus className="h-6 w-6" />
                            </div>
                            <span className="font-semibold">New Assignment</span>
                        </button>
                        <button
                            onClick={() => router.push('/teacher/grades')}
                            className="flex flex-col items-center justify-center gap-3 rounded-xl bg-emerald-50 p-6 text-emerald-900 transition-transform hover:scale-105"
                        >
                            <div className="rounded-full bg-emerald-500 p-2 text-white">
                                <FileText className="h-6 w-6" />
                            </div>
                            <span className="font-semibold">Grade Papers</span>
                        </button>
                        <button
                            onClick={() => router.push('/teacher/schedule')}
                            className="flex flex-col items-center justify-center gap-3 rounded-xl bg-emerald-50 p-6 text-emerald-900 transition-transform hover:scale-105"
                        >
                            <div className="rounded-full bg-emerald-500 p-2 text-white">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <span className="font-semibold">Schedule Class</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Assignments & Homework */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Assignments & Homework</h2>
                        <button
                            onClick={() => router.push('/teacher/assignments')}
                            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                        >
                            View All
                        </button>
                    </div>
                    <div className="space-y-3">
                        {isAssignmentsLoading ? (
                            <div className="text-sm text-gray-500">Loading assignments...</div>
                        ) : isAssignmentsError ? (
                            <div className="text-sm text-red-500">Failed to load assignments.</div>
                        ) : assignments.length > 0 ? (
                            assignments.map((assignment: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50"
                                >
                                    <div className="flex items-start gap-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{assignment.title}</h3>
                                            <p className="text-sm text-gray-500">{assignment.class}</p>
                                            <p className="mt-1 text-xs text-gray-400">{assignment.due}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`rounded px-2.5 py-0.5 text-xs font-semibold ${assignment.statusColor}`}>
                                            {assignment.status}
                                        </span>
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-gray-500">No recent assignments found.</div>
                        )}
                    </div>
                </div>

                <DashboardAnnouncements role="Teacher" />
            </div>
        </div>
    )
}
