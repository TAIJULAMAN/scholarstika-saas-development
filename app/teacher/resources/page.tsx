"use client"

import { useState, useEffect } from "react"
import { FileText, Play, Link as LinkIcon, Download, Eye, Pencil, Trash2, Plus, File } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { useGetTeacherScheduleQuery } from "@/redux/features/teacher/teacherApi"
import { useGetSpecificTeacherClassMaterialQuery, useDeleteClassMaterialsMutation, useCreateClassMaterialsMutation, useUpdateSpecificClassMaterialMutation } from "@/redux/features/assignments/assignmentsApi"
import { toast } from "sonner"

const stats = [
    {
        label: "PDF Documents",
        value: "24",
        icon: FileText,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        border: "border-emerald-100"
    },
    {
        label: "Word Documents",
        value: "12",
        icon: File,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        border: "border-emerald-100"
    },
    {
        label: "Video Files",
        value: "8",
        icon: Play,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        border: "border-emerald-100"
    },
    {
        label: "External Links",
        value: "15",
        icon: LinkIcon,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        border: "border-emerald-100"
    },
]

export default function TeacherResourcesPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedMaterial, setSelectedMaterial] = useState<any>(null)

    // API calls
    const [createMaterial, { isLoading: isCreating }] = useCreateClassMaterialsMutation();
    const [updateMaterial, { isLoading: isUpdating }] = useUpdateSpecificClassMaterialMutation();
    const [deleteMaterial, { isLoading: isDeleting }] = useDeleteClassMaterialsMutation();

    const [editForm, setEditForm] = useState({
        materialName: "",
        materialType: "pdf",
        description: "",
        external_link: "",
    });
    const [editFile, setEditFile] = useState<File | null>(null);
    const { data: classesResponse, isLoading: isClassesLoading } = useGetTeacherScheduleQuery({});

    const [createForm, setCreateForm] = useState({
        materialName: "",
        classDistributionId: "",
        materialType: "pdf",
        description: "",
        external_link: "",
    });
    const [createFile, setCreateFile] = useState<File | null>(null);

    const handleCreateMaterial = async () => {
        try {
            if (!createForm.materialName) {
                alert("Please provide a material name.");
                return;
            }
            if (!createForm.classDistributionId) {
                alert("Please select a class for the material.");
                return;
            }
            if (!createForm.description) {
                alert("Please provide a description.");
                return;
            }

            const dataObj = {
                assignmentTitle: createForm.materialName,
                classDistributionId: createForm.classDistributionId,
                materialType: createForm.materialType,
                description: createForm.description,
                external_link: createForm.external_link,
                materialFiles: [],
            };

            const formData = new FormData();
            formData.append("data", JSON.stringify(dataObj));
            if (createFile) {
                formData.append("materialFiles", createFile);
            } else if (createForm.materialType !== "link") {
                alert("Please select an attachment! The backend strictly requires 'materialFiles' to be present.");
                return;
            }

            await createMaterial(formData).unwrap();
            setIsAddModalOpen(false);
            setCreateForm({
                materialName: "",
                classDistributionId: selectedClassId || "",
                materialType: "pdf",
                description: "",
                external_link: "",
            });
            setCreateFile(null);
            toast.success("Material added successfully");
        } catch (error: any) {
            console.error("Failed to create material:", error);
            const errorMessage = error?.data?.errorMessages?.[0]?.message || 
                                 error?.data?.message || 
                                 "Failed to add material. Please try again.";
            alert(`Error: ${errorMessage}`);
        }
    };
    const classesList = classesResponse?.data?.data || [];

    const [selectedClassId, setSelectedClassId] = useState<string>("");

    // Set first class as default selected
    useEffect(() => {
        if (classesList.length > 0 && !selectedClassId) {
            setSelectedClassId(classesList[0].id);
        }
    }, [classesList, selectedClassId]);

    const { data: materialsResponse, isLoading: isMaterialsLoading } = useGetSpecificTeacherClassMaterialQuery(selectedClassId, {
        skip: !selectedClassId
    });
    const rawMaterialsList = materialsResponse?.data?.data || [];

    // Helper to determine material type UI config
    const getMaterialTypeConfig = (type: string) => {
        const t = (type || '').toLowerCase();
        if (t === 'pdf') return { type: 'PDF', icon: FileText, iconColor: "text-red-600", bgColor: "bg-red-50", typeBadge: "bg-red-100 text-red-700" };
        if (t === 'docx' || t === 'doc') return { type: 'DOCX', icon: FileText, iconColor: "text-blue-600", bgColor: "bg-blue-50", typeBadge: "bg-blue-100 text-blue-700" };
        if (t === 'mp4' || t === 'video') return { type: 'Video', icon: Play, iconColor: "text-purple-600", bgColor: "bg-purple-50", typeBadge: "bg-purple-100 text-purple-700" };
        if (t === 'link' || t === 'external_link') return { type: 'Link', icon: LinkIcon, iconColor: "text-emerald-600", bgColor: "bg-emerald-50", typeBadge: "bg-emerald-100 text-emerald-700" };
        return { type: t.toUpperCase() || 'FILE', icon: File, iconColor: "text-gray-600", bgColor: "bg-gray-50", typeBadge: "bg-gray-100 text-gray-700" };
    }

    const materials = rawMaterialsList.map((m: any, index: number) => {
        const config = getMaterialTypeConfig(m.materialType);
        return {
            id: m.id,
            name: m.assignmentTitle || m.description || `Material #${index + 1}`,
            originalType: m.materialType,
            type: config.type,
            uploaded: m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'N/A',
            size: m.materialFiles?.length > 0 ? "File Attached" : "-",
            icon: config.icon,
            iconColor: config.iconColor,
            bgColor: config.bgColor,
            typeBadge: config.typeBadge,
            description: m.description || 'No description available',
            external_link: m.external_link,
            materialFiles: m.materialFiles,
        };
    });

    const handleView = (material: any) => {
        setSelectedMaterial(material)
        setIsViewModalOpen(true)
    }

    const handleEdit = (material: any) => {
        setSelectedMaterial(material);
        setEditForm({
            materialName: material.name.startsWith('Material #') ? "" : material.name,
            materialType: material.originalType || "pdf",
            description: material.description || "",
            external_link: material.external_link || "",
        });
        setEditFile(null);
        setIsEditModalOpen(true);
    };

    const handleUpdateMaterial = async () => {
        if (!selectedMaterial?.id) return;
        try {
            if (!editForm.materialName) {
                alert("Please provide a material name.");
                return;
            }

            const dataObj: any = {
                assignmentTitle: editForm.materialName,
                materialType: editForm.materialType,
                description: editForm.description,
                external_link: editForm.external_link,
            };

            const formData = new FormData();
            formData.append("data", JSON.stringify(dataObj));
            if (editFile) {
                formData.append("materialFiles", editFile);
            }

            await updateMaterial({ id: selectedMaterial.id, data: formData }).unwrap();
            setIsEditModalOpen(false);
            setEditFile(null);
            toast.success("Material updated successfully");
        } catch (error: any) {
            console.error("Failed to update material:", error);
            const errorMessage = error?.data?.errorMessages?.[0]?.message || 
                                 error?.data?.message || 
                                 "Failed to update material. Please try again.";
            alert(`Error: ${errorMessage}`);
        }
    };

    const handleDelete = (material: any) => {
        setSelectedMaterial(material)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!selectedMaterial?.id) return

        try {
            const res = await deleteMaterial(selectedMaterial.id).unwrap()
            if (res?.success) {
                toast.success(res?.message || "Material deleted successfully")
                setIsDeleteModalOpen(false)
                setSelectedMaterial(null)
            } else {
                toast.error(res?.message || "Failed to delete material")
            }
        } catch (error: any) {
            toast.error(error?.data?.message || error?.message || "Failed to delete material")
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-emerald-500 p-6 text-white shadow-lg">
                <h1 className="text-2xl font-bold">Materials Management</h1>
                <p className="mt-1 text-emerald-50 opacity-90">Manage and organize course materials, documents, and resources</p>
            </div>

            {/* Selection Controls */}
            <div className="grid gap-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:grid-cols-2">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
                    {isClassesLoading ? (
                        <div className="h-10 w-full animate-pulse rounded-md bg-gray-100"></div>
                    ) : (
                        <Select
                            value={selectedClassId}
                            onValueChange={setSelectedClassId}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classesList.map((cls: any) => (
                                    <SelectItem key={cls.id} value={cls.id}>
                                        {cls.classLevel} - {cls.assignableSubject} ({cls.roomNumber})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

            {/* Materials Table */}
            <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900">Course Materials</h2>
                    <Button className="bg-emerald-500" onClick={() => {
                        setCreateForm(prev => ({ ...prev, classDistributionId: selectedClassId }));
                        setIsAddModalOpen(true);
                    }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Material
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }}>
                            <tr>
                                <th className="whitespace-nowrap rounded-tl-lg pb-3 pl-6 pt-3 text-left text-sm font-semibold text-white">Material Name</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white">Type</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white">Date Uploaded</th>
                                <th className="whitespace-nowrap pb-3 pt-3 text-left text-sm font-semibold text-white">Size</th>
                                <th className="whitespace-nowrap rounded-tr-lg pb-3 pr-6 pt-3 text-right text-sm font-semibold text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isMaterialsLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                        Loading materials...
                                    </td>
                                </tr>
                            ) : materials.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                                        No materials found for this class.
                                    </td>
                                </tr>
                            ) : (
                                materials.map((material: any) => (
                                    <tr key={material.id} className="group transition-colors hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 line-clamp-1 max-w-[300px]" title={material.name}>
                                                {material.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`rounded p-1 ${material.bgColor}`}>
                                                    <material.icon className={`h-4 w-4 ${material.iconColor}`} />
                                                </div>
                                                <span className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${material.typeBadge}`}>
                                                    {material.type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{material.uploaded}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{material.size}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleView(material)}
                                                    className="rounded p-2 text-blue-500 hover:bg-blue-50"
                                                    title="View"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(material)}
                                                    className="rounded p-2 text-emerald-600 hover:bg-emerald-50"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(material)}
                                                    className="rounded p-2 text-red-500 hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Material Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add New Material</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="materialName">Material Name</Label>
                            <Input 
                                id="materialName" 
                                placeholder="e.g., Introduction to Algorithms" 
                                value={createForm.materialName}
                                onChange={(e) => setCreateForm({ ...createForm, materialName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Select Class</Label>
                            <Select 
                                value={createForm.classDistributionId}
                                onValueChange={(val) => setCreateForm({ ...createForm, classDistributionId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classesList.map((c: any) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.classLevel} - {c.assignableSubject}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="materialType">Material Type</Label>
                                <Select 
                                    value={createForm.materialType}
                                    onValueChange={(val) => setCreateForm({ ...createForm, materialType: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pdf">PDF Document</SelectItem>
                                        <SelectItem value="docx">Word Document</SelectItem>
                                        <SelectItem value="video">Video File</SelectItem>
                                        <SelectItem value="link">External Link</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                                id="description" 
                                placeholder="Enter material description..." 
                                rows={3} 
                                value={createForm.description}
                                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                            />
                        </div>
                        {createForm.materialType === "link" ? (
                            <div className="space-y-2">
                                <Label htmlFor="externalLink">External Link</Label>
                                <Input 
                                    id="externalLink" 
                                    placeholder="https://..." 
                                    value={createForm.external_link}
                                    onChange={(e) => setCreateForm({ ...createForm, external_link: e.target.value })}
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="fileUpload">Upload File</Label>
                                <Input 
                                    id="fileUpload" 
                                    type="file" 
                                    onChange={(e) => setCreateFile(e.target.files?.[0] || null)}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button 
                            className="bg-emerald-600 hover:bg-emerald-700" 
                            onClick={handleCreateMaterial}
                            disabled={isCreating}
                        >
                            {isCreating ? "Adding..." : "Add Material"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Material Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Material Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="rounded-lg bg-gray-50 p-4 space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900">{selectedMaterial?.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{selectedMaterial?.description}</p>
                                    {selectedMaterial?.external_link && (
                                        <a href={selectedMaterial.external_link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline mt-2 block">
                                            {selectedMaterial.external_link}
                                        </a>
                                    )}
                                </div>
                                {selectedMaterial && (
                                    <div className={`rounded p-2 ${selectedMaterial.bgColor}`}>
                                        <selectedMaterial.icon className={`h-6 w-6 ${selectedMaterial.iconColor}`} />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-700">Type:</span>
                                    <span className={`ml-2 rounded px-2 py-0.5 text-xs font-semibold uppercase ${selectedMaterial?.typeBadge}`}>
                                        {selectedMaterial?.type}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Size:</span>
                                    <span className="ml-2 text-gray-900">{selectedMaterial?.size}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-700">Uploaded:</span>
                                    <span className="ml-2 text-gray-900">{selectedMaterial?.uploaded}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>
                        {selectedMaterial?.materialFiles && selectedMaterial.materialFiles.length > 0 && (
                            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => window.open(selectedMaterial.materialFiles[0], '_blank')}>
                                <Download className="mr-2 h-4 w-4" />
                                Download File
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Material Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Material</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="editMaterialName">Material Name</Label>
                            <Input 
                                id="editMaterialName" 
                                value={editForm.materialName} 
                                onChange={(e) => setEditForm({ ...editForm, materialName: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="editMaterialType">Material Type</Label>
                                <Select 
                                    value={editForm.materialType}
                                    onValueChange={(val) => setEditForm({ ...editForm, materialType: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pdf">PDF Document</SelectItem>
                                        <SelectItem value="docx">Word Document</SelectItem>
                                        <SelectItem value="video">Video File</SelectItem>
                                        <SelectItem value="link">External Link</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editDescription">Description</Label>
                            <Textarea 
                                id="editDescription" 
                                value={editForm.description} 
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                rows={3} 
                            />
                        </div>
                        {editForm.materialType === "link" ? (
                            <div className="space-y-2">
                                <Label htmlFor="editExternalLink">External Link</Label>
                                <Input 
                                    id="editExternalLink" 
                                    placeholder="https://..." 
                                    value={editForm.external_link}
                                    onChange={(e) => setEditForm({ ...editForm, external_link: e.target.value })}
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="editFileUpload">Replace File (Optional)</Label>
                                <Input 
                                    id="editFileUpload" 
                                    type="file" 
                                    onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                        <Button 
                            className="bg-emerald-600 hover:bg-emerald-700" 
                            onClick={handleUpdateMaterial}
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Material</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this material? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                            <p className="font-semibold text-gray-900">{selectedMaterial?.name}</p>
                            <p className="text-sm text-gray-600 mt-1">Type: {selectedMaterial?.type} • Size: {selectedMaterial?.size}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>Cancel</Button>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={handleConfirmDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete Material"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
