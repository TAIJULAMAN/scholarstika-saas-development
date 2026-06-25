import { baseApi } from "../baseApi";

const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllReview: builder.query({
            query: () => ({
                url: "reviews/service-all-reviews",
                method: "GET",
            }),
            providesTags: ["review"],
        }),

    }),
});

export const { useGetAllReviewQuery } = reviewApi;
