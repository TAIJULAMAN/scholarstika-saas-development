"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, CheckCircle2, AlertCircle, DollarSign, Users } from "lucide-react"

const notifications = [
    {
        id: 1,
        title: "Commission Approved!",
        description: "Your commission of ₦40,000 for referring Greenwood High has cleared the 30-day hold and is now available for payout.",
        time: "2 hours ago",
        type: "success",
        icon: DollarSign,
        read: false
    },
    {
        id: 2,
        title: "New School Sign-up",
        description: "Lakeside Secondary just signed up using your referral link. They are currently on their 14-day free trial.",
        time: "1 day ago",
        type: "info",
        icon: Users,
        read: true
    },
    {
        id: 3,
        title: "Payout Processed",
        description: "Your payout request for ₦120,000 has been processed to your Zenith Bank account.",
        time: "3 days ago",
        type: "success",
        icon: CheckCircle2,
        read: true
    },
    {
        id: 4,
        title: "Action Required: Update Bank Details",
        description: "Your recent payout attempt failed. Please update your bank account details in Settings.",
        time: "1 week ago",
        type: "alert",
        icon: AlertCircle,
        read: true
    }
]

export default function AffiliateNotificationsPage() {
    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
                    <p className="text-muted-foreground">
                        Stay updated on your referrals, commissions, and system alerts.
                    </p>
                </div>
                <div className="bg-emerald-100 text-emerald-700 font-semibold px-3 py-1 rounded-full text-xs">
                    1 Unread
                </div>
            </div>

            <div className="space-y-4">
                {notifications.map((notif) => {
                    const Icon = notif.icon
                    const iconColor = 
                        notif.type === 'success' ? 'text-emerald-500 bg-emerald-50' : 
                        notif.type === 'alert' ? 'text-red-500 bg-red-50' : 
                        'text-blue-500 bg-blue-50'

                    return (
                        <Card key={notif.id} className={`transition-all ${!notif.read ? 'border-emerald-200 shadow-sm bg-emerald-50/10' : 'opacity-80'}`}>
                            <CardContent className="p-4 flex gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconColor}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className={`font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {notif.title}
                                        </h4>
                                        <span className="text-xs text-muted-foreground">{notif.time}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-snug">
                                        {notif.description}
                                    </p>
                                </div>
                                {!notif.read && (
                                    <div className="flex-shrink-0 flex items-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
