"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Link as LinkIcon,
    DollarSign,
    Image as ImageIcon,
    LogOut,
    Compass
} from "lucide-react"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/affiliate/dashboard" },
    { icon: Compass, label: "Onboarding", href: "/affiliate/onboarding" },
    { icon: LinkIcon, label: "Referral Links", href: "/affiliate/links" },
    { icon: DollarSign, label: "Payouts", href: "/affiliate/payouts" },
    { icon: ImageIcon, label: "Marketing Assets", href: "/affiliate/assets" },
]

export function SidebarContent() {
    const pathname = usePathname()
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
                        alt="Scholarstika Logo"
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

export function AffiliateSidebar() {
    return (
        <aside className="hidden w-64 border-r bg-white md:flex flex-col">
            <SidebarContent />
        </aside>
    )
}
