"use client"

import { Clock, Calendar, Video, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetTeacherScheduleQuery } from "@/redux/features/teacher/teacherApi"


const subjectColors: { [key: string]: string } = {
    Mathematics: "bg-blue-50 text-blue-700 border-blue-200",
    Algebra: "bg-purple-50 text-purple-700 border-purple-200",
    Calculus: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Statistics: "bg-orange-50 text-orange-700 border-orange-200",
    Geometry: "bg-pink-50 text-pink-700 border-pink-200",
    "Free Period": "bg-gray-50/50 text-gray-400 border-dashed border-gray-200",
    Break: "bg-yellow-50 text-yellow-700 border-yellow-200",
}

export default function TeacherSchedulePage() {
    const { data: scheduleData, isLoading } = useGetTeacherScheduleQuery({});
    
    const rawSchedule = scheduleData?.data?.data || [];
    
    const allDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const activeDays = allDays.filter(d => rawSchedule.some((item: any) => item.day === d));
    const days = activeDays.length > 0 ? activeDays : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    const uniqueTimes = Array.from(new Set(rawSchedule.map((item: any) => item.time))).filter(Boolean) as string[];
    uniqueTimes.sort((a, b) => a.localeCompare(b)); // sort times alphabetically (works well for 08:00 vs 09:00 format)
    const timeSlots = uniqueTimes.length > 0 ? uniqueTimes : [
        "8:00 - 8:45",
        "8:45 - 9:30",
        "9:30 - 10:15",
        "10:15 - 11:00",
        "11:00 - 11:45",
        "11:45 - 12:30",
        "1:00 - 1:45",
        "1:45 - 2:30",
    ];

    const getPeriod = (day: string, time: string) => {
        const session = rawSchedule.find((item: any) => item.day === day && item.time === time);
        if (!session) return null;
        
        return {
            subject: session.assignableSubject || "Unknown",
            grade: session.classLevel || "-",
            type: session.isOnline ? "online" : "offline",
            room: session.roomNumber || "N/A",
            meetingUrl: "https://zoom.us/j/123456789" // placeholder since API didn't provide it
        };
    };

    if (isLoading) {
        return <div className="p-6 text-center text-lg font-medium text-emerald-600">Loading schedule...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-emerald-500 p-6 text-white shadow-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Teaching Schedule</h1>
                        <p className="mt-1 text-emerald-50 opacity-90">View your weekly class timetable</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-400/30 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                        <Calendar className="h-4 w-4" />
                        Spring Semester 2024
                    </div>
                </div>
            </div>

            <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Weekly Timetable</h2>
                        <div className="flex items-center gap-4 text-sm">

                            <div className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-blue-500" />
                                <span className="text-gray-600">Online</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-600">Offline</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">Time</th>
                                {days.map((day) => (
                                    <th key={day} className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {timeSlots.map((time, timeIndex) => (
                                <tr key={time} className="hover:bg-gray-50/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap bg-gray-50/30 border-r border-gray-50">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                                            <Clock className="h-4 w-4 text-emerald-500" />
                                            {time}
                                        </div>
                                    </td>
                                    {days.map((day) => {
                                        const period = getPeriod(day, time)
                                        if (!period) return <td key={day} className="border-r border-gray-50 bg-gray-50/10"></td>

                                        const colorClass = subjectColors[period.subject] || "bg-gray-50 text-gray-700 border-gray-200"

                                        return (
                                            <td key={day} className="p-2 border-r border-gray-50 min-w-[180px]">
                                                <div
                                                    className={`h-full min-h-[100px] flex flex-col justify-between rounded-lg border p-3 ${colorClass} transition-transform hover:scale-[1.02] hover:shadow-sm`}
                                                >
                                                    <div>
                                                        <div className="flex items-start justify-between">
                                                            <p className="font-bold text-sm tracking-tight">{period.subject}</p>
                                                            {period.type === 'online' ? (
                                                                <Video className="h-3 w-3 opacity-70" />
                                                            ) : period.subject !== "Free Period" && period.subject !== "Break" ? (
                                                                <MapPin className="h-3 w-3 opacity-70" />
                                                            ) : null}
                                                        </div>
                                                        {period.grade !== "-" && (
                                                            <div className="mt-1 text-xs font-medium opacity-90">
                                                                {period.grade}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {period.subject !== "Free Period" && period.subject !== "Break" && (
                                                        <div className="mt-2">
                                                            {period.type === 'online' ? (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="h-7 w-full border-blue-200 bg-blue-100/50 text-blue-700 hover:bg-blue-200 hover:text-blue-800"
                                                                    onClick={() => window.open(period.meetingUrl, '_blank')}
                                                                >
                                                                    <Video className="mr-1.5 h-3 w-3" />
                                                                    Join Zoom
                                                                </Button>
                                                            ) : (
                                                                <div className="flex items-center gap-1.5 text-xs opacity-80 bg-white/50 px-2 py-1 rounded">
                                                                    <MapPin className="h-3 w-3" />
                                                                    {period.room}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
