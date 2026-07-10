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
    getTeacherAttendance: builder.query({
      query: (classLevelId: string) => ({
        url: `/teacher/find_by_specific_student_attendance_of_teacher/${classLevelId}`,
        method: "GET",
      }),
      providesTags: ["teacherAttendance"],
    }),
    updateTeacherAttendance: builder.mutation({
      query: (data) => ({
        url: "/teacher/update_student_attendance_of_teacher",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["teacherAttendance"],
    }),
  }),
});

export const { 
  useGetTeacherRecordingsQuery, 
  useGetTeacherStudentsQuery, 
  useGetTeacherScheduleQuery,
  useGetTeacherAttendanceQuery,
  useUpdateTeacherAttendanceMutation
} = teacherApi;
