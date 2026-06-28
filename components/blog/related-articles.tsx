import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"
import { relatedArticles } from "@/data/blog-posts"
import { BlogItem } from "@/redux/features/blogs/blogsApi"
import { imgUrl } from "@/config/envConfig"

interface RelatedArticlesProps {
    posts: BlogItem[];
    isLoading?: boolean;
}

const GridSkeleton = () => (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
        {[1, 2, 3].map((n) => (
            <Card key={n} className="overflow-hidden border border-gray-100 bg-white shadow-md p-6 space-y-4">
                <div className="h-48 bg-gray-200 rounded w-full" />
                <div className="h-5 bg-gray-200 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="flex gap-4 pt-2">
                    <div className="h-3 bg-gray-200 rounded w-12" />
                    <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
                <div className="h-10 bg-gray-100 rounded w-full pt-4" />
            </Card>
        ))}
    </div>
)

export function RelatedArticles({ posts, isLoading }: RelatedArticlesProps) {
    const displayPosts = posts.length > 0 ? posts : relatedArticles;

    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-5 lg:px-0">
                <div className="mb-10 flex items-center gap-2">
                    <span className="bg-amber-500 px-3 py-1 text-sm font-bold text-white">Related</span>
                    <span className="text-gray-600">Articles</span>
                </div>

                {isLoading ? (
                    <GridSkeleton />
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {displayPosts.map((post) => {
                            const title = post.title;
                            const category = 'blogCategory' in post ? post.blogCategory : post.category;
                            const imageSrc = 'photo' in post ? `${imgUrl}/${post.photo}` : post.image;
                            const author = 'author' in post ? post.author : "Admin";
                            const readTime = 'readTime' in post ? post.readTime : "5 min. to read";

                            let dateStr = "Recently";
                            if ('createdAt' in post) {
                                try {
                                    dateStr = new Date(post.createdAt).toLocaleDateString("en-US", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric"
                                    });
                                } catch {
                                    dateStr = "Recently";
                                }
                            } else if ('date' in post) {
                                dateStr = post.date;
                            }

                            return (
                                <Card key={post.id} className="overflow-hidden transition-all hover:shadow-lg bg-white">
                                    <div className="relative h-48">
                                        <Image
                                            src={imageSrc}
                                            alt={title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="mb-3 flex items-center gap-2">
                                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                {category}
                                            </span>
                                        </div>

                                        <h3 className="mb-3 text-xl font-bold text-gray-900 line-clamp-2">
                                            {title}
                                        </h3>

                                        {/* Meta Info */}
                                        <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                <span>{author}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>{dateStr}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{readTime}</span>
                                            </div>
                                        </div>

                                        <Link href={`/blog/details?id=${post.id}`}>
                                            <Button variant="outline" className="w-full">
                                                Read more
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}

                {/* See All Articles Button */}
                <div className="mt-12 text-center">
                    <Link href="/blog">
                        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                            See all Articles
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
