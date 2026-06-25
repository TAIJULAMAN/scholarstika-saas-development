import { baseApi } from "../baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (data) => {
        // console.log("Data being sent to the API:", data);
        return {
          url: "auth/create-user",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth"],
    }),
    logIn: builder.mutation({
      query: (data) => {
        console.log("Data being sent to the API:", data);
        return {
          url: "auth/login",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth"],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "admin/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "admin/otp-verify",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ newPassword, confirmPassword, email }) => ({
        url: "admin/reset-password",
        method: "POST",
        body: { newPassword, confirmPassword, email },
      }),

      invalidatesTags: ["auth"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "auth/change-password",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useSignUpMutation,
  useLogInMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;

export default authApi;
