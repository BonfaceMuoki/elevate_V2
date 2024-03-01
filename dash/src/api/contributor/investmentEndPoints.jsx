import { apiSlice } from "../../featuers/apiSlice";
import { useSelector } from "react-redux";


export const investmentEndPoints = apiSlice.injectEndpoints({

    endpoints: builder => ({
        sendInvestment: builder.mutation({
            query: (formData) => ({
                url: '/api/contributor/invest',
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            })
        }),
        getMyInvestments: builder.query({
            query: () => `/api/contributor/get-my-investments`,
            skipCache: true,
            keepUnusedDataFor: 5,
            refetchOnFocus: true,
        }),
        getMyDashboard: builder.query({
            query: (user) => `/api/contributor/get-my-dashboard?user=${user}`,
            skipCache: true,
            keepUnusedDataFor: 5,
            refetchOnFocus: true,
        }),
        getMyProfileData: builder.query({
            query: (user) => `/api/contributor/get-my-profile-data?user=${user}`,
            skipCache: true,
            keepUnusedDataFor: 5,
            refetchOnFocus: true,
        })
    })
})

export const {
    useSendInvestmentMutation, useGetMyInvestmentsQuery, useGetMyDashboardQuery, useGetMyProfileDataQuery
} = investmentEndPoints;