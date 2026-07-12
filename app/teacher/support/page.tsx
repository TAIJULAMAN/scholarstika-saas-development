"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, Send } from "lucide-react"
import { Label } from "@/components/ui/label"
import { useSendSupportMessageMutation } from "@/redux/features/support/supportApi"

export default function TeacherSupportPage() {
    const [sendSupportMessage, { isLoading }] = useSendSupportMessageMutation();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                alert("Please fill in all fields.");
                return;
            }
            await sendSupportMessage(formData).unwrap();
            alert("Successfully sent support message");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error: any) {
            console.error("Failed to send support message:", error);
            alert(error?.data?.message || "Failed to send support message. Please try again.");
        }
    };
    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-emerald-500 p-6 text-white shadow-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Contact Support</h1>
                        <p className="mt-1 text-emerald-50 opacity-90">Send us a message and we'll get back to you as soon as possible</p>
                    </div>
                </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Send us a message</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Your name" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="your.email@example.com" value={formData.email} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="What is this regarding?" value={formData.subject} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            placeholder="Please describe your issue or question in detail..."
                            rows={6}
                            className="min-h-[150px]"
                            value={formData.message}
                            onChange={handleChange}
                        />
                    </div>
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                        <Send className="mr-2 h-4 w-4" />
                        {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
