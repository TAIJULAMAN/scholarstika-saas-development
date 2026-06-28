import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, Tag } from "lucide-react"
import { featuredPost } from "@/data/blog-posts"
import { BlogItem } from "@/redux/features/blogs/blogsApi"
import { imgUrl } from "@/config/envConfig"

interface FeaturedPostProps {
    post?: BlogItem | null;
    isLoading?: boolean;
}

const FeaturedSkeleton = () => (
    <section className="py-12 animate-pulse">
        <div className="container mx-auto px-5 lg:px-0">
            <div className="mb-10 flex items-center gap-2">
                <div className="h-7 w-20 bg-amber-200 rounded" />
                <div className="h-5 w-24 bg-gray-200 rounded" />
            </div>

            <div className="grid gap-10 md:grid-cols-2">
                <div className="p-8 md:p-12 space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-full" />
                    <div className="h-8 bg-gray-200 rounded w-2/3" />
                    <div className="flex gap-4">
                        <div className="h-4 bg-gray-200 rounded w-20" />
                        <div className="h-4 bg-gray-200 rounded w-24" />
                        <div className="h-4 bg-gray-200 rounded w-16" />
                    </div>
                    <div className="space-y-2 pt-4">
                        <div className="h-4 bg-gray-200 rounded" />
                        <div className="h-4 bg-gray-200 rounded" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                    </div>
                    <div className="h-10 bg-emerald-100 rounded w-32 pt-4" />
                </div>
                <div className="relative h-64 md:h-auto bg-gray-200 rounded-md min-h-[300px]" />
            </div>
        </div>
    </section>
)

export function FeaturedPost({ post, isLoading }: FeaturedPostProps) {
    if (isLoading) {
        return <FeaturedSkeleton />
    }

    const currentPost = post || featuredPost;

    const title = currentPost.title;
    const category = 'blogCategory' in currentPost ? currentPost.blogCategory : currentPost.category;
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

    return (
        <section className="py-12">
            <div className="container mx-auto px-5 lg:px-0">
                <div className="mb-10 flex items-center gap-2">
                    <span className="bg-amber-500 px-3 py-1 text-sm font-bold text-white">Featured</span>
                    <span className="text-gray-600">This month</span>
                </div>

                <div className="overflow-hidden transition-all">
                    <div className="grid gap-10 md:grid-cols-2">
                        <div className="p-8 md:p-12">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                                {title}
                            </h2>
                            <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span>{author}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{dateStr}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{readTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Tag className="h-4 w-4" />
                                    <span>{category}</span>
                                </div>
                            </div>
                            <p className="mb-6 leading-relaxed text-gray-600">
                                {excerpt}
                            </p>
                            <Link href={`/blog/details?id=${currentPost.id}`}>
                                <Button className="bg-emerald-600 hover:bg-emerald-700">
                                    Read More...
                                </Button>
                            </Link>
                        </div>
                        <div className="relative h-64 md:h-auto">
                            <Image
                                src={imageSrc}
                                alt={title}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
