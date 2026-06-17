"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Copy, Image as ImageIcon, LayoutTemplate, Mail, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function AffiliateAssetsPage() {
    const [copied, setCopied] = useState(false)

    const emailTemplate = `Subject: Streamline [School Name]'s operations with Scholarstika

Hi [Name],

I noticed [School Name] is growing and wanted to introduce you to Scholarstika - an all-in-one management system built specifically for forward-thinking schools in our region.

From seamless fee collection to digital academic records, it saves administrators hours of manual work every single week. Many schools like yours have already transitioned and seen a massive reduction in operational overhead.

You can check out a quick demo and learn more here: 
[YOUR_AFFILIATE_LINK]

I'd be happy to answer any questions you have about how it works.

Best regards,
[Your Name]`

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(emailTemplate)
        setCopied(true)
        toast.success("Email template copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-10 pb-12 animate-in fade-in duration-500 max-w-6xl">
            {/* Header Area */}
            <div className="mb-2">
                <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent pb-1">
                    Marketing Assets
                </h2>
                <p className="text-muted-foreground mt-2 text-lg font-medium max-w-3xl">
                    Download high-quality, pre-approved banners, logos, and swipe copy to supercharge your promotional campaigns.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Logo Pack Card */}
                <Card className="group border-gray-100 shadow-xl shadow-gray-200/40 rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="border-b bg-emerald-50/30 px-8 py-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <ImageIcon className="w-5 h-5 text-emerald-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold">Brand Logo Pack</CardTitle>
                        </div>
                        <CardDescription className="text-base text-gray-500 font-medium">
                            Official Scholarstika logos in transparent PNG and scalable SVG formats. Use these on your website or blog.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="h-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center p-6 relative overflow-hidden group-hover:border-emerald-300 transition-colors">
                            <img src="/logo.png" alt="Scholarstika Logo" className="h-12 w-auto object-contain z-10" />
                            <div className="absolute inset-0 bg-white/40"></div>
                        </div>
                        <Button className="w-full h-14 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-base shadow-md transition-all hover:-translate-y-0.5">
                            <Download className="mr-2 h-5 w-5" /> Download Pack (1.2 MB ZIP)
                        </Button>
                    </CardContent>
                </Card>

                {/* Social Banners Card */}
                <Card className="group border-gray-100 shadow-xl shadow-gray-200/40 rounded-[1.5rem] overflow-hidden transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="border-b bg-blue-50/30 px-8 py-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <LayoutTemplate className="w-5 h-5 text-blue-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold">Social Media Banners</CardTitle>
                        </div>
                        <CardDescription className="text-base text-gray-500 font-medium">
                            Optimized, high-converting banner images for Facebook Ads, LinkedIn posts, and Twitter campaigns.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-100 rounded-2xl flex flex-col items-center justify-center p-4 group-hover:border-blue-300 transition-colors relative overflow-hidden">
                            <div className="flex gap-2 mb-3">
                                <div className="w-24 h-16 bg-white rounded shadow-sm border border-gray-100"></div>
                                <div className="w-16 h-16 bg-white rounded shadow-sm border border-gray-100"></div>
                                <div className="w-12 h-16 bg-white rounded shadow-sm border border-gray-100 hidden sm:block"></div>
                            </div>
                            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">15+ Sizes Available</span>
                        </div>
                        <Button className="w-full h-14 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-base shadow-md transition-all hover:-translate-y-0.5">
                            <Download className="mr-2 h-5 w-5" /> Download Banners (8.5 MB ZIP)
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
