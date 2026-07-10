import { baseApi } from "../baseApi";

const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    contact: builder.mutation({
      query: (data) => {
        return {
          url: "contact/create_contact",
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
