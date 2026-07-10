import { baseApi } from "../baseApi";

export const assignmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSpecificTeacherAssignments: builder.query({
      query: (params) => ({
        url: "/assignments/find_by_specific_teacher_assignment",
        method: "GET",
        params,
      }),
      providesTags: ["assignments"],
    }),
    updateTeacherAssignment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/assignments/update_teacher_assignment/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["assignments"],
    }),
  }),
});

export const { useGetSpecificTeacherAssignmentsQuery, useUpdateTeacherAssignmentMutation } = assignmentsApi;
