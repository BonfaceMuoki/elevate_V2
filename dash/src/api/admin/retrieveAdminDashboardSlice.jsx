import { apiSlice } from "../../featuers/apiSlice"
import { useSelector } from "react-redux";

export const retrieveAdminDashboardSliceApi = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getAdminDashboardDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/admin/get-dashboard`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
    useGetAdminDashboardDetailsQuery
} = retrieveAdminDashboardSliceApi ;