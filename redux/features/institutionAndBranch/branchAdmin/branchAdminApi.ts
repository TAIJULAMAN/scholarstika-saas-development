import { baseApi } from "../../baseApi";

const branchAdminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBranchAdminDetails: builder.query<any, void>({
            query: () => ({
                url: "branch_management/find_my_all_branch_admin",
                method: "GET",
            }),
            providesTags: ["branchAdmin"],
        })
    }),
});

export const {
    useGetBranchAdminDetailsQuery
} = branchAdminApi;

export default branchAdminApi;
