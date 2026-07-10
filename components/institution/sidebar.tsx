"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
    LayoutDashboard,
    Megaphone,
    DollarSign,
    Users,
    GraduationCap,
    MessageSquare,
    Wallet,
    UserCog,
    BookOpen,
    Library,
    Calendar,
    ArrowRightLeft,
    ChevronDown,
    CreditCard,
    Receipt,
    FileText,
    ClipboardList,
    Monitor,
    FileEdit,
    Banknote,
    Settings2,
    HelpCircle,
    Building2,
    Handshake,
    LogOut,
} from "lucide-react"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/institution/dashboard" },
    { icon: Building2, label: "Branch Management", href: "/institution/branch-management" },
    { icon: Megaphone, label: "Announcements", href: "/institution/announcements" },
    { icon: DollarSign, label: "Earnings", href: "/institution/earnings" },
    { icon: Users, label: "Students", href: "/institution/students" },
    { icon: GraduationCap, label: "Teachers", href: "/institution/teachers" },
    { icon: MessageSquare, label: "Messages", href: "/institution/messages" },
    { icon: HelpCircle, label: "Support", href: "/institution/support" },
    { icon: UserCog, label: "Admin Management", href: "/institution/staff-management" },
]

const academicsMenuItems = [
    { icon: BookOpen, label: "Sections & Classes", href: "/institution/academics/sections" },
    { icon: Library, label: "Subjects", href: "/institution/academics/subjects" },
    { icon: Calendar, label: "Class Schedule", href: "/institution/academics/schedule" },
    { icon: Monitor, label: "Online Exams", href: "/institution/exams/online" },
    { icon: FileEdit, label: "Offline Exams", href: "/institution/exams/offline" },
    { icon: ClipboardList, label: "Exam Results", href: "/institution/exams/results" },
    { icon: ArrowRightLeft, label: "Transfer/Promotion", href: "/institution/academics/transfer-promotion" },
]

const feesMenuItems = [
    { icon: CreditCard, label: "Student Fees", href: "/institution/fees/student-fees" },
    { icon: Receipt, label: "Transaction Logs", href: "/institution/fees/transactions" },
    { icon: FileText, label: "Optional Fees", href: "/institution/fees/optional-fees" },
]


const payrollMenuItems = [
    { icon: Banknote, label: "Manage Payroll", href: "/institution/payroll/manage" },
    { icon: Settings2, label: "Payroll Settings", href: "/institution/payroll/settings" },
]

export function SidebarContent() {
    const pathname = usePathname()
    const [isAcademicsOpen, setIsAcademicsOpen] = useState(
        pathname.startsWith("/institution/academics") || pathname.startsWith("/institution/exams")
    )
    const [isFeesOpen, setIsFeesOpen] = useState(
        pathname.startsWith("/institution/fees")
    )
    const [isExpensesOpen, setIsExpensesOpen] = useState(
        pathname.startsWith("/institution/payroll") || pathname.startsWith("/institution/reports/expenses")
    )
    const [isPayrollSubOpen, setIsPayrollSubOpen] = useState(
        pathname.startsWith("/institution/payroll")
    )
    const [isCertificatesOpen, setIsCertificatesOpen] = useState(
        pathname.startsWith("/institution/certificates")
    )
    const { logout } = useUser()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push("/auth/signin")
    }

    return (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Scholastika Logo"
                        width={120}
                        height={40}
                        className="h-8 w-auto"
                    />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                                ? "bg-emerald-50 text-emerald-600"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    )
                })}

                {/* Academics Collapsible Menu */}
                <div className="space-y-1">
                    <button
                        onClick={() => setIsAcademicsOpen(!isAcademicsOpen)}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith("/institution/academics") || pathname.startsWith("/institution/exams")
                            ? "bg-emerald-50 text-emerald-600"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <GraduationCap className="h-5 w-5" />
                            <span>Academics</span>
                        </div>
                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${isAcademicsOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {isAcademicsOpen && (
                        <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-2">
                            {academicsMenuItems.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Fees Management Collapsible Menu */}
                <div className="space-y-1">
                    <button
                        onClick={() => setIsFeesOpen(!isFeesOpen)}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith("/institution/fees")
                            ? "bg-emerald-50 text-emerald-600"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Wallet className="h-5 w-5" />
                            <span>Fees Management</span>
                        </div>
                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${isFeesOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {isFeesOpen && (
                        <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-2">
                            {feesMenuItems.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Expenses Collapsible Menu */}
                <div className="space-y-1">
                    <button
                        onClick={() => setIsExpensesOpen(!isExpensesOpen)}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${pathname.startsWith("/institution/payroll") || pathname.startsWith("/institution/reports/expenses")
                            ? "bg-emerald-50 text-emerald-600"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Banknote className="h-5 w-5" />
                            <span>Expenses</span>
                        </div>
                        <ChevronDown
                            className={`h-4 w-4 transition-transform ${isExpensesOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {isExpensesOpen && (
                        <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-2">
                            {/* Payroll Submenu */}
                            <div className="space-y-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsPayrollSubOpen(!isPayrollSubOpen)
                                    }}
                                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <Wallet className="h-4 w-4" />
                                        <span>Payroll</span>
                                    </div>
                                    <ChevronDown
                                        className={`h-3 w-3 transition-transform ${isPayrollSubOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {isPayrollSubOpen && (
                                    <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-2">
                                        {payrollMenuItems.map((item) => {
                                            const Icon = item.icon
                                            const isActive = pathname === item.href

                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                        }`}
                                                >
                                                    <Icon className="h-4 w-4" />
                                                    {item.label}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Other Expenses Link */}
                            <Link
                                href="/institution/reports/expenses"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${pathname === "/institution/reports/expenses"
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    }`}
                            >
                                <Receipt className="h-4 w-4" />
                                <span>Other Expenses</span>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            <div className="border-t p-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    )
}

export function InstitutionSidebar() {
    return (
        <aside className="hidden w-64 border-r bg-white md:flex flex-col">
            <SidebarContent />
        </aside>
    )
}
