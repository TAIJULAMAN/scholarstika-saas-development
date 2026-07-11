"use client"
import { useState, useEffect } from "react"
import { Search, Download, Share2, Play, AlertCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useGetTeacherRecordingsQuery } from "@/redux/features/teacher/teacherApi"

type Recording = {
    id: string;
    title: string;
    subject: string;
    grade: string;
    date: string;
    duration: string;
    status: string;
    statusColor: string;
    videoUrl: string;
}


export default function TeacherClassesPage() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to first page when search changes
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data: recordingsData, isLoading } = useGetTeacherRecordingsQuery({
        page,
        limit: 10,
        searchTerm: debouncedSearch
    });
    
    const fetchedRecordings = Array.isArray(recordingsData?.data) ? recordingsData.data : (recordingsData?.data?.data || []);
    const meta = recordingsData?.data?.meta || { total: 0, page: 1, limit: 10, totalPage: 1 };

    const recordings: Recording[] = fetchedRecordings.map((r: any) => ({
        id: r.id,
        title: `${r.classDistribution?.assignableSubject || "Class"} Recording`,
        subject: r.classDistribution?.assignableSubject || "Unknown",
        grade: r.classDistribution?.classLevel || "Unknown",
        date: new Date(r.createdAt).toLocaleDateString(),
        duration: r.classDistribution?.time || "N/A",
        status: r.recordingUrl ? "Available" : "Processing",
        statusColor: r.recordingUrl ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700",
        videoUrl: r.recordingUrl || "#",
    }));

    if (isLoading) {
        return <div className="p-6 text-center text-lg font-medium text-emerald-600">Loading recordings...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-emerald-500 p-6 text-white shadow-lg">
                <h1 className="text-2xl font-bold">Recorded Classes</h1>
                <p className="mt-1 text-emerald-50 opacity-90">Access and manage your recorded class sessions</p>
            </div>

            <div className="flex justify-end items-center shadow-md rounded-xl p-5">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search recordings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none"
                    />
                </div>
            </div>

            {/* Recordings Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recordings.map((recording) => (
                    <div key={recording.id} className="group rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md">
                        <div className="mb-4 flex items-start justify-between">
                            <div className="flex-1 pr-4">
                                <h3 className="line-clamp-2 font-bold text-gray-900">{recording.title}</h3>
                            </div>
                            <span className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${recording.statusColor}`}>
                                {recording.status === "Failed" ? "Recording Failed" : recording.status}
                            </span>
                        </div>

                        <div className="mb-6 space-y-2">
                            <p className="text-sm text-gray-600">{recording.subject} • {recording.grade}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">📅 {recording.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">⏱️ {recording.duration}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                            {recording.status === "Available" ? (
                                <a href={recording.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors">
                                    <Play className="h-4 w-4 fill-current" />
                                    View Recording
                                </a>
                            ) : recording.status === "Processing" ? (
                                <button disabled className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Processing...
                                </button>
                            ) : (
                                <button disabled className="flex cursor-not-allowed items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400">
                                    <AlertCircle className="h-4 w-4" />
                                    Recording Failed
                                </button>
                            )}

                            <div className="flex items-center gap-2">
                                <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600" title="Download">
                                    <Download className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {meta.total > 0 && (
                <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-5 gap-3">
                    <p className="text-sm text-gray-500">
                        Showing {(meta.page - 1) * meta.limit + 1}-{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} recordings
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        
                        {Array.from({ length: meta.totalPage || meta.totalPages || 1 }, (_, i) => i + 1).map((p) => (
                            <button 
                                key={p}
                                onClick={() => setPage(p)}
                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                    page === p 
                                    ? "bg-teal-500 text-white" 
                                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                {p}
                            </button>
                        ))}

                        <button 
                            disabled={page === (meta.totalPage || meta.totalPages || 1) || (meta.totalPage || meta.totalPages || 1) === 0}
                            onClick={() => setPage(page + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
