"use client";

import Image from "next/image";
import { useGetVisionQuery } from "@/redux/features/vision/visionApi";

const SkeletonParagraphs = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-full" />
    <div className="h-4 bg-gray-200 rounded w-full pt-2" />
    <div className="h-4 bg-gray-200 rounded w-5/6" />
    <div className="h-4 bg-gray-200 rounded w-11/12" />
    <div className="h-4 bg-gray-200 rounded w-full pt-4" />
    <div className="h-4 bg-gray-200 rounded w-4/5" />
  </div>
);

export function VisionSection() {
  const { data: visionResponse, isLoading } = useGetVisionQuery();
  const dynamicVision = visionResponse?.data?.vision;

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16 md:py-20">
      <div className="container mx-auto px-5 lg:px-0">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
            Our{" "}
            <span className="relative inline-block">
              Vision
              <span className="absolute -bottom-2 left-0 h-1 w-full bg-amber-400"></span>
            </span>
          </h2>
        </div>
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 to-cyan-50 shadow-xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="relative h-[300px] lg:h-auto">
              <Image
                src="/vision.png"
                alt="Global Education Vision"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8 lg:p-12">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 shadow-lg">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>

              <h3 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl">
                A Connected Global Education Ecosystem
              </h3>
              <div className="space-y-4 text-gray-700">
                {isLoading ? (
                  <SkeletonParagraphs />
                ) : dynamicVision ? (
                  <p className="leading-relaxed whitespace-pre-wrap">
                    {dynamicVision}
                  </p>
                ) : (
                  <p className="leading-relaxed">
                    Our vision is to build a future where schools of every size,
                    especially growing and lower-income institutions, are
                    empowered to embrace digital transformation through
                    accessible, dependable, and modern school management
                    technology. We envision an educational environment where
                    school operations are more connected, communication is
                    stronger, administration is more efficient, and institutions
                    are better equipped to serve students, parents, and staff in a
                    rapidly changing world.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
