import { baseApi } from "../../baseApi";

const earningsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBranchTotalEarnings: builder.query<any, void>({
            query: () => ({
                url: "fees/branch_total_earning",
                method: "GET",
            }),
            providesTags: ["earnings"] as any,
        }),
    }),
});

export const { useGetBranchTotalEarningsQuery } = earningsApi;
