"use client"

import { Megaphone, AlertCircle } from "lucide-react"
import { useGetAllAnnouncementsQuery } from "@/redux/features/announcements/announcementsApi"

interface DashboardAnnouncementsProps {
    role: "Teacher" | "Parent" | "Student" | "Global Admin" | "Bursar"
}

export function DashboardAnnouncements({ role }: DashboardAnnouncementsProps) {
    const { data: apiResponse, isLoading, isError } = useGetAllAnnouncementsQuery();

    // Safely extract the announcements array
    const announcementsData = apiResponse?.data?.data || [];
    
    if (isError) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-orange-50 p-2">
                            <Megaphone className="h-5 w-5 text-orange-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Announcements</h2>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50/50 p-6 text-center">
                    <AlertCircle className="mb-2 h-6 w-6 text-red-500" />
                    <p className="text-sm font-medium text-red-800">Failed to load announcements</p>
                    <p className="text-xs text-red-600 mt-1">Please try again later.</p>
                </div>
            </div>
        )
    }

    // Filtering out deleted ones, but allowing all audiences for now so they show up in the UI
    const roleAnnouncements = announcementsData
        .filter((a: any) => !a.isDelete)
        .slice(0, 3);

    if (isLoading) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 animate-pulse">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-lg bg-gray-200" />
                        <div className="h-6 w-32 rounded bg-gray-200" />
                    </div>
                </div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 rounded-lg bg-gray-100" />
                    ))}
                </div>
            </div>
        )
    }

    if (roleAnnouncements.length === 0) return null

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-orange-50 p-2">
                        <Megaphone className="h-5 w-5 text-orange-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Announcements</h2>
                </div>
            </div>

            <div className="space-y-4">
                {roleAnnouncements.map((announcement: any) => {
                    const formattedDate = new Date(announcement.createdAt || announcement.updatedAt || Date.now()).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    });

                    return (
                        <div key={announcement.id} className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50">
                            <div className="mb-2 flex items-start justify-between gap-4">
                                <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                                <span className="shrink-0 text-xs text-gray-500">{formattedDate}</span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{announcement.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
