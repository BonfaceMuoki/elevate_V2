import { apiSlice } from "../../featuers/apiSlice"
export const inviteAccesorApiSlice = apiSlice.injectEndpoints({   
    endpoints: builder => ({      
        getAccesorInviteDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/auth/retrieve-accessor-invite-details?invite_token=${invite_token}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        }),        
        getAccesorUserInviteDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/auth/retrieve-accessor-user-invite-details?invite_token=${invite_token}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        }),requestLenderCourtAccess: builder.mutation({
            query: (formData) => ({
                url: `/api/auth/register`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const {
    useRequestLenderCourtAccessMutation,
    useRequestAccesorRegistrationStatusQuery,
    useRegisterAccesorMutation,
    useRegisterAccesorUserMutation,
    useGetAccesorInviteDetailsQuery,
    useGetAccesorUserInviteDetailsQuery
} = inviteAccesorApiSlice ;