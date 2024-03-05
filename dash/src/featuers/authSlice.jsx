import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { Persistor } from "redux-persist";
const initialState = {
  mode: "light",
  user: null,
  roles: null,
  permissions: null,
  token: null,
  hasInvested: null,
  activeSupplierDetails: null,
  activeUserDetails: null,
  activeGlobalTier: null,
  inviteToken: null,
  sponsorshipInviteToken: null,
  mainRole: null,
  activeMemberProfile: null,
  systemWallet: null,
  userWallet: null,
  signedin: 0,
  oInviteToken: null,
  activeProductGlobal: null,
  cartItems: [],
  cartTotal: 0,
  cartCounteer: 0,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, roles, permissions, access_token } = action.payload;
      state.user = user;
      state.roles = roles ? roles : state.roles;
      state.permissions = permissions ? permissions : state.permissions;
      state.token = access_token ? access_token : state.access_token;
    },
    updateUserDetails: (state, action) => {
      const { user, roles, permissions, access_token } = action.payload;
      state.user = user;
    },
    setHasInvested: (state, action) => {
      state.hasInvested = action.payload;
    },
    setActiveSupplierDetails(state, action) {
      state.activeSupplierDetails = action.payload;
    },
    setActiveUserDetails(state, action) {
      state.activeUserDetails = action.payload;
    },
    setActiveGlobalTier(state, action) {
      state.activeGlobalTier = action.payload;
    },
    setInviteToken(state, action) {
      state.inviteToken = action.payload;
    },
    setSponsorshipInviteToken(state, action) {
      state.sponsorshipInviteToken = action.payload;
    },
    setActiveMemberProfile(state, action) {
      state.activeMemberProfile = action.payload;
    },
    setMainRole(state, action) {
      state.mainRole = action.payload;
    },
    setSystemWallet(state, action) {
      state.systemWallet = action.payload;
    },
    setUserWallet(state, action) {
      state.userWallet = action.payload;
    },
    logOut(state, action) {
      // state.mainRole = "Changed";
      return initialState;
    },
    setOInviteToken(state, action) {
      state.oInviteToken = action.payload;
    },
    setActiveProductGlobal(state, action) {
      state.activeProductGlobal = action.payload;
    },
    setCartItems(state, action) {
      const currentCartItems = state.cartItems;
      const indexIfFound = currentCartItems.findIndex((item) => item.id === action.payload.id);
      if (indexIfFound > -1) {
        state.cartItems[indexIfFound].quantity += 1;
      } else {
        const tempProduct = { ...action.payload, quantity: 1 };
        state.cartItems.push(tempProduct);
      }
    },
    reduceCartItemQTY(state, action) {
      const currentCartItems = state.cartItems;
      const indexIfFound = currentCartItems.findIndex((item) => item.id === action.payload.id);
      if (indexIfFound > -1) {
        if (state.cartItems[indexIfFound].quantity > 1) {
          state.cartItems[indexIfFound].quantity -= 1;
        } else {
          state.cartItems.splice(indexIfFound, 1);
        }
      }
    },
    removeCartItem(state, action) {
      const indexIfFound = state.cartItems.findIndex((item) => item.id === action.payload.id);
      if (indexIfFound > -1) {
        state.cartItems.splice(indexIfFound, 1);
      }
    },
    clearCart(state, action) {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logOut, (state) => {
      console.log(initialState, "initialState");
      return initialState;
    });
  },
});
export const {
  setActiveProductGlobal,
  clearCart,
  reduceCartItemQTY,
  removeCartItem,
  setCartItems,
  setOInviteToken,
  setMainRole,
  setSystemWallet,
  setUserWallet,
  setActiveMemberProfile,
  setInviteToken,
  setSponsorshipInviteToken,
  setActiveGlobalTier,
  setActiveUserDetails,
  setActiveSupplierDetails,
  setHasInvested,
  setReportSignatories,
  setReportRecipient,
  updateUserDetails,
  setCredentials,
  logOut,
  setMode,
  setfetchvaluationreports,
  setValuationLocationDetails,
  setValuationPropertyDetails,
  setValuationDetails,
} = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentSignatories = (state) => state.auth.reportSignatories;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentRoles = (state) => state.auth.roles;
export const selectCurrentPermissions = (state) => state.auth.permissions;
export const selectHasInvested = (state) => state.auth.hasInvested;
export const selectActiveSupplierDetails = (state) => state.auth.activeSupplierDetails;
export const selectActiveUserDetails = (state) => state.auth.activeUserDetails;
export const selectActiveGlobalTier = (state) => state.auth.activeGlobalTier;
export const selectInviteToken = (state) => state.auth.inviteToken;
export const selectSponsorshipInviteToken = (state) => state.auth.sponsorshipInviteToken;

export const selectActiveMember = (state) => state.auth.activeMemberProfile;
export const selectMainRole = (state) => state.auth.mainRole;
export const selectSystemWallet = (state) => state.auth.systemWallet;
export const selectUserWallet = (state) => state.auth.userWallet;
export const selectSignedIn = (state) => state.auth.signedin;
export const selectOInviteToken = (state) => state.auth.oInviteToken;
export const selectActiveProductGlobal = (state) => state.auth.activeProductGlobal;
export const selectCartItems = (state) => state.auth.cartItems;
