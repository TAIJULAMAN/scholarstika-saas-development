import { baseApi } from "../../baseApi";


const sectionClassesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllSectionsAndClasses: builder.query<any, void>({
            query: () => ({
                url: `branch_management/section_and_classes`,
                method: "GET",
            }),
            providesTags: ["sectionAndClasses"],
        }),



    }),
});

export const { useGetAllSectionsAndClassesQuery } = sectionClassesApi;
