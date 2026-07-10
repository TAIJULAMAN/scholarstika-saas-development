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
    getSpecificTeacherClassMaterial: builder.query({
      query: (classId) => ({
        url: `/assignments/find_by_specific_teacher_class_material/${classId}`,
        method: "GET",
      }),
      providesTags: ["assignments"],
    }),
    deleteClassMaterials: builder.mutation({
      query: (id) => ({
        url: `/assignments/delete_class_materials/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["assignments"],
    }),
    updateSpecificClassMaterial: builder.mutation({
      query: ({ id, data }) => ({
        url: `/assignments/update_specific_class_material/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["assignments"],
    }),
    createClassMaterials: builder.mutation({
      query: (data) => ({
        url: "/assignments/create_class_materials",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["assignments"],
    }),
  }),
});

export const { 
  useGetSpecificTeacherAssignmentsQuery, 
  useUpdateTeacherAssignmentMutation, 
  useGetSpecificTeacherClassMaterialQuery,
  useDeleteClassMaterialsMutation,
  useUpdateSpecificClassMaterialMutation,
  useCreateClassMaterialsMutation
} = assignmentsApi;
