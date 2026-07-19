import { baseApi } from "../../baseApi";


const studentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllStudents: builder.query<any, string>({
            query: (subscriptionId) => ({
                url: `students/find-specific-institution-all-students/${subscriptionId}`,
                method: "GET",
            }),
            providesTags: ["announcements"],
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

export const { useGetAllStudentsQuery } = studentApi;
