import { baseApi } from "../baseApi";

export interface TeamMember {
    id: string;
    name: string;
    designation: string;
    linkedInUrl: string;
    whatsAppNumber: string;
    photo: string;
    createdAt: string;
    updatedAt: string;
}

export interface TeamResponse {
    success: boolean;
    message: string;
    data: {
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
        result: TeamMember[];
    };
}

const teamApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTeam: builder.query<TeamResponse, void>({
            query: () => ({
                url: "landing_page/find_by_team",
                method: "GET",
            }),
            providesTags: ["team"],
        }),
    }),
});

export const { useGetTeamQuery } = teamApi;
