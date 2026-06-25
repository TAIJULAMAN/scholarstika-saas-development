import { baseApi } from "../baseApi";

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    contact: builder.mutation({
      query: (data) => {
        return {
          url: "customer-contacts",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["contact"],
    }),
  }),
});

export const { useContactMutation } = contactApi;

export default contactApi;
