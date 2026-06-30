"use client"

import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Calendar, Clock, User } from "lucide-react"
import { RelatedArticles } from "@/components/blog/related-articles"
import { BlogContent } from "@/components/blog/blog-content"
import { useGetAllBlogsQuery } from "@/redux/features/blogs/blogsApi"
import { imgUrl } from "@/config/envConfig"
import { featuredPost } from "@/data/blog-posts"

function BlogDetailsContent() {
    const { data: blogResponse, isLoading } = useGetAllBlogsQuery();
    const searchParams = useSearchParams();
    const blogId = searchParams.get("id");

    const blogs = blogResponse?.data?.result || [];
    const activePost = blogs.find(b => b.id === blogId) || null;

    const currentPost = activePost || featuredPost;

    const title = currentPost.title;
    const excerpt = 'description' in currentPost ? currentPost.description : currentPost.excerpt;
    const imageSrc = 'photo' in currentPost ? `${imgUrl}/${currentPost.photo}` : currentPost.image;
    const author = 'author' in currentPost ? currentPost.author : "Admin";
    const readTime = 'readTime' in currentPost ? currentPost.readTime : "5 min. to read";

    let dateStr = "Recently";
    if ('createdAt' in currentPost) {
        try {
            dateStr = new Date(currentPost.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });
        } catch {
            dateStr = "Recently";
        }
    } else if ('date' in currentPost) {
        dateStr = currentPost.date;
    }

    // Get 3 related articles (excluding the active one)
    const related = blogs.filter(b => b.id !== blogId).slice(0, 3);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Hero Section */}
            <section className="bg-white py-8">
                <div className="container mx-auto px-5 lg:px-0">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-emerald-600">Home</Link>
                        <span>/</span>
                        <Link href="/blog" className="hover:text-emerald-600">Blog</Link>
                        <span>/</span>
                        <span className="text-gray-900">Article Details</span>
                    </div>

                    {/* Title */}
                    {isLoading ? (
                        <div className="h-10 bg-gray-200 rounded w-3/4 animate-pulse mb-6" />
                    ) : (
                        <h1 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                            {title}
                        </h1>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                                <User className="h-full w-full p-2" />
                            </div>
                            <span className="font-medium text-gray-900">{author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{dateStr}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{readTime}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            <section className="bg-white py-8">
                <div className="container mx-auto px-5 lg:px-0">
                    {isLoading ? (
                        <div className="h-64 w-full bg-gray-200 rounded-lg animate-pulse md:h-96 lg:h-[500px]" />
                    ) : (
                        <div className="relative h-64 w-full overflow-hidden rounded-lg md:h-96 lg:h-[500px] min-h-[300px]">
                            <Image
                                src={imageSrc}
                                alt={title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}
                </div>
            </section>

            <BlogContent content={excerpt} />
            <RelatedArticles posts={related} isLoading={isLoading} />
        </div>
    )
}

export default function BlogDetailsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-600" />
            </div>
        }>
            <BlogDetailsContent />
        </Suspense>
    )
}
