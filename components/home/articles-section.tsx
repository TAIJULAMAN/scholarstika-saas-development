"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { useGetAllBlogsQuery } from "@/redux/features/blogs/blogsApi";
import { imgUrl } from "@/config/envConfig";

const ArticleSkeleton = () => (
  <Card className="group h-full overflow-hidden border-none bg-white shadow-lg animate-pulse p-6 space-y-4">
    <div className="h-56 bg-gray-200 rounded w-full" />
    <div className="flex gap-4 items-center pt-2">
      <div className="h-10 w-10 bg-gray-200 rounded-full" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
    </div>
    <div className="h-6 bg-gray-200 rounded w-full" />
    <div className="h-4 bg-gray-200 rounded w-5/6" />
    <div className="h-6 bg-gray-100 rounded w-32 pt-2" />
  </Card>
);

export function ArticlesSection() {
  const { data: blogResponse, isLoading } = useGetAllBlogsQuery();

  const staticArticles = [
    {
      id: "b1",
      image: "/articles/b1.png",
      author: "Sarah Johnson",
      authorImage: "/people/sarah.png",
      date: "April 20, 2025",
      readTime: "5 min read",
      category: "Education Technology",
      title: "Why Modern Schools Need One Connected Management System?",
      description:
        "Discover how modern school management systems are revolutionizing education administration, improving communication, and enhancing student outcomes across institutions worldwide.",
    },
    {
      id: "b2",
      image: "/articles/b2.png",
      author: "Michael Chen",
      authorImage: "/people/mike.png",
      date: "April 18, 2025",
      readTime: "7 min read",
      category: "Best Practices",
      title: "10 Ways to Improve Parent-Teacher Communication",
      description:
        "Learn effective strategies for building stronger connections between parents and teachers using digital tools, regular updates, and transparent communication channels.",
    },
    {
      id: "b3",
      image: "/articles/b3.png",
      author: "Lisa Anderson",
      authorImage: "/people/lisa.png",
      date: "April 15, 2025",
      readTime: "6 min read",
      category: "Student Success",
      title: "Data-Driven Insights for Better Student Performance",
      description:
        "Explore how analytics and real-time data tracking can help educators identify learning gaps, personalize instruction, and improve overall student achievement.",
    },
  ];

  const blogs = blogResponse?.data?.result || [];
  const latestBlogs = blogs.slice(0, 3);
  const displayArticles = latestBlogs.length > 0 ? latestBlogs : staticArticles;

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-5 lg:px-0">
        {/* Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
              Latest <span className="text-emerald-600">Insights</span>
            </h2>
            <p className="text-base text-gray-600 md:text-lg">
              Explore practical insights on digital school management, fee
              tracking, parent communication, academic operations, and modern
              education technology.
            </p>
          </div>
          <Link href="/blog">
            <Button className="group bg-emerald-600 hover:bg-emerald-700">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {isLoading ? (
            <>
              <ArticleSkeleton />
              <ArticleSkeleton />
              <ArticleSkeleton />
            </>
          ) : (
            displayArticles.map((article) => {
              const title = article.title;
              const category = 'blogCategory' in article ? article.blogCategory : article.category;
              const excerpt = article.description;
              const imageSrc = 'photo' in article ? `${imgUrl}/${article.photo}` : article.image;
              const author = 'author' in article ? article.author : "Admin";
              const authorImage = 'authorImage' in article ? article.authorImage : null;
              const readTime = 'readTime' in article ? article.readTime : "5 min read";

              let dateStr = "Recently";
              if ('createdAt' in article) {
                try {
                  dateStr = new Date(article.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                  });
                } catch {
                  dateStr = "Recently";
                }
              } else if ('date' in article) {
                dateStr = article.date;
              }

              return (
                <Link href={`/blog/details?id=${article.id}`} key={article.id}>
                  <Card className="group h-full overflow-hidden border-none bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    {/* Article Image */}
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute left-4 top-4">
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
                          {category}
                        </Badge>
                      </div>

                      {/* Read Time Badge */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
                        <Clock className="h-3 w-3" />
                        {readTime}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Author & Date */}
                      <div className="mb-4 flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-emerald-100 bg-gray-200">
                          {authorImage ? (
                            <Image
                              src={authorImage}
                              alt={author}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <User className="h-full w-full p-2 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {author}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {dateStr}
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="mb-3 text-xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-emerald-600 line-clamp-2">
                        {title}
                      </h3>

                      {/* Description */}
                      <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
                        {excerpt}
                      </p>

                      {/* Read More Link */}
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors group-hover:text-emerald-700">
                        Read Article
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>

                      {/* Decorative Bottom Border */}
                      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
