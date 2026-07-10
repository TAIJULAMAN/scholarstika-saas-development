"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useContactMutation } from "@/redux/features/contact/contactApi"
import { toast } from "sonner"

export function ContactForm() {
    const [createContact, { isLoading }] = useContactMutation()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        subject: "",
        message: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const res = await createContact(formData).unwrap()
            if (res.success) {
                toast.success(res.message || "Message sent successfully")
                setFormData({
                    name: "",
                    email: "",
                    phoneNumber: "",
                    subject: "",
                    message: ""
                })
            } else {
                toast.error(res.message || "Something went wrong")
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send message")
        }
    }

    return (
        <Card className="shadow-xl">
            <CardContent className="p-8 md:p-12">
                <h2 className="mb-6 text-3xl font-bold text-gray-900">Send us a Message</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Name & Email */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                className="h-12"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                className="h-12"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Phone & Subject */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                placeholder="+880 1234 567 890"
                                className="h-12"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                type="text"
                                placeholder="How can we help?"
                                className="h-12"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Tell us more about your inquiry..."
                            rows={6}
                            className="resize-none"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-emerald-600 py-6 text-lg hover:bg-emerald-700 md:w-auto md:px-12"
                    >
                        {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
