import { baseApi } from "../baseApi";

export interface VisionData {
    id: string;
    vision: string;
    createdAt: string;
    updatedAt: string;
}

export interface VisionResponse {
    success: boolean;
    message: string;
    data: VisionData;
}

const visionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getVision: builder.query<VisionResponse, void>({
            query: () => ({
                url: "landing_page/find_by_vision",
                method: "GET",
            }),
            providesTags: ["vision"],
        }),
    }),
});

export const { useGetVisionQuery } = visionApi;
