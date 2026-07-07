import { baseApi } from "../baseApi";

const testimonialsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTestimonials: builder.query({
            query: () => ({
                url: "testimonials/find_by_all_testimonials",
                method: "GET",
            }),
            providesTags: ["testimonials"],
        }),
    }),
});

export const { useGetAllTestimonialsQuery } = testimonialsApi;
