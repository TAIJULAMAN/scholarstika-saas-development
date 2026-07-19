import { baseApi } from "../../baseApi";


const supportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSupport: builder.mutation<any, any>({
            query: (body) => ({
                url: `announcement/send_new_announcement`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["support"],
        })
    }),
});

export const { useCreateSupportMutation } = supportApi;
