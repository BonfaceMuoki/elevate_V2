import React from 'react';
import Head from "../layout/head/Head";
import { Link } from 'react-router-dom';
import AuthFooter from "../pages/auth/AuthFooter"
import { Outlet } from 'react-router-dom';
import {
  Block
} from "../components/Component";
const AuthLayout = () => {
  return (   
    <>
    
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Block className="nk-block-middle-auth nk-auth-body  wide-xs"   >
        <div className="brand-logo pb-4 text-center">
          <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
           <h5>Elevate</h5>
          </Link>
        </div>
        <Outlet/>
      
      </Block>
      <div style={{ marginTop: 'auto' }}>
      <AuthFooter />
      </div>
   </div>
  </>
  );
};

export default AuthLayout;