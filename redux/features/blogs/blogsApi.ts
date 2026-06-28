import { baseApi } from "../baseApi";

export interface BlogItem {
    id: string;
    blogCategory: string;
    photo: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface BlogResponse {
    success: boolean;
    message: string;
    data: {
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
        result: BlogItem[];
    };
}

const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBlogs: builder.query<BlogResponse, void>({
            query: () => ({
                url: "landing_page/find_by_all_blogs",
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
