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
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      let token = state?.auth?.token;

      if (!token && typeof window !== "undefined") {
        token = localStorage.getItem("token") || localStorage.getItem("accessToken");
      }

      if (token) {
        const authValue = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
        console.log("==> baseApi attaching header:", authValue);
        headers.set("Authorization", authValue);
      } else {
        console.log("==> baseApi WARNING: No token found in Redux or localStorage!");
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
    "faq"
  ],
});
