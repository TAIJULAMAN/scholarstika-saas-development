import { baseApi } from "../baseApi";

type ListParams = {
  page: number;
  limit: number;
  searchTerm?: string;
  className?: string;
  role?: string;
};

const branchUsersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBranchStudents: builder.query({
      query: ({ page, limit, searchTerm, className }: ListParams) => ({
        url: "students/find-specific-branch-all-students",
        method: "GET",
        params: {
          page,
          limit,
          ...(searchTerm ? { searchTerm } : {}),
          ...(className && className !== "all" ? { className } : {}),
        },
      }),
      providesTags: ["branchUsers"],
    }),
    createBranchStudent: builder.mutation({
      query: (data) => ({
        url: "students/create-student",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["branchUsers"],
    }),
    updateBranchStudent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `students/update-student/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["branchUsers"],
    }),
    deleteBranchStudent: builder.mutation({
      query: (id: string) => ({
        url: `students/delete-student/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["branchUsers"],
    }),
    getBranchTeachers: builder.query({
      query: ({ page, limit, searchTerm }: ListParams) => ({
        url: "teacher/find-specific-branch-all-teachers",
        method: "GET",
        params: {
          page,
          limit,
          ...(searchTerm ? { searchTerm } : {}),
        },
      }),
      providesTags: ["branchUsers"],
    }),
    createBranchTeacher: builder.mutation({
      query: (data) => ({
        url: "teacher/create-teacher",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["branchUsers"],
    }),
    updateBranchTeacher: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `teacher/update-teacher/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["branchUsers"],
    }),
    deleteBranchTeacher: builder.mutation({
      query: (id: string) => ({
        url: `teacher/delete-teacher/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["branchUsers"],
    }),
    getBranchStaffMembers: builder.query({
      query: ({ page, limit, searchTerm, role }: ListParams) => ({
        url: "staff_management/find_by_all_staff_management",
        method: "GET",
        params: {
          page,
          limit,
          ...(searchTerm ? { searchTerm } : {}),
          ...(role && role !== "all" ? { role } : {}),
        },
      }),
      providesTags: ["branchUsers"],
    }),
    createBranchStaffMember: builder.mutation({
      query: (data) => ({
        url: "staff_management/create_new_staff",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["branchUsers"],
    }),
    updateBranchStaffMember: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `staff_management/update_profile/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["branchUsers"],
    }),
    deleteBranchStaffMember: builder.mutation({
      query: (id: string) => ({
        url: `staff_management/delete_staff/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["branchUsers"],
    }),
  }),
});

export const {
  useGetBranchStudentsQuery,
  useCreateBranchStudentMutation,
  useUpdateBranchStudentMutation,
  useDeleteBranchStudentMutation,
  useGetBranchTeachersQuery,
  useCreateBranchTeacherMutation,
  useUpdateBranchTeacherMutation,
  useDeleteBranchTeacherMutation,
  useGetBranchStaffMembersQuery,
  useCreateBranchStaffMemberMutation,
  useUpdateBranchStaffMemberMutation,
  useDeleteBranchStaffMemberMutation,
} = branchUsersApi;

export default branchUsersApi;
