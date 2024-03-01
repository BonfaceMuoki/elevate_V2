import { apiSlice } from "../../featuers/apiSlice"
export const accesorRequestsSlliceApi = apiSlice.injectEndpoints({   
    endpoints: builder => ({
        getAccesorRequests: builder.query({
            query: () => ({
                url: `/api/admin/get-accesor-access-requests`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        }),
        approveAccesorRequest: builder.mutation({
            query: (formdata) => ({
                url: `/api/admin/accept-accesor-access-request`,
                method: 'POST',
                body: formdata,
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        }),
        rejectAccesorRequest: builder.mutation({
            query: (formdata) => ({
                url: `/api/admin/reject-accesor-access-request`,
                method: 'POST',
                body: formdata,
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
    useGetAccesorRequestsQuery,useApproveAccesorRequestMutation,useRejectAccesorRequestMutation
} = accesorRequestsSlliceApi ;