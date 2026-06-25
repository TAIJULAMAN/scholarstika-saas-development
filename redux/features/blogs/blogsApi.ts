import { baseApi } from "../baseApi";

const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBlogs: builder.query({
            query: () => ({
                url: "blogs",
                method: "GET",
            }),
            providesTags: ["blog"],
        }),
        getSingleBlog: builder.query({
            query: (id: string) => ({
                url: `blogs/${id}`,
                method: "GET",
            }),
            providesTags: ["blog"],
        }),

    }),
});

export const { useGetAllBlogsQuery, useGetSingleBlogQuery } = blogApi;
