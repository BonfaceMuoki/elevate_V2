import React, { useRef } from "react";

import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLoginMutation } from "../api/auth/authApiSlice";
import { setCredentials, setHasInvested, setInviteToken, setMainRole, setSystemWallet, setUserWallet, selectCurrentToken, logOut, selectMainRole } from "../featuers/authSlice";
import ReCAPTCHA from "react-google-recaptcha";

import { Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button, Icon, PreviewCard } from "../components/Component";
import Head from "../layout/head/Head";

import AuthFooter from "../pages/auth/AuthFooter";
import Swal from "sweetalert2";
import { useSendForgotPasswordMutation } from "../api/auth/authApiSlice";

const RequestRestPassword = () => {
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
        email: yup.string().email().required("Please provide your username/Email"),

    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [resetPassword, { isLoading }] = useSendForgotPasswordMutation();
    const navigate = useNavigate();
    const submitLoginForm = async (data) => {
        proceedtoreset(data);
    };
    const proceedtoreset = async (data) => {
        let formData = new FormData();
        let email = data.email;
        let recaptcha_token = captchaRef.current.getValue();
        let reset_link = process.env.REACT_APP_FRONTEND_BASE_URL + "/set-new-password";
        const userData = await resetPassword({ email, recaptcha_token, reset_link });

        console.log(userData);
        if ("error" in userData) {

            console.log(userData.error.data.error);
            toastMessage(userData.error.data.error, "error");
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
                title: "Request Password Reset!! ",
                text: userData.data.message,
                focusConfirm: false
            });
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
                            <BlockTitle tag="h4"></BlockTitle>
                            <BlockDes>
                                {/* <p></p> */}
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
                            {" "}
                            <ReCAPTCHA className="recaptcha" sitekey={SITE_KEY} ref={captchaRef} />
                        </div>
                        <div className="form-group">
                            {
                                (!isLoading) &&
                                <Button size="lg" className="btn-block" type="submit" color="primary">
                                    Submit
                                </Button>
                            }

                        </div>
                    </form>
                    <div className="form-note-s2 text-center pt-3">Remembered your password?</div>
                    <div className="form-note-s2 text-center pt-1">
                        <Link to="/login"> Login</Link>
                    </div>
                </PreviewCard>

            </Block>
            <AuthFooter />
        </>
    );
};

export default RequestRestPassword;
