"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MessageCircle, Mail } from "lucide-react"
import Link from "next/link"
import { useGetFaqsQuery } from "@/redux/features/faq/faqApi"

const SkeletonCard = () => (
    <Card className="overflow-hidden border-none bg-white shadow-md animate-pulse p-6">
        <div className="flex justify-between items-center">
            <div className="h-5 w-3/4 bg-emerald-100/70 rounded" />
            <div className="h-8 w-8 rounded-full bg-emerald-100/70" />
        </div>
    </Card>
)

export function FaqSection() {
    const { data: faqResponse, isLoading } = useGetFaqsQuery();

    const staticLeftColumnFaqs = [
        {
            question: "How do I make a new account on this platform or in Scholastika?",
            answer: "To create a new account, click on the 'Sign Up' button in the top right corner. Fill in your details including name, email, and password. You'll receive a verification email to activate your account. Once verified, you can log in and start using all features of Scholastika."
        },
        {
            question: "Can any school available on our system join Scholastika?",
            answer: "Yes! Scholastika is designed to accommodate schools of all sizes and types. Whether you're a small private institution or a large public school system, our multi-tenant platform can be customized to meet your specific needs. Contact our team to discuss your requirements and get started."
        },
        {
            question: "Is my data safe or how do you handle my valuable data in Scholastika?",
            answer: "We take data security very seriously. All data is encrypted both in transit and at rest using industry-standard encryption protocols. We implement strict access controls, regular security audits, and comply with international data protection regulations including GDPR. Each school's data is completely isolated in our multi-tenant architecture."
        },
        {
            question: "I recently enrolled in a class, but can't access it after fee payment?",
            answer: "If you've completed your fee payment but still can't access your class, please allow up to 24 hours for payment verification. If the issue persists, contact your school administrator or our support team with your payment receipt. They can manually verify and grant you immediate access to your enrolled classes."
        },
        {
            question: "How do students interact with the management desk or send messages?",
            answer: "Students can communicate with the management desk through our integrated messaging system. Simply navigate to the 'Messages' section in your dashboard, select 'Contact Administration', and compose your message. You can also use the Parent-Teacher Communication Hub for direct communication with teachers and staff."
        },
    ]

    const staticRightColumnFaqs = [
        {
            question: "What features are included in the mobile app for students and parents?",
            answer: "Our mobile apps provide comprehensive access to all essential features including attendance tracking, grade viewing, homework assignments, class schedules, fee payment, real-time notifications, direct messaging with teachers, and access to digital learning resources. Both iOS and Android versions are available for download."
        },
        {
            question: "How does the multi-tenant system work for different schools?",
            answer: "Each school operates in a completely isolated environment with its own branding, custom domain, unique configurations, and separate database. This ensures complete data privacy while allowing you to benefit from our shared infrastructure and regular updates. Schools can customize their instance to match their specific requirements."
        },
        {
            question: "Can teachers create and manage online assignments and exams?",
            answer: "Absolutely! Teachers have full control over creating assignments, quizzes, and exams. They can set deadlines, attach resources, create multiple question types, enable auto-grading for objective questions, provide feedback, and track submission status. The system also supports plagiarism detection and late submission policies."
        },
        {
            question: "What kind of reports and analytics are available for administrators?",
            answer: "Administrators have access to comprehensive analytics including student performance trends, attendance patterns, fee collection reports, teacher performance metrics, class-wise comparisons, and custom report generation. All reports can be exported in multiple formats (PDF, Excel, CSV) and scheduled for automatic delivery."
        },
        {
            question: "Is there training and support available for new users?",
            answer: "Yes! We provide comprehensive onboarding including live training sessions, video tutorials, detailed documentation, and dedicated support channels. Our support team is available via email, live chat, and phone. We also offer regular webinars and a knowledge base with step-by-step guides for all features."
        },
    ]

    const faqs = faqResponse?.data?.result || [];
    const useStatic = faqs.length === 0;

    const leftColumnFaqs = useStatic
        ? staticLeftColumnFaqs
        : faqs.slice(0, Math.ceil(faqs.length / 2));

    const rightColumnFaqs = useStatic
        ? staticRightColumnFaqs
        : faqs.slice(Math.ceil(faqs.length / 2));

    return (
        <section id="faq" className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-16 md:py-20">
            {/* Decorative Elements */}
            <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-teal-200/30 blur-3xl" />

            <div className="container relative mx-auto max-w-7xl px-5 lg:px-0">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                        Frequently Asked <span className="text-emerald-600">Questions</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-base text-gray-600 md:text-lg">
                        Find quick answers to common questions about our platform and its features
                    </p>
                </div>

                {/* FAQ Accordion - Two Columns */}
                <div className="mb-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
                    {isLoading ? (
                        <>
                            <div className="space-y-4">
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </div>
                            <div className="space-y-4">
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Left Column */}
                            <div className="space-y-4">
                                {leftColumnFaqs.map((faq, idx) => (
                                    <Card key={idx} className="overflow-hidden border-none bg-white shadow-md transition-all hover:shadow-lg">
                                        <details className="group">
                                            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-gray-900 transition-all hover:bg-emerald-50/50">
                                                <span className="pr-4 text-base font-semibold md:text-lg">{faq.question}</span>
                                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 transition-all group-hover:bg-emerald-200 group-open:bg-emerald-600">
                                                    <Plus className="h-5 w-5 text-emerald-600 transition-all group-open:rotate-45 group-open:text-white" />
                                                </div>
                                            </summary>
                                            <div className="border-t border-emerald-100 bg-gradient-to-br from-emerald-50/30 to-transparent px-6 pb-6 pt-4">
                                                <p className="text-sm leading-relaxed text-gray-700 md:text-base">{faq.answer}</p>
                                            </div>
                                        </details>
                                    </Card>
                                ))}
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                {rightColumnFaqs.map((faq, idx) => (
                                    <Card key={idx} className="overflow-hidden border-none bg-white shadow-md transition-all hover:shadow-lg">
                                        <details className="group">
                                            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-gray-900 transition-all hover:bg-emerald-50/50">
                                                <span className="pr-4 text-base font-semibold md:text-lg">{faq.question}</span>
                                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 transition-all group-hover:bg-emerald-200 group-open:bg-emerald-600">
                                                    <Plus className="h-5 w-5 text-emerald-600 transition-all group-open:rotate-45 group-open:text-white" />
                                                </div>
                                            </summary>
                                            <div className="border-t border-emerald-100 bg-gradient-to-br from-emerald-50/30 to-transparent px-6 pb-6 pt-4">
                                                <p className="text-sm leading-relaxed text-gray-700 md:text-base">{faq.answer}</p>
                                            </div>
                                        </details>
                                    </Card>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Contact CTA */}
                <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 text-center shadow-xl md:p-10">
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">Still have questions?</h3>
                    <p className="mb-8 text-base text-white/90 md:text-lg">
                        Can't find the answer you're looking for? Our friendly team is here to help.
                    </p>
                    <Link href="/contact">
                        <Button
                            size="lg"
                            className="bg-white px-8 text-emerald-600 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
                        >
                            <Mail className="mr-2 h-5 w-5" />
                            Contact Support
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

