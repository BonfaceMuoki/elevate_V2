import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
import { useRequestLenderCourtAccessMutation } from "../api/auth/inviteAccesorApiSlice";
import { Row, Col } from "reactstrap";
import { useGetInviteDetailsQuery } from "../api/auth/authApiSlice";
import { Alert } from "reactstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
const AcceptInvite = () => {
  const navigateto = useNavigate();
  const toastMessage = (message, type) => {
    if (type == "success") {
      toast.success(message, {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        closeButton: <CloseButton />,
      });
    } else if (type == "error") {
      toast.error(message, {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        closeButton: <CloseButton />,
      });
    } else if (type == "warning") {
      toast.warning(message, {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
        closeButton: <CloseButton />,
      });
    }
  };
  const SITE_KEY = process.env.REACT_APP_reCAPTCHA_SITE_KEY;
  const captchaRef = useRef(null);

  const [passState, setPassState] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const {
    data: retrieved,
    isLoading: loadingInviteDetails,
    isError,
    error,
  } = useGetInviteDetailsQuery(params.get("token"));
  console.log("retrieved");
  console.log(retrieved);

  //register form
  const schema = yup.object().shape({
    full_names: yup.string().required("Full name is required"),
    login_email: yup.string().required("Email is required"),
    phone_number: yup.string().required("Contact Phone number is required"),
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
    register: registerAccesorRequestForm,
    setValue: setInviteValue,
    isLoading: isSubmittingForm,
    reset: resetRequestForm,
    handleSubmit: handleSubmitRequestValuerAccess,
    formState: { errors: requestvalueraccesserrors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    if (!loadingInviteDetails && retrieved) {
      setInviteValue("full_names", retrieved?.invite_name);
      setInviteValue("login_email", retrieved?.invite_email);
      setInviteValue("phone_number", retrieved?.invite_phone);
    }
  }, [retrieved, loadingInviteDetails, setInviteValue]);
  const [submitAccessRequest, { isLoading: submittingInfor }] = useRequestLenderCourtAccessMutation();
  const sendRequestForm = async (data) => {
    console.log(data);
    const token = await captchaRef.current.getValue();
    const formDatareg = new FormData();
    formDatareg.append("full_names", data.full_names);
    formDatareg.append("is_invite", 1);
    formDatareg.append("invite", retrieved?.id);
    formDatareg.append("invite_type", "specificlink");
    formDatareg.append("email", data.login_email);
    formDatareg.append("phone_number", data.phone_number);
    formDatareg.append("password", data.password);
    formDatareg.append("password_confirmation", data.confirm_password);
    formDatareg.append("recaptcha_token", token);
    formDatareg.append("register_as", "Contributor");

    const result = await submitAccessRequest(formDatareg);
    if ("error" in result) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: result.error.data.message,
        focusConfirm: false,
      });
    } else {
      Swal.fire({
        title: "Account Creation",
        text: result.data.message,
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          resetRequestForm();
          navigateto("/login");
        }
      });
    }
  };
  //close register page

  if (retrieved) {
    if (Object.keys(retrieved).length === 0) {
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <Alert className="alert-icon" color="danger">
            <Icon name="alert-circle" />
            <strong>Invalid/Expired Credetials</strong>
          </Alert>
        </div>
      );
    } else {
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
                  <BlockTitle tag="h4"> Register</BlockTitle>
                </BlockContent>
              </BlockHead>

              <form onSubmit={handleSubmitRequestValuerAccess(sendRequestForm)}>
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Full Names
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      readOnly
                      type="text"
                      id="default-01"
                      {...registerAccesorRequestForm("full_names", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter your Full Names"
                      className="form-control-lg form-control"
                    />
                    {requestvalueraccesserrors.full_names?.message && (
                      <span className="invalid">{requestvalueraccesserrors.full_names?.message}</span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Login Email
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      readOnly
                      type="email"
                      id="default-01"
                      {...registerAccesorRequestForm("login_email", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter your email address"
                      className="form-control-lg form-control"
                    />
                    {requestvalueraccesserrors.login_email?.message && (
                      <span className="invalid">{requestvalueraccesserrors.login_email?.message}</span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Contact Phone Number
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      readOnly
                      type="text"
                      id="default-01"
                      {...registerAccesorRequestForm("phone_number", { required: "This field is required" })}
                      defaultValue=""
                      placeholder="Enter your Phone Number"
                      className="form-control-lg form-control"
                    />
                    {requestvalueraccesserrors.phone_number?.message && (
                      <span className="invalid">{requestvalueraccesserrors.phone_number?.message}</span>
                    )}
                  </div>
                </div>
                <Row className="mb-3">
                  <Col>
                    <div className="form-group">
                      <div className="form-label-group">
                        <label className="form-label" htmlFor="password">
                          Password
                        </label>
                        <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
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
                          className={`form-icon lg form-icon-right passcode-switch ${
                            passState ? "is-hidden" : "is-shown"
                          }`}
                        >
                          <Icon name="eye" className="passcode-icon icon-show"></Icon>
                          <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                        </a>
                        <input
                          type={passState ? "text" : "password"}
                          id="password"
                          {...registerAccesorRequestForm("password", { required: "This field is required" })}
                          defaultValue=""
                          placeholder="Enter your passcode"
                          className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                        />
                        {requestvalueraccesserrors.password?.message && (
                          <span className="invalid">{requestvalueraccesserrors.password?.message}</span>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div className="form-group">
                      <div className="form-label-group">
                        <label className="form-label" htmlFor="password">
                          Confirm Passwword
                        </label>
                      </div>
                      <div className="form-control-wrap">
                        <a
                          href="#password"
                          className={`form-icon lg form-icon-right passcode-switch ${
                            passState ? "is-hidden" : "is-shown"
                          }`}
                        ></a>
                        <input
                          type={passState ? "text" : "password"}
                          id="password"
                          {...registerAccesorRequestForm("confirm_password", { required: "This field is required" })}
                          defaultValue=""
                          placeholder="Confirm Password"
                          className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                        />
                        {requestvalueraccesserrors.confirm_password?.message && (
                          <span className="invalid">{requestvalueraccesserrors.confirm_password?.message}</span>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className="form-group">
                  {" "}
                  <ReCAPTCHA className="recaptcha" sitekey={SITE_KEY} ref={captchaRef} />
                </div>
                <div className="form-group">
                  {!submittingInfor && (
                    <Button size="lg" className="btn-block" type="submit" color="primary">
                      Submit
                    </Button>
                  )}
                </div>
              </form>

              <div className="form-note-s2 text-center pt-3">Have an Account?</div>

              <div className="form-note-s2 text-center pt-4">
                <Link to="/login"> Login</Link>
              </div>
              {/* <div className="text-center pt-1 pb-1">
        <h6 className="overline-title overline-title-sap">
          <span>OR</span>
        </h6>
      </div> */}
            </PreviewCard>
          </Block>
          <AuthFooter />
        </>
      );
    }
  } else {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Alert className="alert-icon" color="danger">
          <Icon name="alert-circle" />
          <strong>Invalid/Expired Credetials</strong>
        </Alert>
      </div>
    );
  }
};

export default AcceptInvite;
