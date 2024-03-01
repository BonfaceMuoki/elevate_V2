import { apiSlice } from "../../featuers/apiSlice"
import { useSelector } from "react-redux";

export const retrieveValuerDashboardSliceApi = apiSlice.injectEndpoints({
   
    endpoints: builder => ({
        getValuerDashboardDetails: builder.query({
            query: (invite_token) => ({
                url: `/api/uploader/get-dashboard`,
                method: 'GET',
                headers: {
                    'Accept': 'Application/json'
                  }          
            })
           
        })
    })
})

export const {
    useGetValuerDashboardDetailsQuery
} = retrieveValuerDashboardSliceApi ;