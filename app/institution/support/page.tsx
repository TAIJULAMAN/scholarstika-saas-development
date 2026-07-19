"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { useCreateSupportMutation } from "@/redux/features/institutionAndBranch/support/supportApi"
import { useSelector } from "react-redux"
import { toast } from "sonner"

export default function SupportPage() {
    const { subscriptionId } = useSelector((state: any) => state.auth)
    const [createSupport, { isLoading }] = useCreateSupportMutation()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!subscriptionId) {
            toast.error("Authentication error: Missing subscription ID")
            return
        }
        
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Please fill in all fields")
            return
        }

        try {
            await createSupport({
                subscriptionId,
                name: formData.name,
                email: formData.email,
                title: formData.subject,
                description: formData.message,
                audience: ["SUPER_ADMIN"]
            }).unwrap()
            
            toast.success("Message sent successfully!")
            setFormData({ name: "", email: "", subject: "", message: "" })
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send message")
        }
    }

    return (
        <div className="space-y-6">
            <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <Label className="mb-2">Name</Label>
                            <Input 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="Your name" 
                            />
                        </div>
                        <div>
                            <Label className="mb-2">Email</Label>
                            <Input 
                                name="email" 
                                type="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                placeholder="your.email@example.com" 
                            />
                        </div>
                    </div>
                    <div>
                        <Label className="mb-2">Subject</Label>
                        <Input 
                            name="subject" 
                            value={formData.subject} 
                            onChange={handleChange} 
                            placeholder="What is this regarding?" 
                        />
                    </div>
                    <div>
                        <Label className="mb-2">Message</Label>
                        <Textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Please describe your issue or question in detail..."
                            rows={6}
                        />
                    </div>
                    <Button disabled={isLoading} type="submit" className="w-full bg-green-600">
                        <Send className="mr-2 h-4 w-4" />
                        {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                </form>
            </div>
        </div>
    )
}
