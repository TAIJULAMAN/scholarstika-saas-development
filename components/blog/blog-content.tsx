import { SocialShare } from "../common/social-share"

interface BlogContentProps {
    content: string;
}

export function BlogContent({ content }: BlogContentProps) {
    return (
        <section className="bg-white py-12">
            <div className="container mx-auto px-5 lg:px-0">
                <div className="mx-auto max-w-4xl">
                    {/* Excerpt/Content */}
                    <p className="mb-8 text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                        {content}
                    </p>

                    <SocialShare />
                </div>
            </div>
        </section>
    )
}
