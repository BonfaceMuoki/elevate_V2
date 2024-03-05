import React, { useRef } from "react";

import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoginMutation } from "../api/auth/authApiSlice";
import {
  setCredentials,
  setHasInvested,
  setInviteToken,
  setSponsorshipInviteToken,
  setMainRole,
  setSystemWallet,
  setUserWallet,
  selectCurrentToken,
  logOut,
  selectMainRole,
} from "../featuers/authSlice";
import ReCAPTCHA from "react-google-recaptcha";

import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../components/Component";
import Head from "../layout/head/Head";

import AuthFooter from "../pages/auth/AuthFooter";
import Swal from "sweetalert2";

const Login = () => {
  let currentToe = useSelector(selectCurrentToken);
  let currentrole = useSelector(selectMainRole);
  const dispatch = useDispatch();
  const navigateto = useNavigate();

  const [passState, setPassState] = useState(false);
  const toastMessage = (message, type) => {};
  const SITE_KEY = process.env.REACT_APP_reCAPTCHA_SITE_KEY;
  const SECRET_KEY = process.env.REACT_APP_reCAPTCHA_SECRET_KEY;
  const captchaRef = useRef(null);

  const [checked, setChecked] = useState(true);
  // const { data } = useGetUsersQuery();
  const schema = yup.object().shape({
    email: yup.string().email().required("Please provide your Username/Email"),
    password: yup.string().required("Please provide your Password."),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [open, setOpen] = React.useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const submitLoginForm = async (data) => {
    if (currentToe !== null) {
      Swal.fire({
        title: "Already Signed In",
        text: "Please note that you can't sign in with 2 account on the same browser",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login Afresh with this!",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(logOut());
          currentToe = null;
          currentrole = null;
          proceedtologin(data);
        } else {
          if (currentrole.name === "Super Admin") {
            navigateto("/admin-dashboard");
          } else if (currentrole.name === "Contributor") {
            navigateto("/contributor-dashboard");
          } else if (currentrole.name === "Supplier") {
            navigateto("/supplier-dashboard");
          }
        }
      });
    } else {
      proceedtologin(data);
    }
    // setOpen(true);
    // setOpen(false);
  };
  const proceedtologin = async (data) => {
    let formData = new FormData();
    let email = data.email;
    let password = data.password;
    let recaptcha_token = captchaRef.current.getValue();
    const userData = await login({ email, password, recaptcha_token });
    console.log(userData);
    if ("error" in userData) {
      console.log(userData.error.data.error);
      toastMessage(userData.error.data.error, "error");
      if (userData.error.data.message) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: userData.error.data.message,
          focusConfirm: false,
        });
      } else if (userData.error.data.error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: userData.error.data.error,
          focusConfirm: false,
        });
      }
    } else {
      dispatch(setCredentials({ ...userData.data, email }));
      dispatch(setHasInvested(userData.data.user.investment_done));
      dispatch(setInviteToken(userData.data.invite_token));
      dispatch(setSponsorshipInviteToken(userData.data.sponsorship_token));
      dispatch(setMainRole(userData.data.role));
      dispatch(setSystemWallet(userData.data.syswallet));
      dispatch(setUserWallet(userData.data.userwallet));
      if (userData.data.user.role_name === "Super Admin") {
        navigateto("/admin-dashboard");
      } else if (userData.data.user.role_name === "Contributor") {
        navigateto("/contributor-dashboard");
      } else if (userData.data.user.role_name === "Supplier") {
        navigateto("/supplier-dashboard");
      }
    }
  };

  return (
    <>
      <Head title="Register" />
      <Block className="nk-block-middle nk-auth-body  wide-xs">
        <div className="brand-logo pb-4 text-center">
          <BlockHead>
            <BlockContent>
              <BlockTitle tag="h4"> </BlockTitle>
            </BlockContent>
          </BlockHead>
        </div>
        <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
          <BlockHead>
            <BlockContent>
              <BlockTitle tag="h4">Sign-In</BlockTitle>
              <BlockDes>
                <p>Access Elevate Club using your email and Password.</p>
              </BlockDes>
            </BlockContent>
          </BlockHead>

          <form className="is-alter" onSubmit={handleSubmit(submitLoginForm)}>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="default-01">
                  Email or Username
                </label>
              </div>
              <div className="form-control-wrap">
                <input
                  type="text"
                  id="default-01"
                  {...register("email", { required: "This field is required" })}
                  defaultValue=""
                  placeholder="Enter your email address"
                  className="form-control-lg form-control"
                />
                {errors.email?.message && <span className="invalid">{errors.email?.message}</span>}
              </div>
            </div>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/request-password-reset`}>
                  Forgot Password?
                </Link>
              </div>
              <div className="form-control-wrap">
                <a
                  href="#password"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setPassState(!passState);
                  }}
                  className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                >
                  <Icon name="eye" className="passcode-icon icon-show"></Icon>
                  <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                </a>
                <input
                  type={passState ? "text" : "password"}
                  id="password"
                  {...register("password", { required: "This field is required" })}
                  defaultValue=""
                  placeholder="Enter your passcode"
                  className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                />
                {errors.password?.message && <span className="invalid">{errors.password?.message}</span>}
              </div>
            </div>
            <div className="form-group">
              {" "}
              <ReCAPTCHA className="recaptcha" sitekey={SITE_KEY} ref={captchaRef} />
            </div>
            <div className="form-group">
              <Button size="lg" className="btn-block" type="submit" color="primary">
                Submit
              </Button>
            </div>
          </form>
          <div className="form-note-s2 text-center pt-3">New on our platform?</div>
          <div className="form-note-s2 text-center pt-1">
            <Link to="/register"> Register an Account</Link>
          </div>
        </PreviewCard>
      </Block>
      <AuthFooter />
    </>
  );
};

export default Login;
