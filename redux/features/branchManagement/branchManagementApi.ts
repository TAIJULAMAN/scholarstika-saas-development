import { baseApi } from "../baseApi";

const branchManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInstitutionBranchOptions: builder.query({
      query: () => ({
        url: "branch_management/institution_branch_options",
        method: "GET",
      }),
      providesTags: ["branchManagement"],
    }),
    getMyBranchAdmins: builder.query({
      query: ({
        page,
        limit,
        searchTerm,
      }: {
        page: number;
        limit: number;
        searchTerm?: string;
      }) => ({
        url: "branch_management/find_my_all_branch_admin",
        method: "GET",
        params: {
          page,
          limit,
          ...(searchTerm ? { searchTerm } : {}),
        },
      }),
      providesTags: ["branchManagement"],
    }),
    createBranchAdmin: builder.mutation({
      query: (data) => ({
        url: "branch_management/create_branch_admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["branchManagement"],
    }),
    updateBranchAdmin: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `branch_management/update_branch_admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["branchManagement"],
    }),
    deleteBranchAdmin: builder.mutation({
      query: (id: string) => ({
        url: `branch_management/delete_branch_admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["branchManagement"],
    }),
    getInstitutionBranchStats: builder.query({
      query: (branchId?: string) => ({
        url: "branch_management/institution_branch_stats",
        method: "GET",
        params: branchId ? { branchId } : undefined,
      }),
      providesTags: ["branchManagement"],
    }),
    getInstitutionBranches: builder.query({
      query: ({
        branchId,
        page,
        limit,
      }: {
        branchId?: string;
        page: number;
        limit: number;
      }) => ({
        url: "branch_management/institution_branches",
        method: "GET",
        params: {
          ...(branchId && branchId !== "all" ? { branchId } : {}),
          page,
          limit,
        },
      }),
      providesTags: ["branchManagement"],
    }),
    createInstitutionBranch: builder.mutation({
      query: (data) => ({
        url: "branch_management/institution_branches",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["branchManagement"],
    }),
    updateInstitutionBranch: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `branch_management/institution_branches/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["branchManagement"],
    }),
    deleteInstitutionBranch: builder.mutation({
      query: (id: string) => ({
        url: `branch_management/institution_branches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["branchManagement"],
    }),
    overrideInstitutionBranchPrice: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `branch_management/institution_branches/${id}/override_price`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["branchManagement"],
    }),
  }),
});

export const {
  useGetInstitutionBranchOptionsQuery,
  useGetMyBranchAdminsQuery,
  useCreateBranchAdminMutation,
  useUpdateBranchAdminMutation,
  useDeleteBranchAdminMutation,
  useGetInstitutionBranchStatsQuery,
  useGetInstitutionBranchesQuery,
  useCreateInstitutionBranchMutation,
  useUpdateInstitutionBranchMutation,
  useDeleteInstitutionBranchMutation,
  useOverrideInstitutionBranchPriceMutation,
} = branchManagementApi;

export default branchManagementApi;
