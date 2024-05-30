import { apiSlice } from "../../featuers/apiSlice";
export const adminActionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: ({ currentPage, rowsPerPage, searchText, orderColumn, sortOrder, filterCategory }) => {
        // Log information before making the request

        return {
          url: `/api/admin/get-payments?page=${currentPage}&no_records=${rowsPerPage}&search=${searchText}&orderby=${orderColumn}&sortOrder=${sortOrder}`,
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
    getDashboard: builder.query({
      query: () => ({
        url: `/api/admin/get-dashboard`,
        method: "GET",
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: `/api/admin/get-users`,
        method: "GET",
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    getSuppliers: builder.query({
      query: () => ({
        url: `/api/admin/get-all-suppliers`,
        method: "GET",
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    getSupplierProducts: builder.query({
      query: ({ supplierID, as, currentPage, rowsPerPage, searchText, orderColumn, sortOrder, filterCategory }) => {
        // Log information before making the request
        console.log("Before making API request. Supplier:", supplierID, "Page:", currentPage);
        return {
          url: `/api/commons/get-all-products?supplier=${supplierID}&&category=${filterCategory}&as=${as}&page=${currentPage}&no_records=${rowsPerPage}&search=${searchText}&orderby=${orderColumn}&sortOrder=${sortOrder}`,
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
    getSupplierOrderedProducts: builder.query({
      query: ({
        od_supplierID,
        as,
        od_currentPage,
        od_rowsPerPage,
        od_searchText,
        od_orderColumn,
        od_sortOrder,
        od_filterCategory,
      }) => {
        // Log information before making the request
        console.log("Before making API request. Supplier:", od_supplierID, "Page:", od_currentPage);
        return {
          url: `/api/commons/get-all-ordered-products?supplier=${od_supplierID}&&category=${od_filterCategory}&as=${as}&page=${od_currentPage}&no_records=${od_rowsPerPage}&search=${od_searchText}&orderby=${od_orderColumn}&sortOrder=${od_sortOrder}`,
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

    getTierDetails: builder.query({
      query: (tier) => ({
        url: `/api/commons/get-tier-contribution-details?tier=${tier}`,
        method: "GET",
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    getTierEarnings: builder.query({
      query: (tier) => ({
        url: `/api/admin/get-tier-earnings`,
        method: "GET",
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    getBonusPayments: builder.query({
      query: ({ currentPage, searchText, rowsPerPage }) => ({
        url: `/api/admin/get-bonus-payments?page=${currentPage}&no_records=${rowsPerPage}&search=${searchText}`,
        method: "GET",
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    getSponsorshipLinks: builder.query({
      query: (tier) => ({
        url: `/api/admin/get-sponsorship-links`,
        method: "GET",
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    getCompanyPayments: builder.query({
      query: (tier) => ({
        url: `/api/admin/get-company-payments`,
        method: "GET",
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    verifyPayment: builder.mutation({
      query: (formdata) => ({
        url: `/api/admin/approve-payment`,
        method: "POST",
        body: formdata,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    updateOrderProductStataus: builder.mutation({
      query: (formdata) => ({
        url: `/api/admin/update-order-product-status`,
        method: "POST",
        body: formdata,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    deactivateUser: builder.mutation({
      query: (formdata) => ({
        url: `/api/admin/deactivate-activate-user`,
        method: "POST",
        body: formdata,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    sendSupplierRegistration: builder.mutation({
      query: (formdata) => ({
        url: `/api/admin/add-supplier`,
        method: "POST",
        body: formdata,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    sendProductCreation: builder.mutation({
      query: (formdata) => ({
        url: `/api/admin/add-supplier-product`,
        method: "POST",
        body: formdata,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    sendProductUpdate: builder.mutation({
      query: (formdata) => ({
        url: `/api/admin/update-supplier-product`,
        method: "POST",
        body: formdata,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    sendSubscriptionLinkRegistration: builder.mutation({
      query: (formdata) => ({
        url: `/api/admin/add-subscription-link`,
        method: "POST",
        body: formdata,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    saveSettings: builder.mutation({
      query: (formdata) => ({
        url: `/api/admin/update-settings`,
        method: "POST",
        body: formdata,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    sendSubscriptionLinkUpdate: builder.mutation({
      query: (formdata) => ({
        url: `/api/admin/update-subscription-link`,
        method: "POST",
        body: formdata,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    getLinkInvitees: builder.mutation({
      query: (formdata) => ({
        url: `/api/admin/get-user-link-invitees`,
        method: "POST",
        body: formdata,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    payMember: builder.mutation({
      query: (formdata) => ({
        url: `/api/admin/pay-member`,
        method: "POST",
        body: formdata,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    payMemberBonus: builder.mutation({
      query: (formdata) => ({
        url: `/api/admin/pay-member-bonus`,
        method: "POST",
        body: formdata,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    downloadPaymentOfProof: builder.query({
      query: (payment) => ({
        url: `/api/admin/donwload-payment-proof`,
        method: "GET",
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    sendSupplierUpdate: builder.mutation({
      query: (formdata) => ({
        url: `/api/admin/update-supplier`,
        method: "POST",
        body: formdata,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
    deleteProduct: builder.mutation({
      query: (formdata) => ({
        url: `/api/admin/delete-supplier-product`,
        method: "POST",
        body: formdata,
        headers: {
          Accept: "Application/json",
        },
      }),
    }),
  }),
});

export const {
  useDeleteProductMutation,
  useGetPaymentsQuery,
  useGetDashboardQuery,
  useGetSponsorshipLinksQuery,
  useVerifyPaymentMutation,
  useGetUsersQuery,
  useGetSuppliersQuery,
  useDeactivateUserMutation,
  useSendSupplierRegistrationMutation,
  useSendSupplierUpdateMutation,
  useSendSubscriptionLinkRegistrationMutation,
  useSendSubscriptionLinkUpdateMutation,
  useGetSupplierProductsQuery,
  useSendProductUpdateMutation,
  useSendProductCreationMutation,
  useGetTierDetailsQuery,
  useGetLinkInviteesMutation,
  useSaveSettingsMutation,
  useGetTierEarningsQuery,
  usePayMemberMutation,
  usePayMemberBonusMutation,
  useDownloadPaymentOfProofQuery,
  useGetBonusPaymentsQuery,
  useGetCompanyPaymentsQuery,
  useUpdateOrderProductStatausMutation,
  useGetSupplierOrderedProductsQuery,
} = adminActionsApi;
