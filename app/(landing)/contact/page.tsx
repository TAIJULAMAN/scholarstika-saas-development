import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PageHeader } from "@/components/common/page-header"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-amber-50">
            <PageHeader
                title="Get in Touch"
                description="Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
            />

            {/* Contact Form & Info Section */}
            <section className="py-16">
                <div className="container mx-auto px-6 lg:px-12">
                    <div className="grid gap-12 lg:grid-cols-3">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <ContactForm />
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-6">
                            <ContactInfo />
                        </div>
                    </div>
                </div>
            </section>
            {/* CTA Section */}
            <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 py-16 text-white">
                <div className="container mx-auto px-6 text-center lg:px-12">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Get Started?</h2>
                    <p className="mb-8 text-lg">
                        Join hundreds of schools already using Scholarstika to transform their operations.
                    </p>
                    <Link href="/book-demo">
                        <Button size="lg" className="bg-amber-500 px-8 text-white hover:bg-amber-600">
                            Start Free Trial
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
