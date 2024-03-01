import React, { useRef } from "react";

import { useState } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useResetPasswordMutation } from "../api/auth/authApiSlice";
import { setCredentials, setHasInvested, setInviteToken, setMainRole, setSystemWallet, setUserWallet, selectCurrentToken, logOut, selectMainRole } from "../featuers/authSlice";
import ReCAPTCHA from "react-google-recaptcha";

import { Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button, Icon, PreviewCard } from "../components/Component";
import Head from "../layout/head/Head";

import AuthFooter from "../pages/auth/AuthFooter";
import Swal from "sweetalert2";

const SetNewPassord = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);


    let currentToe = useSelector(selectCurrentToken);
    let currentrole = useSelector(selectMainRole);
    const dispatch = useDispatch();
    const navigateto = useNavigate();


    const [passState, setPassState] = useState(false);
    const toastMessage = (message, type) => { };
    const SITE_KEY = process.env.REACT_APP_reCAPTCHA_SITE_KEY;
    const SECRET_KEY = process.env.REACT_APP_reCAPTCHA_SECRET_KEY;
    const captchaRef = useRef(null);

    const [checked, setChecked] = useState(true);
    // const { data } = useGetUsersQuery();
    const schema = yup.object().shape({
        email: yup.string().email().required("Please provide your Username/Email"),
        password: yup
            .string()
            .required("Please provide password")
            .matches(
                /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{6,}$/,
                "Password must be at least 8 characters long and contain at least one letter, one number, and one special character"
            ),
        confirm_password: yup
            .string()
            .oneOf([yup.ref("password"), null], "Passwords do not match.")
            .required("Please confirm the password"),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [open, setOpen] = React.useState(false);
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
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
                    proceedtosetnewpassword(data);
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
            proceedtosetnewpassword(data);
        }
        // setOpen(true);
        // setOpen(false);

    };
    const proceedtosetnewpassword = async (data) => {
        let formData = new FormData();
        let email = data.email;
        let password = data.password;
        let reset_token = params.get("token");
        const userData = await resetPassword({ email, password, reset_token });
        console.log(userData);
        if ("error" in userData) {


            if (userData.error.data.message) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: userData.error.data.message,
                    focusConfirm: false
                });
            } else if (userData.error.data.error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: userData.error.data.error,
                    focusConfirm: false
                });
            }


        } else {
            Swal.fire({
                icon: "success",
                title: "Password Reset",
                text: userData.data.message,
                focusConfirm: false
            });
            navigateto("/login");
        }
    }

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
                            <BlockTitle tag="h4">Set New Password</BlockTitle>
                            <BlockDes>
                                <p>Access Elevate Club using your email and Password.</p>
                            </BlockDes>
                        </BlockContent>
                    </BlockHead>

                    <form className="is-alter" onSubmit={handleSubmit(submitLoginForm)}>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="default-01">
                                    Enter Your Registred Email
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
                                    placeholder="Enter your password"
                                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                                />
                                {errors.password?.message && <span className="invalid">{errors.password?.message}</span>}
                            </div>

                        </div>
                        <div className="form-group">
                            <div className="form-label-group">
                                <label className="form-label" htmlFor="password">
                                    Confirm Passwword
                                </label>
                            </div>
                            <div className="form-control-wrap">
                                <a
                                    href="#password"
                                    className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"
                                        }`}
                                ></a>
                                <input
                                    type={passState ? "text" : "password"}
                                    id="password"
                                    {...register("confirm_password", { required: "This field is required" })}
                                    defaultValue=""
                                    placeholder="Confirm Password"
                                    className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                                />
                                {errors.confirm_password?.message && (
                                    <span className="invalid">{errors.confirm_password?.message}</span>
                                )}
                            </div>
                        </div>
                        <div className="form-group">
                            {" "}
                            <ReCAPTCHA className="recaptcha" sitekey={SITE_KEY} ref={captchaRef} />
                        </div>
                        <div className="form-group">

                            {
                                (!isLoading) &&
                                <Button size="lg" className="btn-block" type="submit" color="primary">
                                    Submit New Password
                                </Button>
                            }
                        </div>
                    </form>
                    <div className="form-note-s2 text-center pt-3">Remembered Your Password?</div>
                    <div className="form-note-s2 text-center pt-1">
                        <Link to="/login"> Login</Link>
                    </div>
                </PreviewCard>

            </Block>
            <AuthFooter />
        </>
    );
};

export default SetNewPassord;
