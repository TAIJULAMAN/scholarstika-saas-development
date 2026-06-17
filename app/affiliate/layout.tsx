import type { Metadata } from "next"
import { AffiliateSidebar } from "@/components/affiliate/sidebar"
import { AffiliateHeader } from "@/components/affiliate/header"

export const metadata: Metadata = {
    title: "Affiliate Dashboard | Scholarstika",
    description: "Manage your affiliate links, performance, and earnings",
}

export default function AffiliateLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50/50">
            <AffiliateSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <AffiliateHeader />
                <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 lg:pl-12 w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}
