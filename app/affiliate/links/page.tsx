"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Copy, Link as LinkIcon, QrCode as QrCodeIcon, Download } from "lucide-react"
import { useState, useRef } from "react"
import { toast } from "sonner"
import QRCode from "react-qr-code"

export default function ReferralLinksPage() {
    const affiliateCode = "EDUTECH25"
    const referralLink = `https://scholarstika.org/?ref=${affiliateCode}`
    const [copied, setCopied] = useState(false)
    const qrRef = useRef<HTMLDivElement>(null)

    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink)
        setCopied(true)
        toast.success("Referral link copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
    }

    const downloadQRCode = () => {
        if (!qrRef.current) return
        const svg = qrRef.current.querySelector("svg")
        if (!svg) return

        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            if (ctx) {
                ctx.fillStyle = "white"
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0)
                const pngFile = canvas.toDataURL("image/png")
                const downloadLink = document.createElement("a")
                downloadLink.download = `scholarstika-qr-${affiliateCode}.png`
                downloadLink.href = `${pngFile}`
                downloadLink.click()
            }
        }
        img.src = "data:image/svg+xml;base64," + btoa(svgData)
        toast.success("QR Code downloaded successfully!")
    }

    return (
        <div className="space-y-10 pb-12 animate-in fade-in duration-500">
            <div className="mb-2">
                <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent pb-1">
                    Referral Assets
                </h2>
                <p className="text-muted-foreground mt-2 text-lg font-medium">
                    Share these links with schools to earn up to 30% commission on their subscriptions.
                </p>
            </div>
            <Card className="border-gray-100 shadow-xl shadow-gray-200/40 rounded-[1.5rem] overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <LinkIcon className="w-32 h-32 text-emerald-900 transform rotate-45 translate-x-4 -translate-y-4" />
                </div>
                <CardHeader className="border-b bg-emerald-50/30 px-8 py-6">
                    <CardTitle className="text-2xl font-bold">Your Unique Referral Link</CardTitle>
                    <CardDescription className="text-base mt-2 max-w-md">
                        This link drops a 60-day cookie. Anyone who clicks it and signs up will be automatically attributed to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-8 relative z-10">
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Campaign Link</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1 group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LinkIcon className="h-5 w-5 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                                </div>
                                <Input
                                    readOnly
                                    value={referralLink}
                                    className="pl-12 h-14 bg-gray-50/50 border-2 border-gray-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 font-mono text-base text-gray-700 rounded-xl transition-all hover:bg-white"
                                />
                            </div>
                            <Button
                                onClick={handleCopyLink}
                                className={`h-14 px-8 rounded-xl font-bold text-base transition-all ${copied
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 scale-105"
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5"
                                    }`}
                            >
                                {copied ? "Copied! ✨" : <><Copy className="mr-2 h-5 w-5" /> Copy Link</>}
                            </Button>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
                        <div className="space-y-4 max-w-sm text-center md:text-left">
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
                                    <QrCodeIcon className="w-5 h-5 text-emerald-600" />
                                    Scan to Sign Up
                                </h4>
                                <p className="text-sm text-gray-500 mt-2 font-medium">
                                    Download this QR code and print it on your flyers, business cards, or display it at physical events. Scans will be tracked directly to your account.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={downloadQRCode}
                                className="w-full md:w-auto h-12 border-2 border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 font-bold shadow-sm rounded-xl transition-all"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download PNG
                            </Button>
                        </div>

                        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex-shrink-0" ref={qrRef}>
                            <QRCode
                                value={referralLink}
                                size={140}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                viewBox={`0 0 256 256`}
                                fgColor="#047857" // emerald-700
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
