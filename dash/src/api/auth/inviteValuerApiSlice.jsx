import { apiSlice } from "../../featuers/apiSlice"
import { useSelector } from "react-redux";

export const inviteValuerApiSlice = apiSlice.injectEndpoints({
   
    endpoints: builder => ({      
        getValuerUserInviteDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/auth/retrieve-valuer-user-invite-details?invite_token=${invite_token}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        }),
        registerUploaderUser: builder.mutation({
            query: (formData) => ({
                url: `/api/auth/register-valuer-user`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        getValuerInviteDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/auth/retrieve-valuer-invite-details?invite_token=${invite_token}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        }),
        registerUploader: builder.mutation({
            query: (formData) => ({
                url: `/api/auth/register`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        requestUploaderAccess: builder.mutation({
            query: (formData) => ({
                url: `/api/auth/request-valuer-access`,
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        requestUploaderRegistrationStatus: builder.query({
            query: (request) => ({
                url: `/api/admin/get-Valuer-request-registration-status?req=${request}`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        }),
        archiveUploaderRegistrationRequest: builder.mutation({
            query: (formdata) => ({
                url: `/api/admin/archive-valuer-registration-request`,
                method: 'POST',
                body:formdata,
                headers: {
                    'Accept': 'Application/json'
                }
            }),
        })
    })
})

export const {
    useArchiveUploaderRegistrationRequestMutation,
    useRegisterUploaderMutation,
    useRequestUploaderAccessMutation,
    useRequestUploaderRegistrationStatusQuery,
    useRegisterUploaderUserMutation,
    useGetValuerUserInviteDetailsQuery,
    useGetValuerInviteDetailsQuery
} = inviteValuerApiSlice ;