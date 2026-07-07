"use client"

import { Star, Play, Quote, Award, Users, TrendingUp } from "lucide-react"
import { useState } from "react"
import { useGetAllTestimonialsQuery } from "@/redux/features/testimonials/testimonialsApi"
import { imgUrl } from "@/config/envConfig"

export default function TestimonialsPage() {
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
    const { data: testimonialsResponse } = useGetAllTestimonialsQuery(undefined)
    
    // Format fetched videos
    const fetchedVideos = testimonialsResponse?.data?.data?.map((item: any, index: number) => ({
        name: item.name,
        role: item.designation,
        institution: item.workingPlace,
        thumbnail: videoTestimonials[index % videoTestimonials.length].thumbnail,
        videoUrl: item.videoUrl?.startsWith('http') 
            ? item.videoUrl 
            : `${imgUrl}/${item.videoUrl}`
    })) || []
    
    const displayVideos = fetchedVideos.length > 0 ? fetchedVideos : videoTestimonials;

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-500 py-20 md:py-32">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                            Trusted by Thousands of Educators
                        </h1>
                        <p className="mb-8 text-lg text-indigo-100 md:text-xl">
                            See what schools, teachers, and parents are saying about Scholarstika
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-8 text-white">
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                                <span className="text-lg font-semibold">4.9/5 Rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                <span className="text-lg font-semibold">10,000+ Users</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                <span className="text-lg font-semibold">500+ Schools</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { label: "Student Success Rate", value: "98%", icon: TrendingUp, color: "text-emerald-600" },
                            { label: "Time Saved", value: "40hrs/week", icon: Award, color: "text-teal-600" },
                            { label: "Parent Satisfaction", value: "96%", icon: Users, color: "text-green-600" },
                            { label: "Active Institutions", value: "500+", icon: Star, color: "text-amber-600" },
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg"
                            >
                                <stat.icon className={`mb-3 h-8 w-8 ${stat.color}`} />
                                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Video Testimonials Section */}
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                            Video Testimonials
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Hear directly from educators and administrators about their experience
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {displayVideos.map((video: any, index: number) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-2xl bg-gray-900 shadow-lg transition-all hover:shadow-2xl"
                            >
                                <div className="aspect-video relative">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.name}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <button
                                        onClick={() => setSelectedVideo(video.videoUrl)}
                                        className="absolute inset-0 flex items-center justify-center transition-all"
                                    >
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:bg-white">
                                            <Play className="ml-1 h-8 w-8 fill-emerald-600 text-emerald-600" />
                                        </div>
                                    </button>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <h3 className="font-semibold">{video.name}</h3>
                                        <p className="text-sm text-gray-200">{video.role}</p>
                                        <p className="text-xs text-gray-300">{video.institution}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Text Reviews Section */}
            <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-12 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                            What Our Users Say
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Real feedback from real educators making a difference
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {textReviews.map((review, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl"
                            >
                                <Quote className="mb-4 h-10 w-10 text-emerald-200" />
                                <div className="mb-4 flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`h-4 w-4 ${i < review.rating
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "fill-gray-200 text-gray-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="mb-6 text-gray-700 leading-relaxed">{review.text}</p>
                                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold">
                                        {review.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                                        <p className="text-sm text-gray-600">{review.role}</p>
                                        <p className="text-xs text-gray-500">{review.institution}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Success Stories */}
            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                            Success Stories
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Transforming education, one institution at a time
                        </p>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-2">
                        {successStories.map((story, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all hover:shadow-xl"
                            >
                                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-emerald-100 to-teal-100">
                                    <img
                                        src={story.image}
                                        alt={story.institution}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="p-6 md:p-8">
                                    <div className="mb-4 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                                        {story.category}
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold text-gray-900">{story.title}</h3>
                                    <p className="mb-4 text-gray-600 leading-relaxed">{story.description}</p>
                                    <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-semibold">
                                            {story.author.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{story.author}</h4>
                                            <p className="text-sm text-gray-600">{story.institution}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-500 py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
                            Ready to Transform Your Institution?
                        </h2>
                        <p className="mb-8 text-lg text-emerald-100">
                            Join thousands of educators who are already experiencing the difference
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <button className="rounded-full bg-amber-400 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-amber-500 hover:shadow-xl">
                                Start Free Trial
                            </button>
                            <button className="rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all hover:bg-white/10">
                                Schedule a Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Modal */}
            {selectedVideo && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setSelectedVideo(null)}
                >
                    <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300"
                        >
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            {selectedVideo?.includes('youtube.com') || selectedVideo?.includes('vimeo.com') ? (
                                <iframe
                                    src={selectedVideo}
                                    className="h-full w-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <video
                                    src={selectedVideo || ''}
                                    className="h-full w-full object-contain"
                                    controls
                                    autoPlay
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Sample Data
const videoTestimonials = [
    {
        name: "Dr. Sarah Johnson",
        role: "Principal",
        institution: "Greenwood High School",
        thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=450&fit=crop",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        name: "Michael Chen",
        role: "IT Director",
        institution: "Riverside Academy",
        thumbnail: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=450&fit=crop",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        name: "Emily Rodriguez",
        role: "Head Teacher",
        institution: "Oakmont Elementary",
        thumbnail: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=450&fit=crop",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        name: "James Wilson",
        role: "Finance Administrator",
        institution: "Lincoln International School",
        thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=450&fit=crop",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        name: "Lisa Anderson",
        role: "Parent Representative",
        institution: "Maple Grove School",
        thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=450&fit=crop",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        name: "David Martinez",
        role: "Academic Coordinator",
        institution: "Summit Academy",
        thumbnail: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=450&fit=crop",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
]

const textReviews = [
    {
        name: "Jennifer Thompson",
        role: "School Administrator",
        institution: "Westfield Academy",
        rating: 5,
        text: "Scholarstika has completely transformed how we manage our school operations. The intuitive interface and comprehensive features have saved us countless hours of administrative work."
    },
    {
        name: "Robert Kim",
        role: "Teacher",
        institution: "Horizon High School",
        rating: 5,
        text: "As a teacher, I love how easy it is to track student progress and communicate with parents. The gradebook feature is a game-changer!"
    },
    {
        name: "Maria Garcia",
        role: "Parent",
        institution: "Sunshine Elementary",
        rating: 5,
        text: "Being able to see my child's progress in real-time and communicate directly with teachers has been invaluable. Highly recommend!"
    },
    {
        name: "Thomas Brown",
        role: "Principal",
        institution: "Cedar Valley School",
        rating: 5,
        text: "The financial management tools have streamlined our fee collection process. We've seen a 40% reduction in late payments since implementing Scholarstika."
    },
    {
        name: "Amanda Lee",
        role: "Vice Principal",
        institution: "Brookside Academy",
        rating: 5,
        text: "The reporting features are outstanding. I can generate comprehensive reports in minutes that used to take hours to compile manually."
    },
    {
        name: "Christopher Davis",
        role: "IT Manager",
        institution: "Northstar School",
        rating: 5,
        text: "Implementation was smooth and the support team is incredibly responsive. The platform is secure, reliable, and scales perfectly with our growing institution."
    },
    {
        name: "Patricia Wilson",
        role: "Finance Officer",
        institution: "Elmwood School",
        rating: 5,
        text: "The automated invoicing and payment tracking features have made my job so much easier. Financial reconciliation is now a breeze!"
    },
    {
        name: "Kevin Patel",
        role: "Department Head",
        institution: "Riverside College",
        rating: 5,
        text: "The exam management system is exceptional. Creating, scheduling, and grading exams has never been more efficient."
    },
    {
        name: "Rachel Green",
        role: "Counselor",
        institution: "Lakeside High",
        rating: 5,
        text: "The student information system gives me quick access to all the data I need to support students effectively. It's been transformative for our counseling department."
    }
]

const successStories = [
    {
        title: "40% Increase in Administrative Efficiency",
        description: "Greenwood High School reduced administrative workload by 40% within the first semester of using Scholarstika. The automated attendance tracking and grade management freed up teachers to focus more on student engagement.",
        institution: "Greenwood High School",
        author: "Dr. Sarah Johnson",
        category: "Efficiency",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop"
    },
    {
        title: "Improved Parent Engagement by 65%",
        description: "Oakmont Elementary saw a remarkable 65% increase in parent engagement after implementing Scholarstika's parent portal. Real-time updates and easy communication tools made parents feel more connected to their children's education.",
        institution: "Oakmont Elementary",
        author: "Emily Rodriguez",
        category: "Engagement",
        image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=450&fit=crop"
    },
    {
        title: "Streamlined Fee Collection Process",
        description: "Lincoln International School reduced late fee payments by 75% and improved cash flow significantly. The automated reminder system and online payment options made it easier for parents to pay on time.",
        institution: "Lincoln International School",
        author: "James Wilson",
        category: "Financial",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop"
    },
    {
        title: "Enhanced Student Performance Tracking",
        description: "Summit Academy implemented comprehensive performance analytics that helped identify struggling students early. This proactive approach led to a 30% improvement in overall student performance.",
        institution: "Summit Academy",
        author: "David Martinez",
        category: "Academic",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop"
    }
]
