import React, { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Homepage from "./pages/HomePage";
import Layout from "./layout/Index";
import Login from "./auth/Login";
import Register from "./auth/Signin";
import { BrowserRouter } from "react-router-dom";
import ThemeProvider from "./layout/provider/Theme";
import ProtectedRoutes from "./auth/routes/ProtectedRoutes";
import UserProfileRegularPage from "./pages/adminProfile/UserProfileRegular";
import ContributorDashboard from "./pages/ContributorDashboard";
import LayoutNoSidebar from "./layout/Index-nosidebar";
import AcceptInvite from "./auth/AcceptInvite";
import AcceptOInvite from "./auth/AcceptOInvite";

import AdminDashboard from "./pages/AdminDashboard";
import UsersList from "./pages/user/AdminusersList";
import AdminUserSponsorshipList from "./pages/user/AdminUserSponsorshipLinks";
import SupplierList from "./pages/user/AdminSuppliersList";
import SupplierDetails from "./pages/user/SupplierDetails";
import UserProfile from "./pages/user/UserProfile";
import TiersListView from "./pages/TierListView";
import TierDetails from "./pages/user/TierDetails";
import AdminMemberPayments from "./pages/user/AdminMemberPayments";
import AdminBonusPayments from "./pages/user/AdminBonusPayments";
import AdminCompanyPayments from "./pages/user/AdminCompanyPayments";
import SubscriptionLinksList from "./pages/user/AdminSublinksList";
import Dashboard from "./pages/Dashboard";
import AuthorizeRoute from "./auth/routes/AuthorizeRoute";
import RequestRestPassword from "./auth/RequestRestPassword";
import SetNewPassord from "./auth/SetNewPassword";
// import PaymentsList from "./pages/user/PaymentsList";
import ComingSoonPage from "./pages/CominSoon";
import ProductDetails from "./pages/user/ProductDetails";

import ProductsList from "./pages/user/ProductsList";
import ShoppingCart from "./pages/user/ShoppingCart";
import MyOrders from "./pages/user/MyOrders";
import AdminOrders from "./pages/user/AdminOrders";
import Contributions from "./pages/user/Contributions";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route element={<LayoutNoSidebar />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/accepting-invite?" element={<AcceptInvite />} />
              <Route path="/accepting-oinvite?" element={<AcceptOInvite />} />
              <Route path="/request-password-reset" element={<RequestRestPassword />} />
              <Route path="/set-new-password" element={<SetNewPassord />} />
            </Route>
            <Route element={<ProtectedRoutes />}>
              <Route path={`${process.env.PUBLIC_URL}`} element={<Layout />}>
                <Route index element={<Dashboard />}></Route>

                <Route path="/admin-profile" element={<UserProfileRegularPage />}></Route>
                <Route path="/product-details" element={<ProductDetails />}></Route>
                <Route path="/products" element={<ProductsList />}></Route>
                <Route path="/shoppingcart" element={<ShoppingCart />}></Route>
                <Route path="/my-orders" element={<MyOrders />}></Route>

                <Route element={<AuthorizeRoute checkrole="Super Admin" />}>
                  <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
                  <Route path="/admin/users" element={<UsersList />}></Route>
                  <Route path="/admin/sponsorship-links" element={<AdminUserSponsorshipList />}></Route>
                  <Route path="/admin/tier-details" element={<TierDetails />}></Route>
                  <Route path="/admin/pending-members-pay" element={<AdminMemberPayments />}></Route>
                  <Route path="/admin/subsscription-links" element={<SubscriptionLinksList />}></Route>
                  <Route path="/admin/tiers" element={<TiersListView />}></Route>
                  <Route path="/admin/suppliers" element={<SupplierList />}></Route>
                  <Route path="/admin/supplier-details" element={<SupplierDetails />}></Route>
                  {/* <Route path="/user-profile" element={<UserProfile />}></Route> */}
                  <Route path="/admin/matrix-payments-list" element={<AdminMemberPayments />}></Route>
                  <Route path="/admin/bonus-payments-list" element={<AdminBonusPayments />}></Route>
                  <Route path="/admin/company-payments-list" element={<AdminCompanyPayments />}></Route>

                  <Route path="/admin/orders" element={<AdminOrders />}></Route>
                  <Route path="/admin/all-contributions" element={<Contributions />}></Route>
                </Route>
                <Route element={<AuthorizeRoute checkrole="Contributor" />}>
                  <Route path="/user-profile" element={<UserProfile />}></Route>
                  <Route path="/contributor-dashboard" element={<ContributorDashboard />}></Route>
                  <Route path="/comingsoon" element={<ComingSoonPage />}></Route>
                </Route>
              </Route>
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};
export default App;
