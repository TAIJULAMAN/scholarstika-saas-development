import { baseApi } from "../baseApi";

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (data) => ({
        url: "stripe/create-checkout-session",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
    getMyPaymentStatus: builder.query({
      query: () => ({
        url: "subscription/my_payment_status",
        method: "GET",
      }),
      providesTags: ["auth"],
    }),
  }),
});

export const { useCreateCheckoutSessionMutation, useGetMyPaymentStatusQuery } = subscriptionApi;

export default subscriptionApi;
