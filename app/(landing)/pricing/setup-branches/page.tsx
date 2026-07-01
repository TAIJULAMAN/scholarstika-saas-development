"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Plus, Trash2, Building2, Calculator, ChevronLeft, Globe, Users } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { calculateAnnualPrice, LocationType, DevelopmentCategory, getStudentBand } from "@/lib/pricing"
import { cn } from "@/lib/utils"

interface Branch {
    id: string;
    name: string;
    location: LocationType;
    students: number;
    state: string;
    city: string;
}

function SetupBranchesForm() {
    const searchParams = useSearchParams()
    const [devCategory, setDevCategory] = useState<DevelopmentCategory>("DEVELOPED")
    const [countryName, setCountryName] = useState("United States")
    const [userRole, setUserRole] = useState<string | null>(null)
    const [branches, setBranches] = useState<Branch[]>([])

    useEffect(() => {
        const savedUser = localStorage.getItem("scholarstika_user") || localStorage.getItem("registeredUser")
        let userData: any = null
        if (savedUser) {
            userData = JSON.parse(savedUser)
            setUserRole(userData.role || null)
            setCountryName(userData.country || "United States")
        }

        // 1. Get values from URL or defaults
        const urlStudents = Number(searchParams.get("students")) || 250
        const urlBranches = Number(searchParams.get("branches")) || 1
        const urlDev = searchParams.get("dev") as DevelopmentCategory
        const urlLoc = searchParams.get("loc") as LocationType

        if (urlDev) setDevCategory(urlDev)

        // 2. Initialize branches based on total
        const initialBranches: Branch[] = []
        for (let i = 0; i < urlBranches; i++) {
            // Distribute students evenly across branches to keep total sum correct
            const baseCount = Math.floor(urlStudents / urlBranches)
            const branchStudents = i === 0 ? baseCount + (urlStudents % urlBranches) : baseCount
            
            initialBranches.push({
                id: i === 0 ? "1" : Math.random().toString(36).substr(2, 9),
                name: i === 0 ? "Main Campus" : `Branch ${i + 1}`,
                location: i === 0 && urlLoc ? urlLoc : "URBAN",
                students: branchStudents,
                state: i === 0 ? (userData?.state || "") : "",
                city: i === 0 ? (userData?.city || "") : "",
            })
        }
        setBranches(initialBranches)

        // 3. Auto-detection for Dev Category if not passed in URL
        if (!urlDev && userData) {
            const lowDevCountries = ["bangladesh", "nigeria", "india", "kenya"]
            if (lowDevCountries.some(c => userData.country?.toLowerCase().includes(c))) {
                setDevCategory("DEVELOPING")
            }
        }
    }, [searchParams])

    const isRestricted = userRole === "branch_manager"

    const addBranch = () => {
        if (isRestricted) return;
        setBranches([...branches, {
            id: Math.random().toString(36).substr(2, 9),
            name: "",
            location: "URBAN",
            students: 100,
            state: branches[0]?.state || "",
            city: branches[0]?.city || ""
        }])
    }

    const removeBranch = (id: string) => {
        if (isRestricted) return;
        if (branches.length > 1) {
            setBranches(branches.filter(b => b.id !== id))
        }
    }

    const updateBranch = (id: string, updates: Partial<Branch>) => {
        setBranches(branches.map(b => b.id === id ? { ...b, ...updates } : b))
    }

    const pricingResult = useMemo(() => {
        const totalStudents = branches.reduce((sum, b) => sum + b.students, 0)
        // We use the Main Campus (first branch) for the location modifier
        const mainLocation = branches[0]?.location || "URBAN"
        return calculateAnnualPrice(totalStudents, devCategory, mainLocation, branches.length)
    }, [devCategory, branches])

    const { finalPrice, mainSchoolPrice, extraBranchCharge, basePrice } = pricingResult

    const studentBand = useMemo(() => {
        const totalStudents = branches.reduce((sum, b) => sum + b.students, 0)
        return getStudentBand(totalStudents)
    }, [branches])

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/pricing">
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-emerald-600">
                                <ChevronLeft className="h-5 w-5 mr-1" />
                                Back
                            </Button>
                        </Link>
                        <div className="h-6 w-[1px] bg-slate-200 mx-2" />
                        <div>
                            <h1 className="text-lg font-bold text-slate-800">Branch Configuration</h1>
                            <p className="text-xs text-slate-500 flex items-center gap-2">
                                <Globe className="h-3 w-3 text-emerald-600" />
                                <span className="font-semibold">{countryName}</span>
                                <span className="text-slate-300">|</span>
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded text-[10px] uppercase font-black",
                                    devCategory === "DEVELOPED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                )}>
                                    {devCategory}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Population</span>
                            <span className="text-sm font-bold text-slate-600">{branches.reduce((sum, b) => sum + b.students, 0)} Students</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Total Annual</p>
                            <p className="text-2xl font-black text-[#007b5e] leading-none">${finalPrice}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-5 pt-10">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Branch List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-emerald-600" />
                                    School Branches
                                </h2>
                            </div>
                            {!isRestricted && (
                                <Button
                                    onClick={addBranch}
                                    variant="outline"
                                    size="sm"
                                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold"
                                >
                                    <Plus className="h-4 w-4 mr-1.5" />
                                    Add Branch
                                </Button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {branches.map((branch, index) => (
                                <Card key={branch.id} className="border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                                    <div className="flex h-full">
                                        <div className="w-2 bg-emerald-500" />
                                        <CardContent className="p-6 flex-1">
                                            <div className="grid gap-6 md:grid-cols-3 items-end">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Branch Name</Label>
                                                    <Input
                                                        placeholder="e.g. Westside Campus"
                                                        value={branch.name}
                                                        onChange={(e) => updateBranch(branch.id, { name: e.target.value })}
                                                        className="h-11 bg-slate-50 border-slate-200"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Location Context</Label>
                                                    <Select
                                                        value={branch.location}
                                                        onValueChange={(val) => updateBranch(branch.id, { location: val as LocationType })}
                                                    >
                                                        <SelectTrigger className="h-11 bg-slate-50 border-slate-200">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="URBAN">Urban (City / Town)</SelectItem>
                                                            <SelectItem value="RURAL">Rural (Countryside)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex items-center gap-3 md:col-span-1">
                                                    <div className="space-y-2 flex-1">
                                                        <Label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Students</Label>
                                                        <div className="relative">
                                                            <Input
                                                                type="number"
                                                                value={branch.students}
                                                                onChange={(e) => updateBranch(branch.id, { students: Math.max(1, Number(e.target.value)) })}
                                                                className="h-11 bg-slate-50 border-slate-200 pl-8"
                                                            />
                                                            <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                        </div>
                                                    </div>
                                                    {!isRestricted && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-11 w-11 text-slate-300 hover:text-red-500 hover:bg-red-50"
                                                            onClick={() => removeBranch(branch.id)}
                                                            disabled={branches.length === 1}
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Detailed Location Row */}
                                            <div className="grid gap-4 md:grid-cols-2 mt-6 pt-6 border-t border-slate-100">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-slate-400 uppercase">State / region / province</Label>
                                                    <Input
                                                        placeholder="State"
                                                        value={branch.state}
                                                        onChange={(e) => updateBranch(branch.id, { state: e.target.value })}
                                                        className="h-10 bg-white border-slate-200"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold text-slate-400 uppercase">City / Town / Village</Label>
                                                    <Input
                                                        placeholder="City"
                                                        value={branch.city}
                                                        onChange={(e) => updateBranch(branch.id, { city: e.target.value })}
                                                        className="h-10 bg-white border-slate-200"
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-slate-900 text-white shadow-2xl border-none overflow-hidden sticky top-24">
                            <div className="bg-[#007b5e] px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calculator className="h-5 w-5 text-emerald-400" />
                                    <h3 className="font-bold">Subscription Summary</h3>
                                </div>
                                <button 
                                    onClick={() => setDevCategory(prev => prev === "DEVELOPED" ? "DEVELOPING" : "DEVELOPED")}
                                    className="text-[9px] font-black uppercase tracking-tighter bg-white/10 px-2 py-1 rounded border border-white/20 hover:bg-white/20 transition-colors"
                                >
                                    Switch: {devCategory === "DEVELOPED" ? "Developing" : "Developed"}
                                </button>
                            </div>
                            <CardContent className="p-8 space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Total Branches</span>
                                        <span className="font-bold">{branches.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Total Students</span>
                                        <span className="font-bold">{branches.reduce((sum, b) => sum + b.students, 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Student Band</span>
                                        <span className="font-bold text-emerald-400 uppercase tracking-tighter">{studentBand}</span>
                                    </div>
                                    
                                    <div className="h-[1px] bg-slate-800" />
                                    
                                    <div className="space-y-3 pt-2">
                                        <div className="flex justify-between text-[11px]">
                                            <div className="flex flex-col">
                                                <span className="text-slate-500">Base Price</span>
                                                <span className="text-[9px] text-slate-600">For {studentBand} students</span>
                                            </div>
                                            <span className="font-mono">${basePrice}</span>
                                        </div>
                                        <div className="flex justify-between text-[11px]">
                                            <div className="flex flex-col">
                                                <span className="text-slate-500">Main School Price</span>
                                                <span className="text-[9px] text-slate-600">{devCategory} &bull; {branches[0]?.location}</span>
                                            </div>
                                            <span className="font-mono">${mainSchoolPrice}</span>
                                        </div>
                                        {extraBranchCharge > 0 && (
                                            <div className="flex justify-between text-[11px] text-amber-400 font-medium">
                                                <div className="flex flex-col">
                                                    <span>Extra Branches</span>
                                                    <span className="text-[9px] opacity-70">+{branches.length - 1} campuses &times; 25%</span>
                                                </div>
                                                <span className="font-mono">+${extraBranchCharge}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-6 flex flex-col items-center border-t border-slate-800">
                                        <p className="text-[10px] font-bold uppercase text-emerald-400 tracking-widest mb-1">Total Annual Price</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl font-black">${finalPrice}</span>
                                            <span className="text-slate-400 text-lg">/yr</span>
                                        </div>
                                        <p className="mt-2 text-slate-500 text-[10px]">
                                            Billed annually in USD • Locked for 12 mos
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                        <h4 className="text-[10px] font-bold text-slate-300 uppercase mb-3 flex items-center gap-1 tracking-widest">
                                            <MapPin className="h-3 w-3 text-emerald-400" />
                                            Billing Details
                                        </h4>
                                        <ul className="space-y-2 text-[10px] text-slate-400 leading-relaxed">
                                            <li>• Region: <span className="text-white font-medium">{countryName}</span></li>
                                            <li>• Main Campus Context: <span className="text-white font-medium uppercase">{branches[0]?.location}</span></li>
                                            <li>• Branch Strategy: <span className="text-white font-medium">+25% for extra campuses</span></li>
                                        </ul>
                                    </div>
                                    <Button className="w-full bg-[#007b5e] hover:bg-[#006b52] text-white font-black h-14 text-lg rounded-xl shadow-xl transition-all">
                                        Proceed to Payment
                                    </Button>
                                    <p className="text-[9px] text-center text-slate-500 uppercase tracking-widest font-bold">
                                        Secure encypted transaction
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function SetupBranchesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
            </div>
        }>
            <SetupBranchesForm />
        </Suspense>
    )
}
