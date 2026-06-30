"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FeaturedPost } from "@/components/blog/featured-post"
import { BlogGrid } from "@/components/blog/blog-grid"
import { PageHeader } from "@/components/common/page-header"
import { useGetAllBlogsQuery } from "@/redux/features/blogs/blogsApi"

export default function BlogPage() {
    const { data: blogResponse, isLoading } = useGetAllBlogsQuery();
    const [selectedCategory, setSelectedCategory] = useState("All");

    const blogs = blogResponse?.data?.result || [];

    // Derive categories from fetched blogs
    const categories = blogs.length > 0
        ? ["All", ...Array.from(new Set(blogs.map(blog => blog.blogCategory).filter(Boolean)))]
        : ["All", "Management", "Technology", "Communication", "Education", "Finance", "Well-being"];

    const filteredBlogs = selectedCategory === "All"
        ? blogs
        : blogs.filter(blog => blog.blogCategory.toLowerCase() === selectedCategory.toLowerCase());

    const featuredPost = filteredBlogs[0] || null;
    const remainingPosts = filteredBlogs.slice(1);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <PageHeader
                title="Our Blog"
                description="Insights, tips, and best practices for modern school management."
            />
            <section className="border-b bg-white py-5">
                <div className="container mx-auto px-5 lg:px-0">
                    <div className="flex flex-wrap gap-3">
                        {categories.map((category, idx) => (
                            <Button
                                key={idx}
                                variant={selectedCategory === category ? "default" : "outline"}
                                className={selectedCategory === category ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            <FeaturedPost post={featuredPost} isLoading={isLoading} />
            <BlogGrid posts={remainingPosts} isLoading={isLoading} />
        </div>
    )
}

