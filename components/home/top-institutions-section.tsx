"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin } from "lucide-react"
import { useGetAllSchoolListQuery } from "@/redux/features/subscription/subscriptionApi"
import { imgUrl } from "@/config/envConfig"
import ReactCountryFlag from "react-country-flag"

interface Institution {
    name: string;
    location: string;
    country: string;
    type: string;
    countryCode: string;
    description: string;
    image: string;
}

export function TopInstitutionsSection() {
    const countries = [
        { name: "Australia", count: 5, code: "au" },
        { name: "Bangladesh", count: 3, code: "bd" },
        { name: "China", count: 3, code: "cn" },
        { name: "Denmark", count: 3, code: "dk" },
        { name: "France", count: 5, code: "fr" },
        { name: "Belgium", count: 6, code: "be" },
        { name: "Portugal", count: 3, code: "pt" },
        { name: "England", count: 5, code: "gb-eng" },
        { name: "Germany", count: 4, code: "de" },
    ]

    const { data: schoolsResponse, isLoading } = useGetAllSchoolListQuery({});
    const fetchedSchools = schoolsResponse?.data?.data || [];

    const institutions: Institution[] = fetchedSchools.map((school: any) => ({
        name: school.schoolName,
        location: `${school.city}, ${school.country}`,
        country: school.country,
        type: school.schoolType ? school.schoolType.replace(/_/g, ' ') : '',
        countryCode: countries.find(c => c.name.toLowerCase() === school.country.toLowerCase())?.code || "",
        description: school.area ? `${school.area} area` : '',
        image: school.schoolPhoto ? `${imgUrl}/${school.schoolPhoto}` : "/university-campus.png",
    }));

    if (isLoading) {
        return (
            <section className="bg-emerald-600 py-12 text-white md:py-16">
                <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 text-center">
                    <p className="text-xl">Loading institutions...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-emerald-600 py-12 text-white md:py-16">
            <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
                {/* Heading */}
                <h2 className="mb-3 text-center text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl">
                    <span className="text-amber-400">Top Institutions</span> from different countries
                </h2>
                <p className="mb-8 text-center text-2xl font-bold sm:mb-12 sm:text-3xl md:text-4xl text-white/90">using our services</p>

                {/* Country Badges */}
                <div className="mb-8 space-y-2 sm:mb-12 sm:space-y-3">
                    {/* First Row - 4 Countries */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
                        {countries.slice(0, 4).map((country, idx) => (
                            <div
                                key={idx}
                                className="flex w-full items-center justify-start gap-3 rounded-full bg-white px-4 py-3 shadow-md transition-all hover:shadow-lg sm:w-auto sm:px-6 md:h-[80px] md:w-[314px] md:px-10 md:py-5"
                            >
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full sm:h-10 sm:w-10">
                                    <Image
                                        src={`https://flagcdn.com/w40/${country.code}.png`}
                                        alt={`${country.name} flag`}
                                        width={40}
                                        height={40}
                                        className="h-full w-full object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div className="text-left">

                                    <p className="text-xs font-bold text-gray-900 sm:text-sm">{country.name}</p>
                                    <p className="text-[10px] text-gray-600 sm:text-xs">{country.count} Institutions</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Second Row - 3 Countries */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
                        {countries.slice(4, 7).map((country, idx) => (
                            <div
                                key={idx + 4}
                                className="flex w-full items-center justify-start gap-3 rounded-full bg-white px-4 py-3 shadow-md transition-all hover:shadow-lg sm:w-auto sm:px-6 md:h-[80px] md:w-[314px]"
                            >
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full sm:h-10 sm:w-10">
                                    <Image
                                        src={`https://flagcdn.com/w40/${country.code}.png`}
                                        alt={`${country.name} flag`}
                                        width={40}
                                        height={40}
                                        className="h-full w-full object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-gray-900 sm:text-sm">{country.name}</p>
                                    <p className="text-[10px] text-gray-600 sm:text-xs">{country.count} Institutions</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Third Row - 2 Countries */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
                        {countries.slice(7, 9).map((country, idx) => (
                            <div
                                key={idx + 7}
                                className="flex w-full items-center justify-start gap-3 rounded-full bg-white px-4 py-3 shadow-md transition-all hover:shadow-lg sm:w-auto sm:px-6 md:h-[80px] md:w-[314px]"
                            >
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full sm:h-10 sm:w-10">
                                    <Image
                                        src={`https://flagcdn.com/w40/${country.code}.png`}
                                        alt={`${country.name} flag`}
                                        width={40}
                                        height={40}
                                        className="h-full w-full object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-bold text-gray-900 sm:text-sm">{country.name}</p>
                                    <p className="text-[10px] text-gray-600 sm:text-xs">{country.count} Institutions</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                {/* Institution Cards - Infinite Scroll */}
                <div className="relative mb-8 w-full overflow-hidden sm:mb-10">
                    {/* Gradient Overlays for fade effect */}
                    <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-emerald-600 to-transparent sm:w-20" />
                    <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-emerald-600 to-transparent sm:w-20" />

                    <div className="flex animate-infinite-scroll gap-4 hover:[animation-play-state:paused] sm:gap-6">
                        {/* First set of cards */}
                        {institutions.map((institution, idx) => (
                            <Card key={`first-${idx}`} className="group w-[280px] flex-shrink-0 overflow-hidden rounded-2xl transition-all duration-300 sm:w-[320px] md:w-[340px]">
                                {/* Image with Gradient Overlay */}
                                <div className="relative h-[160px] overflow-hidden sm:h-[180px] md:h-[200px]">
                                    <Image
                                        src={institution.image}
                                        alt={institution.name}
                                        // width={340}
                                        // height={70}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                    {/* Type Badge on Image */}
                                    <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
                                        <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-emerald-600 shadow-md backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-xs">
                                            {institution.type}
                                        </span>
                                    </div>
                                </div>

                                <CardContent className="p-4 sm:p-5 md:p-6">
                                    {/* Location Badge */}
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-gray-200 bg-gray-100">
                                            {institution.countryCode ? (
                                                <ReactCountryFlag
                                                    countryCode={institution.countryCode === "gb-eng" ? "GB" : institution.countryCode.toUpperCase()}
                                                    svg
                                                    style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        objectFit: 'cover'
                                                    }}
                                                    title={institution.country}
                                                />
                                            ) : (
                                                <MapPin className="h-4 w-4 text-emerald-600" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">{institution.location}</span>
                                    </div>

                                    {/* Institution Name */}
                                    <h3 className="mb-2 text-lg font-bold leading-tight text-gray-900 transition-colors group-hover:text-emerald-600 sm:mb-3 sm:text-xl">
                                        {institution.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-gray-600 sm:mb-5 sm:line-clamp-3 sm:text-sm">
                                        {institution.description}
                                    </p>

                                    {/* More Link with Arrow */}
                                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                        <Link href="/institutions/details">
                                            <Button
                                                variant="link"
                                                className="group/btn p-0 text-emerald-600 hover:text-emerald-700 font-semibold"
                                            >
                                                Learn More
                                                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Duplicate set for infinite scroll */}
                        {institutions.slice(0, 4).map((institution, idx) => (
                            <Card key={`second-${idx}`} className="group w-[280px] flex-shrink-0 overflow-hidden rounded-2xl border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 sm:w-[320px] md:w-[340px]">
                                {/* Image with Gradient Overlay */}
                                <div className="relative h-[160px] overflow-hidden sm:h-[180px] md:h-56">
                                    <Image
                                        src={institution.image}
                                        alt={institution.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                    {/* Type Badge on Image */}
                                    <div className="absolute right-4 top-4">
                                        <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold text-emerald-600 shadow-md backdrop-blur-sm">
                                            {institution.type}
                                        </span>
                                    </div>
                                </div>

                                <CardContent className="p-6">
                                    {/* Location Badge */}
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-gray-200 bg-gray-100">
                                            {institution.countryCode ? (
                                                <Image
                                                    src={`https://flagcdn.com/w40/${institution.countryCode}.png`}
                                                    alt={`${institution.country} flag`}
                                                    width={24}
                                                    height={24}
                                                    className="h-full w-full object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <MapPin className="h-4 w-4 text-emerald-600" />
                                            )}
                                        </div>
                                        <span className="text-sm font-medium text-gray-600">{institution.location}</span>
                                    </div>

                                    {/* Institution Name */}
                                    <h3 className="mb-3 text-xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-emerald-600">
                                        {institution.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-gray-600">
                                        {institution.description}
                                    </p>

                                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                        <Link href="/institutions/details">
                                            <Button
                                                variant="link"
                                                className="group/btn p-0 text-emerald-600 hover:text-emerald-700 font-semibold"
                                            >
                                                Learn More
                                                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
