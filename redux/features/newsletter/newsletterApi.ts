import { baseApi } from "../baseApi";

const newsletterApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        subscribe: builder.mutation({
            query: (data) => {
                // console.log("Data being sent to the API:", data);
                return {
                    url: "newsletters",
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ["newsletter"],
        })
    }),
});

export const {
    useSubscribeMutation,
} = newsletterApi;

export default newsletterApi;
