import { baseApi } from "../baseApi";

export interface FaqItem {
    id: string;
    question: string;
    answer: string;
    isDelete: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FaqResponse {
    success: boolean;
    message: string;
    data: {
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
        result: FaqItem[];
    };
}

const faqApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getFaqs: builder.query<FaqResponse, void>({
            query: () => ({
                url: "landing_page/find_by_all_faq",
                method: "GET",
            }),
            providesTags: ["faq"],
        }),
    }),
});

export const { useGetFaqsQuery } = faqApi;
