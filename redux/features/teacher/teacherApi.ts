import { baseApi } from "../baseApi";

export const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeacherRecordings: builder.query({
      query: (params) => ({
        url: "/teacher/find_by_specific_student_class_recording_of_teacher",
        method: "GET",
        params,
      }),
      providesTags: ["teacherRecordings"],
    }),
    getTeacherStudents: builder.query({
      query: (params) => ({
        url: "/teacher/find_by_specific_student_listOf_teacher",
        method: "GET",
        params,
      }),
      providesTags: ["teacherStudents"],
    }),
    getTeacherSchedule: builder.query({
      query: (params) => ({
        url: "/teacher/find_by_specific_class_listOf_teacher",
        method: "GET",
        params,
      }),
      providesTags: ["teacherSchedule"],
    }),
  }),
});

export const { useGetTeacherRecordingsQuery, useGetTeacherStudentsQuery, useGetTeacherScheduleQuery } = teacherApi;
