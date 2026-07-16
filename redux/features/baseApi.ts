import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../config/envConfig";

interface RootState {
  auth: {
    token: string | null;
  };
}

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      let token = state?.auth?.token;

      if (!token && typeof window !== "undefined") {
        token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      }

      if (token) {
        const authValue = token.startsWith("Bearer ") ? token : `${token}`;
        headers.set("Authorization", authValue);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "auth",
    "blog",
    "contact",
    "newsletter",
    "review",
    "vehicles",
    "faq",
    "mission",
    "vision",
    "team",
    "branchManagement",
    "branchUsers",
    "announcements",
    "testimonials",
    "assignments",
    "teacherRecordings",
    "teacherStudents",
    "institutionDashboard",
    "mySubscription",
    "earnings",
    "teacherSchedule",
    "teacherAttendance",
    "student",
    "teacher",
    "support",
    "sectionAndClasses",
    "branchAdmin"
  ],
});
