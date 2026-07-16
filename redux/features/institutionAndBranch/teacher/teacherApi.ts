import { baseApi } from "../../baseApi";


const teacherApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTeachers: builder.query<any, void>({
            query: () => ({
                url: `teacher/find-specific-institution-all-teachers`,
                method: "GET",
            }),
            providesTags: ["teacher"],
        }),
        // deleteAnnouncement: builder.mutation<any, string>({
        //     query: (id: string) => ({
        //         url: `announcement/delete_announcements/${id}`,
        //         method: "DELETE",
        //     }),
        //     invalidatesTags: ["announcements"],
        // }),
        // updateAnnouncement: builder.mutation<any, { id: string; data: any }>({
        //     query: ({ id, data }) => ({
        //         url: `announcement/update_announcement/${id}`,
        //         method: "PATCH",
        //         body: data,
        //     }),
        //     invalidatesTags: ["announcements"],
        // }),
        // createAnnouncement: builder.mutation<any, any>({
        //     query: (body) => ({
        //         url: `announcement/send_new_announcement`,
        //         method: "POST",
        //         body,
        //     }),
        //     invalidatesTags: ["announcements"],
        // }),


    }),
});

export const { useGetAllTeachersQuery } = teacherApi;
