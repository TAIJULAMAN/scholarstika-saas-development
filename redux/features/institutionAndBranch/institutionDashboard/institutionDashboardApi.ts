import { baseApi } from "../../baseApi";

const institutionDashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTotalCountOfInstitution: builder.query<any, string>({
            query: (subscriptionId: string) => ({
                url: `branch_management/branch_management_total_count/${subscriptionId}`,
                method: "GET",
            }),
            providesTags: ["institutionDashboard"],
        }),

        getStudentGrowth: builder.query<any, { year: string }>({
            query: ({ year }) => ({
                url: `branch_management/student_growth`,
                params: { year },
                method: "GET",
            }),
            providesTags: ["institutionDashboard"],
        }),
        getEarningGrowth: builder.query<any, { year: string }>({
            query: ({ year }) => ({
                url: `branch_management/earning_growth`,
                params: { year },
                method: "GET",
            }),
            providesTags: ["institutionDashboard"],
        }),
    }),
});

export const { useGetTotalCountOfInstitutionQuery, useGetStudentGrowthQuery, useGetEarningGrowthQuery } = institutionDashboardApi;
