import React, { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Homepage from "../pages/HomePage";
import ValuerDashboard from "../pages/ValuerDashboard";
import Layout from "../layout/Index";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../auth/Login";

const Router = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path={`${process.env.PUBLIC_URL}`} element={<Layout />}>
        <Route index element={<Homepage />}></Route>
        <Route path="valuer-dashboard" element={<Homepage />}></Route>
        <Route path="accesor-dashboard" element={<Homepage />}></Route>
      </Route>
    </Routes>
  );
};
export default Router;
