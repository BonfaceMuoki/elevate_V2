import { apiSlice } from "../../featuers/apiSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        requestAccesorAccess: builder.mutation({
            query: credentials => ({
                url: '/api/auth/login',
                method: 'POST',
                body: { ...credentials },
                headers: {
                    'Accept': 'Application/json'
                  }  
            })
        }),
        sendUserInvite: builder.mutation({
            query: (formData) => ({
                url: '/api/auth/invite-user',
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                  }  
            })
        }),
        getMyInvites: builder.query({
            query: () => `/api/contributor/get-my-invites`,
            skipCache: true,
            keepUnusedDataFor:5,
            refetchOnFocus: true,
        }),
        login: builder.mutation({
            query: credentials => ({
                url: '/api/auth/login',
                method: 'POST',
                body: { ...credentials },
                headers: {
                    'Accept': 'Application/json'
                  }  
            })
        }),
        sendForgotPassword: builder.mutation({
            query: credentials => ({
                url: '/api/auth/forgot-password',
                method: 'POST',
                body: { ...credentials },
                headers: {
                    'Accept': 'Application/json'
                  }  
            })
        }),
        resetPassword: builder.mutation({
            query: (formData)  => ({
                url: '/api/auth/reset-password',
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                  }  
            })
        }), getInviteDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/auth/retrieve-invite-details?invite_token=${invite_token}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        }),
        getOInviteDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/auth/retrieve-oinvite-details?invite_token=${invite_token}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        }),        
        verifyResetToken: builder.query({
            query: (invite_token) => ({
                url: `/api/auth/verify-reset-token?reset_token=${invite_token}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
  useLoginMutation,
  useSendForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyResetTokenQuery,
  useSendUserInviteMutation,
  useGetMyInvitesQuery,
  useGetInviteDetailsQuery,
  useGetOInviteDetailsQuery
} = authApiSlice;