import { baseApi } from "../baseApi";

const vehiclesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVehicles: builder.query({
      query: () => ({
        url: `vehicles`,
        method: "GET",
      }),
      providesTags: ["vehicles"],
    }),
  }),
});

export const { useGetVehiclesQuery } = vehiclesApi;
