"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar, FileText, Users, AlertCircle } from "lucide-react"
import { useGetSpecificTeacherAssignmentsQuery, useUpdateTeacherAssignmentMutation } from "@/redux/features/assignments/assignmentsApi"
import { toast } from "sonner"

type Assignment = {
    id: string;
    title: string;
    class: string;
    dueDate: string;
    submissions: number;
    totalStudents: number;
    status: string;
    type: string;
    description: string;
}

const stats = [
    {
        label: "Active Assignments",
        value: "3",
        icon: FileText,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
    },
    {
        label: "Submissions Today",
        value: "12",
        icon: Users,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
    },
    {
        label: "Pending Review",
        value: "5",
        icon: AlertCircle,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
    },
]

export default function TeacherAssignmentsPage() {
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

    const [updateTeacherAssignment, { isLoading: isUpdating }] = useUpdateTeacherAssignmentMutation();

    const { data: assignmentsData, isLoading } = useGetSpecificTeacherAssignmentsQuery({});
    const fetchedAssignments = assignmentsData?.data?.data || [];

    const assignments: Assignment[] = fetchedAssignments.map((a: any) => ({
        id: a.id,
        title: a.assignmentTitle,
        class: a.classDistributions?.classLevel || "N/A",
        dueDate: a.assignmentDueDate,
        submissions: 0,
        totalStudents: 100,
        status: new Date(a.assignmentDueDate) < new Date() ? "completed" : "active",
        type: a.assignmentType,
        description: a.description
    }));

    const filteredAssignments = filter === "all"
        ? assignments
        : assignments.filter(a => a.status === filter)

    const handleUpdateAssignment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedAssignment) return;

        const formData = new FormData(e.currentTarget);
        const data = {
            assignmentTitle: formData.get("editTitle"),
            assignmentType: formData.get("editType"),
            assignmentDueDate: formData.get("editDueDate") ? new Date(formData.get("editDueDate") as string).toISOString() : undefined,
            description: formData.get("editDescription"),
        };

        try {
            await updateTeacherAssignment({ id: selectedAssignment.id, data }).unwrap();
            toast.success("Assignment updated successfully");
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error("Failed to update assignment");
        }
    }

    const handleEdit = (assignment: Assignment) => {
        setSelectedAssignment(assignment)
        setIsEditModalOpen(true)
    }

    const handleView = (assignment: Assignment) => {
        setSelectedAssignment(assignment)
        setIsViewModalOpen(true)
    }

    if (isLoading) {
        return <div className="p-6 text-center text-lg font-medium text-emerald-600">Loading assignments...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-emerald-500 p-6 text-white shadow-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Assignments</h1>
                        <p className="mt-1 text-emerald-50 opacity-90">Create and manage homework and assignments</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <div key={index} className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                            <div className={`rounded-lg p-3 ${stat.bg}`}>
                                <Icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Main Content */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
                        {(["all", "active", "completed"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${filter === tab
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-900"
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    <Button className="bg-emerald-500 text-white" onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="mr-1 h-4 w-4" />
                        Create Assignment
                    </Button>
                </div>

                <div className="grid gap-4">
                    {filteredAssignments.map((assignment) => {
                        const submissionRate = (assignment.submissions / assignment.totalStudents) * 100

                        return (
                            <div
                                key={assignment.id}
                                className="group rounded-xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:bg-white hover:shadow-md"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
                                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${assignment.status === "active"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-blue-100 text-blue-700"
                                                    }`}>
                                                    {assignment.status === "active" ? "Active" : "Completed"}
                                                </span>
                                                <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                                    {assignment.type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">{assignment.class}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-gray-400" />
                                                <span>{assignment.submissions}/{assignment.totalStudents} Submitted</span>
                                            </div>
                                        </div>

                                        <div className="max-w-md">
                                            <div className="mb-1 flex justify-between text-xs">
                                                <span className="font-medium text-gray-600">Submission Progress</span>
                                                <span className="font-bold text-gray-900">{submissionRate.toFixed(0)}%</span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full bg-emerald-500 transition-all duration-500"
                                                    style={{ width: `${submissionRate}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" className="bg-white" onClick={() => handleEdit(assignment)}>
                                            Edit
                                        </Button>
                                        <Button className="bg-emerald-500" onClick={() => handleView(assignment)}>
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Create Assignment Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create New Assignment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Assignment Title</Label>
                            <Input id="title" placeholder="e.g., Algebra Homework - Chapter 5" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="class">Class</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select class" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="grade9a">Grade 9-A</SelectItem>
                                        <SelectItem value="grade10a">Grade 10-A</SelectItem>
                                        <SelectItem value="grade11a">Grade 11-A</SelectItem>
                                        <SelectItem value="grade11b">Grade 11-B</SelectItem>
                                        <SelectItem value="grade12a">Grade 12-A</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="homework">Homework</SelectItem>
                                        <SelectItem value="practice">Practice</SelectItem>
                                        <SelectItem value="project">Project</SelectItem>
                                        <SelectItem value="quizprep">Quiz Prep</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input id="dueDate" type="date" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Enter assignment description and instructions..." rows={4} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="attachments">Attachments (Optional)</Label>
                            <Input id="attachments" type="file" multiple />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">Create Assignment</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Assignment Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Assignment</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateAssignment}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="editTitle">Assignment Title</Label>
                                <Input id="editTitle" name="editTitle" defaultValue={selectedAssignment?.title} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="editClass">Class</Label>
                                    <Select defaultValue={selectedAssignment?.class} name="editClass">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Grade 9-A">Grade 9-A</SelectItem>
                                            <SelectItem value="Grade 10-A">Grade 10-A</SelectItem>
                                            <SelectItem value="Grade 11-A">Grade 11-A</SelectItem>
                                            <SelectItem value="Grade 11-B">Grade 11-B</SelectItem>
                                            <SelectItem value="Grade 12-A">Grade 12-A</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="editType">Type</Label>
                                    <Select defaultValue={selectedAssignment?.type} name="editType">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Homework">Homework</SelectItem>
                                            <SelectItem value="Practice">Practice</SelectItem>
                                            <SelectItem value="Project">Project</SelectItem>
                                            <SelectItem value="Quiz Prep">Quiz Prep</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editDueDate">Due Date</Label>
                                <Input id="editDueDate" name="editDueDate" type="date" defaultValue={selectedAssignment?.dueDate ? new Date(selectedAssignment.dueDate).toISOString().split('T')[0] : ''} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="editDescription">Description</Label>
                                <Textarea id="editDescription" name="editDescription" defaultValue={selectedAssignment?.description} rows={4} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isUpdating}>
                                {isUpdating ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Assignment Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Assignment Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="rounded-lg bg-gray-50 p-4 space-y-3">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{selectedAssignment?.title}</h3>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${selectedAssignment?.status === "active"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-blue-100 text-blue-700"
                                        }`}>
                                        {selectedAssignment?.status === "active" ? "Active" : "Completed"}
                                    </span>
                                    <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                        {selectedAssignment?.type}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Class:</span>
                                    <span className="ml-2 text-gray-900">{selectedAssignment?.class}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Due Date:</span>
                                    <span className="ml-2 text-gray-900">{selectedAssignment?.dueDate && new Date(selectedAssignment.dueDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="text-sm">
                                <span className="font-medium text-gray-700">Description:</span>
                                <p className="mt-1 text-gray-900">{selectedAssignment?.description}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-gray-900">Submission Statistics</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-center">
                                    <p className="text-2xl font-bold text-emerald-700">{selectedAssignment?.submissions}</p>
                                    <p className="text-xs text-emerald-600">Submitted</p>
                                </div>
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center">
                                    <p className="text-2xl font-bold text-amber-700">{selectedAssignment && (selectedAssignment.totalStudents - selectedAssignment.submissions)}</p>
                                    <p className="text-xs text-amber-600">Pending</p>
                                </div>
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-center">
                                    <p className="text-2xl font-bold text-blue-700">{selectedAssignment?.totalStudents}</p>
                                    <p className="text-xs text-blue-600">Total Students</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-gray-900">Recent Submissions</h3>
                            <div className="space-y-2">
                                {[1, 2, 3].map((student) => (
                                    <div key={student} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                                        <div>
                                            <p className="font-medium text-gray-900">Student {student}</p>
                                            <p className="text-xs text-gray-500">Submitted 2 hours ago</p>
                                        </div>
                                        <Button size="sm" variant="outline">Review</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">View All Submissions</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
