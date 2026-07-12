import { baseApi } from "../baseApi";

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendSupportMessage: builder.mutation({
      query: (data) => ({
        url: "/support/send_support_message",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["support" as any],
    }),
  }),
});

export const { useSendSupportMessageMutation } = supportApi;
