"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { useState } from "react"

export function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const testimonials = [
        {
            name: "Sarah M.",
            role: "School Administrator",
            school: "Greenwood High School",
            image: "/people/sarah.png",
            rating: 5,
            text: "This system transformed how we track student performance. It's incredibly easy to use and has streamlined our entire administrative process. The real-time analytics have been a game-changer for our decision-making.",
        },
        {
            name: "Mike R.",
            role: "High School Teacher",
            school: "Lincoln Academy",
            image: "/people/mike.png",
            rating: 5,
            text: "The communication features have revolutionized how I connect with parents. Real-time updates keep everyone informed and engaged. I can now focus more on teaching and less on administrative tasks.",
        },
        {
            name: "Lisa K.",
            role: "Parent",
            school: "Riverside Elementary",
            image: "/people/lisa.png",
            rating: 5,
            text: "I love being able to track my child's progress in real-time and communicate directly with teachers. It's made me more involved in their education and I feel much more connected to what's happening at school.",
        },
    ]

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    const visibleTestimonials = [
        testimonials[currentIndex],
        testimonials[(currentIndex + 1) % testimonials.length],
        testimonials[(currentIndex + 2) % testimonials.length],
    ]

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-16 md:py-20">
            {/* Decorative Elements */}
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-teal-200/30 blur-3xl" />

            <div className="container relative mx-auto px-5 lg:px-0">
                {/* Header with Navigation */}
                <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div className="flex-1">
                        <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                            What Our <span className="text-emerald-600">Community Says</span>
                        </h2>
                        <p className="max-w-2xl text-base text-gray-600 md:text-lg">
                            Hear from educators, administrators, and parents who have transformed their schools with Scholastika.
                        </p>
                    </div>
                    <div className="hidden gap-3 md:flex">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={prevTestimonial}
                            className="h-12 w-12 rounded-full border-2 border-emerald-600 bg-white text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={nextTestimonial}
                            className="h-12 w-12 rounded-full border-2 border-emerald-600 bg-white text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* Testimonials Grid */}
                <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
                    {visibleTestimonials.map((testimonial, idx) => (
                        <Card
                            key={idx}
                            className="group relative overflow-hidden border-none bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                        >
                            {/* Quote Icon Background */}
                            <div className="absolute right-6 top-6 opacity-10">
                                <Quote className="h-16 w-16 text-emerald-600" />
                            </div>

                            <CardContent className="relative p-6 md:p-8">
                                {/* User Info */}
                                <div className="mb-6 flex items-center gap-4">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-full ring-4 ring-emerald-100 transition-all group-hover:ring-emerald-200">
                                        <Image
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-sm font-medium text-emerald-600">{testimonial.role}</p>
                                        <p className="text-xs text-gray-500">{testimonial.school}</p>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="mb-4 flex gap-1">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>

                                {/* Testimonial Text */}
                                <p className="text-sm leading-relaxed text-gray-700 md:text-base">
                                    "{testimonial.text}"
                                </p>

                                {/* Decorative Bottom Border */}
                                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 transition-opacity group-hover:opacity-100" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Mobile Navigation */}
                <div className="mt-8 flex justify-center gap-3 md:hidden">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={prevTestimonial}
                        className="h-12 w-12 rounded-full border-2 border-emerald-600 bg-white text-emerald-600"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={nextTestimonial}
                        className="h-12 w-12 rounded-full border-2 border-emerald-600 bg-white text-emerald-600"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>

                {/* Dots Indicator */}
                <div className="mt-8 flex justify-center gap-2">
                    {testimonials.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 rounded-full transition-all ${idx === currentIndex
                                ? 'w-8 bg-emerald-600'
                                : 'w-2 bg-emerald-300 hover:bg-emerald-400'
                                }`}
                            aria-label={`Go to testimonial ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
