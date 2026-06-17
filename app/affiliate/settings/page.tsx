"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Building, Wallet, UserCircle } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

export default function AffiliateSettingsPage() {
    const [payoutMethod, setPayoutMethod] = useState("bank")

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        toast.success("Settings saved successfully!")
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account details and payout preferences.
                </p>
            </div>

            <Tabs defaultValue="kyc" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="kyc" className="flex items-center gap-2"><UserCircle className="w-4 h-4" /> Account & KYC</TabsTrigger>
                    <TabsTrigger value="payouts" className="flex items-center gap-2"><Wallet className="w-4 h-4" /> Payout Details</TabsTrigger>
                </TabsList>

                <TabsContent value="kyc">
                    <form onSubmit={handleSave}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your contact and business details.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Full Name</Label>
                                        <Input id="fullName" defaultValue="Dialle MaPau" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" defaultValue="diallemapau@gmail.com" readOnly className="bg-gray-50" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" type="tel" placeholder="+234..." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company/Brand Name (Optional)</Label>
                                        <Input id="company" defaultValue="EduTech Marketing" />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <Label htmlFor="address">Full Address</Label>
                                        <Input id="address" />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                                    <Save className="mr-2 h-4 w-4" /> Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </TabsContent>

                <TabsContent value="payouts">
                    <form onSubmit={handleSave}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Payout Preferences</CardTitle>
                                <CardDescription>How would you like to receive your commissions?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2 max-w-sm">
                                    <Label>Payout Method</Label>
                                    <Select value={payoutMethod} onValueChange={setPayoutMethod}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bank">Local Bank Transfer (NGN)</SelectItem>
                                            <SelectItem value="paypal">PayPal (USD)</SelectItem>
                                            <SelectItem value="paystack">Paystack/Flutterwave Wallet</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {payoutMethod === "bank" && (
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                        <div className="space-y-2">
                                            <Label htmlFor="bankName">Bank Name</Label>
                                            <Input id="bankName" placeholder="e.g. Zenith Bank" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="acctName">Account Name</Label>
                                            <Input id="acctName" placeholder="Name on account" />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label htmlFor="acctNumber">Account Number</Label>
                                            <Input id="acctNumber" placeholder="10-digit account number" />
                                        </div>
                                    </div>
                                )}

                                {payoutMethod === "paypal" && (
                                    <div className="space-y-2 pt-4 border-t max-w-md">
                                        <Label htmlFor="paypalEmail">PayPal Email Address</Label>
                                        <Input id="paypalEmail" type="email" placeholder="email@example.com" />
                                        <p className="text-xs text-muted-foreground mt-2">Payouts via PayPal may be subject to currency conversion fees.</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                                    <Save className="mr-2 h-4 w-4" /> Save Payout Details
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    )
}
