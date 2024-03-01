import { apiSlice } from "../../featuers/apiSlice"
export const valuationFirmRequestsSlliceApi = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getValuationFirmRequests: builder.query({
            query: () => ({
                url: `/api/admin/get-valuation-access-requests`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        }),
        approveValuationFirmRequest: builder.mutation({
            query: (formdata) => ({
                url: `/api/admin/accept-valuation-access-request`,
                method: 'POST',
                body: formdata,
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        }),
        rejectValuationFirmRequest: builder.mutation({
            query: (formdata) => ({
                url: `/api/admin/reject-valuation-access-request`,
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
    useGetValuationFirmRequestsQuery,useApproveValuationFirmRequestMutation,useRejectValuationFirmRequestMutation
} = valuationFirmRequestsSlliceApi ;