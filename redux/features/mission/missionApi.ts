import { baseApi } from "../baseApi";

export interface MissionData {
    id: string;
    mission: string;
    createdAt: string;
    updatedAt: string;
}

export interface MissionResponse {
    success: boolean;
    message: string;
    data: MissionData;
}

const missionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMission: builder.query<MissionResponse, void>({
            query: () => ({
                url: "landing_page/find_by_mission",
                method: "GET",
            }),
            providesTags: ["mission"],
        }),
    }),
});

export const { useGetMissionQuery } = missionApi;
