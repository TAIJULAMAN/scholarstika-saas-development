import { baseApi } from "../../baseApi";
import { jwtDecode } from "jwt-decode";
import { setSubscriptionId } from "../../../Slice/authSlice";

const mySubscriptionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMySubscription: builder.query<any, any>({
            query: () => ({
                url: "subscription/find_my_all_subscription",
                method: "GET",
            }),
            providesTags: ["mySubscription"],
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    let subId = data?.data?.id;

                    if (subId) {
                        dispatch(setSubscriptionId(subId));
                    } else {
                        const token = data?.data?.currentSubscriptionToken;
                        if (token && typeof token === 'string') {
                            const decoded: any = jwtDecode(token);
                            if (decoded?.subscriptionId) {
                                dispatch(setSubscriptionId(decoded.subscriptionId));
                            }
                        }
                    }
                } catch (error) {
                    console.error("Failed to parse or decode subscription info", error);
                }
            },
        }),
    }),
});

export const { useGetMySubscriptionQuery } = mySubscriptionApi;
