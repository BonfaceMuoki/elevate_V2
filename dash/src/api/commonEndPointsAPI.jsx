import { apiSlice } from "../featuers/apiSlice";
import { useSelector } from "react-redux";

export const CommonEnpointsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubLinks: builder.query({
      query: () => ({
        url: `/api/commons/get-all-links`,
        method: "GET",
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    getAccesorsList: builder.query({
      query: () => `/api/commons/get-accesors-list`,
      skipCache: true,
      keepUnusedDataFor: 5,
      refetchOnFocus: true,
    }),
    getPropertyTypeList: builder.query({
      query: () => `/api/commons/get-all-propertytypes`,
      skipCache: true,
      keepUnusedDataFor: 5,
      refetchOnFocus: true,
    }),
    getAllTiers: builder.query({
      query: () => `/api/commons/get-all-tiers`,
      skipCache: true,
      keepUnusedDataFor: 5,
      refetchOnFocus: true,
    }),
    getRefreshedSponsoredToken: builder.query({
      query: () => `/api/commons/get-refresh-sponsored-link`,
      skipCache: true,
      keepUnusedDataFor: 5,
      refetchOnFocus: true,
    }),
    getRefreshedNormalInviteToken: builder.query({
      query: () => `/api/commons/get-refresh-normal-invite-link`,
      skipCache: true,
      keepUnusedDataFor: 5,
      refetchOnFocus: true,
    }),
    getAllCategories: builder.query({
      query: () => `/api/commons/get-all-categories`,
      skipCache: true,
      keepUnusedDataFor: 5,
      refetchOnFocus: true,
    }),
    getUserSubLinks: builder.query({
      query: (user) => `/api/commons/get-user-sub-links?user=${user}`,
      skipCache: true,
      keepUnusedDataFor: 5,
      refetchOnFocus: true,
    }),
    uploadValuationReportV2: builder.mutation({
      query: (formData) => ({
        url: "/api/uploader/upload-valuation-report-v2",
        method: "POST",
        body: formData,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    sendAddRegistrationLink: builder.mutation({
      query: (formData) => ({
        url: "/api/commons/save-user-subscription-link",
        method: "POST",
        body: formData,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    getSubscriptionInvitees: builder.mutation({
      query: (formData) => ({
        url: "/api/commons/save-user-subscription-link",
        method: "POST",
        body: formData,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    updatePersonalInformation: builder.mutation({
      query: (formData) => ({
        url: "/api/commons/update-personal-information",
        method: "POST",
        body: formData,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    sendUpdateRegistrationLink: builder.mutation({
      query: (formData) => ({
        url: "/api/commons/save-user-subscription-link",
        method: "POST",
        body: formData,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    checkoutFromCart: builder.mutation({
      query: (credentials) => ({
        url: "/api/commons/save-cart",
        method: "POST",
        body: { ...credentials },
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    getOrders: builder.query({
      query: ({ as, currentPage, rowsPerPage, searchText, orderColumn, sortOrder }) => {
        return {
          url: `/api/commons/get-orders?as=${as}&page=${currentPage}&no_records=${rowsPerPage}&search=${searchText}&orderby=${orderColumn}&sortOrder=${sortOrder}`,
          method: "GET",
          headers: {
            Accept: "Application/json",
          },
          skipCache: true,
          keepUnusedDataFor: 5,
          refetchOnFocus: true,
        };
      },
    }),
  }),
});

export const {
  useGetRefreshedNormalInviteTokenQuery,
  useGetRefreshedSponsoredTokenQuery,
  useGetAllTiersQuery,
  useGetSubLinksQuery,
  useGetUserSubLinksQuery,
  useSendAddRegistrationLinkMutation,
  useSendUpdateRegistrationLinkMutation,
  useGetAccesorsListQuery,
  useGetPropertyTypeListQuery,
  useUploadValuationReportV2Mutation,
  useGetSubscriptionInviteesMutation,
  useUpdatePersonalInformationMutation,
  useGetAllCategoriesQuery,
  useCheckoutFromCartMutation,
  useGetOrdersQuery,
} = CommonEnpointsApi;
