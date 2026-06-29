"use client";

import Image from "next/image";
import { useGetTeamQuery } from "@/redux/features/team/teamApi";
import { imgUrl } from "@/config/envConfig";

const TeamSkeleton = () => (
  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
    {[1, 2, 3, 4].map((n) => (
      <div key={n} className="rounded-2xl bg-white p-6 shadow-md border border-gray-100 space-y-4">
        <div className="aspect-square w-full bg-gray-200 rounded-xl" />
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-8 w-8 bg-gray-200 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export function TeamSection() {
  const { data: teamResponse, isLoading } = useGetTeamQuery();
  const dynamicTeam = teamResponse?.data?.result || [];

  const staticTeam = [
    {
      id: "t1",
      name: "Sarah Mitchell",
      designation: "CEO & Founder",
      photo: "/akoson.png",
      linkedInUrl: "#",
      whatsAppNumber: "#",
      bgColor: "bg-purple-100 text-purple-600 hover:bg-purple-200"
    },
    {
      id: "t2",
      name: "Michael Chen",
      designation: "CTO & Co-Founder",
      photo: "/chen.png",
      linkedInUrl: "#",
      whatsAppNumber: "#",
      bgColor: "bg-blue-100 text-blue-600 hover:bg-blue-200"
    },
    {
      id: "t3",
      name: "David Rodriguez",
      designation: "Head of Product",
      photo: "/david.png",
      linkedInUrl: "#",
      whatsAppNumber: "#",
      bgColor: "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
    },
    {
      id: "t4",
      name: "Emily Watson",
      designation: "Educator",
      photo: "/emily.png",
      linkedInUrl: "#",
      whatsAppNumber: "#",
      bgColor: "bg-amber-100 text-amber-600 hover:bg-amber-200"
    }
  ];

  const displayTeam = dynamicTeam.length > 0 ? dynamicTeam : staticTeam;

  const getThemeClass = (idx: number) => {
    const themes = [
      "bg-purple-100 text-purple-600 hover:bg-purple-200",
      "bg-blue-100 text-blue-600 hover:bg-blue-200",
      "bg-emerald-100 text-emerald-600 hover:bg-emerald-200",
      "bg-amber-100 text-amber-600 hover:bg-amber-200"
    ];
    return themes[idx % themes.length];
  };

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="mb-4 text-center text-4xl font-bold text-gray-900 md:text-5xl">
          Meet{" "}
          <span className="relative">
            Our
            <span className="absolute bottom-0 left-0 h-1 w-full bg-amber-400"></span>
          </span>{" "}
          Team
        </h2>
        <p className="mb-12 text-center text-gray-600">
          A group of educators, designers, engineers, and innovators dedicated
          to transforming education.
        </p>

        {isLoading ? (
          <TeamSkeleton />
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {displayTeam.map((member, idx) => {
              const name = member.name;
              const designation = member.designation;
              const imageSrc = 'createdAt' in member ? `${imgUrl}/${member.photo}` : member.photo;
              const linkedInUrl = member.linkedInUrl || "#";
              const whatsAppNumber = member.whatsAppNumber || "#";
              const themeClass = 'bgColor' in member ? member.bgColor : getThemeClass(idx);

              return (
                <div key={member.id} className="group rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-xl border border-gray-50">
                  <div className="mb-4 overflow-hidden rounded-xl">
                    <Image
                      src={imageSrc}
                      alt={name}
                      width={300}
                      height={300}
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mb-1 text-xl font-bold text-gray-900">
                    {name}
                  </h3>
                  <p className="mb-3 text-sm text-gray-600">{designation}</p>
                  <div className="flex gap-2">
                    {linkedInUrl && (
                      <a
                        href={linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${themeClass}`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                    {whatsAppNumber && (
                      <a
                        href={whatsAppNumber.startsWith("http") ? whatsAppNumber : `https://wa.me/${whatsAppNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${themeClass}`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
