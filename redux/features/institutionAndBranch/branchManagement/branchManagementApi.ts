import { baseApi } from "../../baseApi";


const branchManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBranches: builder.query<any, void>({
            query: () => ({
                url: `branch_management/institution_branch_options`,
                method: "GET",
            }),
            providesTags: ["teacher"],
        }),
    }),
});

export const { useGetAllBranchesQuery } = branchManagementApi;
