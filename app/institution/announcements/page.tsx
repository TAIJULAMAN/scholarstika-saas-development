"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { type Announcement } from "@/data/announcements"
import { ViewAnnouncementDialog } from "@/components/institution/announcements/view-announcement-dialog"
import { EditAnnouncementDialog } from "@/components/institution/announcements/edit-announcement-dialog"
import { DeleteConfirmationDialog } from "@/components/institution/announcements/delete-confirmation-dialog"
import { AddAnnouncementDialog } from "@/components/institution/announcements/add-announcement-dialog"
import { TablePagination } from "@/components/common/table-pagination"
import { AnnouncementsTable } from "@/components/institution/announcements/announcements-table"
import { useGetAllAnnouncementsQuery } from "@/redux/features/announcements/announcementsApi"

export default function AnnouncementsPage() {
    const [statusFilter, setStatusFilter] = useState("all")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

    const { data: announcementsData, isLoading, isError } = useGetAllAnnouncementsQuery()
    const fetchedAnnouncements: Announcement[] = (announcementsData?.data?.data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        branches: item.branches || "All Branches",
        audience: item.audience || [],
        status: item.isDelete ? "Archived" : "Active"
    }))

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const totalPages = Math.ceil(fetchedAnnouncements.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentAnnouncements = fetchedAnnouncements.slice(startIndex, endIndex)

    const handleView = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement)
        setIsViewDialogOpen(true)
    }

    const handleEdit = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement)
        setIsEditDialogOpen(true)
    }

    const handleDelete = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement)
        setIsDeleteDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col md:flex-row items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">All Announcements</h3>
                    <div className="flex items-center gap-2 mt-5 md:mt-0">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                        <button
                            onClick={() => setIsAddDialogOpen(true)}
                            style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }}
                            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
                        >
                            <Plus className="h-4 w-4" />
                            Add <span className="hidden md:inline"> Announcement</span>
                        </button>
                    </div>

                </div>


                {isLoading ? (
                    <div className="py-10 text-center text-gray-500">Loading announcements...</div>
                ) : isError ? (
                    <div className="py-10 text-center text-red-500">Failed to load announcements</div>
                ) : (
                    <>
                        <AnnouncementsTable
                            announcements={currentAnnouncements}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />

                        {/* Pagination */}
                        <TablePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={fetchedAnnouncements.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            itemLabel="announcements"
                        />
                    </>
                )}
            </div>

            {/* Dialogs */}
            <AddAnnouncementDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
            {selectedAnnouncement && (
                <>
                    <ViewAnnouncementDialog
                        open={isViewDialogOpen}
                        onOpenChange={setIsViewDialogOpen}
                        announcement={selectedAnnouncement}
                    />
                    <EditAnnouncementDialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        announcement={selectedAnnouncement}
                    />
                    <DeleteConfirmationDialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        announcementTitle={selectedAnnouncement.title}
                        announcementId={selectedAnnouncement.id}
                    />
                </>
            )}
        </div>
    )
}
