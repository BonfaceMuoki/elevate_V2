import React, { useState, useEffect } from "react";
import Content from "../../layout/content/Content";
import { Card } from "reactstrap";
import Head from "../../layout/head/Head";
import DatePicker from "react-datepicker";
import { Modal, ModalBody } from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  Button,
  RSelect
} from "../../components/Component";
import { countryOptions, userData } from "./UserData";
import { getDateStructured } from "../../utils/Utils";
import UserProfileAside from "./UserProfileAside";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectSystemWallet, setSystemWallet } from "../../featuers/authSlice";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUpdatePersonalInformationMutation } from "../../api/commonEndPointsAPI";
import { toast } from "react-toastify";
const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
const UserProfileRegularPage = () => {
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
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const [modalTab, setModalTab] = useState("1");
  const [userInfo, setUserInfo] = useState(useSelector(selectCurrentUser));
  const [user, setUser] = useState(useSelector(selectCurrentUser));
  const systemwallet = useSelector(selectSystemWallet);
  const [formData, setFormData] = useState({
    name: userInfo?.full_name,
    displayName: userInfo?.full_name,
    email: userInfo?.email
  });
  const [modal, setModal] = useState(false);

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = () => {
    let submitData = {
      ...formData,
    };
    setUserInfo(submitData);
    setModal(false);
  };

  // function to change the design view under 990 px
  const viewChange = () => {
    if (window.innerWidth < 990) {
      setMobileView(true);
    } else {
      setMobileView(false);
      updateSm(false);
    }
  };

  useEffect(() => {
    viewChange();
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    document.getElementsByClassName("nk-header")[0].addEventListener("click", function () {
      updateSm(false);
    });
    return () => {
      window.removeEventListener("resize", viewChange);
      window.removeEventListener("load", viewChange);
    };
  }, []);
  //update personal information form

  const [modalUpdatePersonalInfo, setmodalUpdatePersonalInfo] = useState();
  const togglemodalUpdatePersonalInfo = () => {
    setmodalUpdatePersonalInfo(!modalUpdatePersonalInfo);
  };

  const updatePersonalInfoschema = yup.object().shape({
    full_name: yup.string().required("Please provide your Full Name"),
    email: yup.string().required("Email is required"),
    phone: yup.string().required("Phone is required"),
    payment_method: yup.string().required("Payment Method is required"),
    wallet: yup.string().required("Wallet ID is required"),
  });
  const {
    register: updatePersonalInfoForm,
    handleSubmit: handleSubmitUpdatePersonalInformation,
    setValue: setUpdatePersonalInforValue,
    isLoading: submittingUpdatePersonalInformation,
    formState: { errors: updatePersonalInfoErrors },
    reset: resetUpdatePersonalInfoForm
  } = useForm({
    resolver: yupResolver(updatePersonalInfoschema),
  });

  const [sendUpdatePersonalInfor, { isLoading: updatingPersonalInformation }] =
    useUpdatePersonalInformationMutation();
  const dispatch = useDispatch();
  const submitUpdatePersonalInformation = async (data) => {

    const formData = new FormData();
    formData.append("full_name", data.full_name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("payment_method", data.payment_method);
    formData.append("wallet_id", data.wallet);
    formData.append("user", user?.id);
    formData.append("sys", 1);
    let result = await sendUpdatePersonalInfor(formData);


    if ("error" in result) {

      toastMessage(result.error.data.message, "warning");
      if ("backendvalerrors" in result.error.data) {
        toastMessage(result.error.data.message.join("\n"), "error");
      }
    } else {
      dispatch(setSystemWallet(result.data.record));
      togglemodalUpdatePersonalInfo();
      toastMessage(result.data.message, "success");
      resetUpdatePersonalInfoForm()
    }
  };
  //update personal information form

  return (
    <React.Fragment>
      <Head title="User List - Profile"></Head>
      <Content>
        <Card className="card-bordered">
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${sm ? "content-active" : ""
                }`}
            >
              <UserProfileAside updateSm={updateSm} sm={sm} />
            </div>
            <div className="card-inner card-inner-lg">
              {sm && mobileView && <div className="toggle-overlay" onClick={() => updateSm(!sm)}></div>}
              <BlockHead size="lg">
                <BlockBetween>
                  <BlockHeadContent>
                    <BlockTitle tag="h4">Personal Information</BlockTitle>
                    <BlockDes>
                      <p>Basic info, like your name and address, that you use on Nio Platform.</p>
                    </BlockDes>
                  </BlockHeadContent>
                  <BlockHeadContent className="align-self-start d-lg-none">
                    <Button
                      className={`toggle btn btn-icon btn-trigger mt-n1 ${sm ? "active" : ""}`}
                      onClick={() => updateSm(!sm)}
                    >
                      <Icon name="menu-alt-r"></Icon>
                    </Button>
                  </BlockHeadContent>
                </BlockBetween>
              </BlockHead>

              <Block>
                <div className="nk-data data-list">
                  <div className="data-head">
                    <h6 className="overline-title">Basics</h6>
                  </div>
                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">Full Name</span>
                      <span className="data-value">{userInfo?.full_name}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">Display Name</span>
                      <span className="data-value">{userInfo?.full_name}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>
                  <div className="data-item">
                    <div className="data-col">
                      <span className="data-label">Email</span>
                      <span className="data-value">{userInfo?.email}</span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more disable">
                        <Icon name="lock-alt"></Icon>
                      </span>
                    </div>
                  </div>



                </div>
                <div className="nk-data data-list">
                  <div className="data-head">
                    <h6 className="overline-title"></h6>
                  </div>

                </div>
              </Block>

              <Modal isOpen={modal} className="modal-dialog-centered" size="lg" toggle={() => setModal(false)}>
                <a
                  href="#dropdownitem"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setModal(false);
                  }}
                  className="close"
                >
                  <Icon name="cross-sm"></Icon>
                </a>
                <ModalBody>
                  <form onSubmit={handleSubmitUpdatePersonalInformation(submitUpdatePersonalInformation)}>
                    <Row className="g-gs">
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="fw-token-address">
                            Name
                          </label>
                          <div className="form-control-wrap">
                            <input
                              placeholder="Your Full Name"
                              type="text"
                              className="form-control"
                              id="full_name"
                              defaultValue={user?.full_name}
                              {...updatePersonalInfoForm("full_name")}
                            />
                            {updatePersonalInfoErrors.full_name?.message && (
                              <span className="invalid">{updatePersonalInfoErrors.full_name?.message}</span>
                            )}
                          </div>
                        </div>
                      </Col>
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="club">
                            Email
                          </label>
                          <div className="form-control-wrap">
                            <input
                              placeholder="Your Email"
                              type="text"
                              className="form-control"
                              id="email"
                              defaultValue={user?.email}
                              {...updatePersonalInfoForm("email")}
                            />
                            {updatePersonalInfoErrors.email?.message && (
                              <span className="invalid">{updatePersonalInfoErrors.email?.message}</span>
                            )}
                          </div>
                        </div>
                      </Col>
                      <Col md="4">
                        <div className="form-group">
                          <label className="form-label" htmlFor="club">
                            Phone
                          </label>
                          <div className="form-control-wrap">
                            <input
                              placeholder="Your Invite Link"
                              type="text"
                              className="form-control"
                              id="phone"
                              defaultValue={user?.phone_number}
                              {...updatePersonalInfoForm("phone")}
                            />
                            {updatePersonalInfoErrors.phone?.message && (
                              <span className="invalid">{updatePersonalInfoErrors.phone?.message}</span>
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row className="g-gs">
                      <Col md="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor="fw-token-address">
                            Payment Method
                          </label>
                          <div className="form-control-wrap">
                            <input
                              defaultValue={systemwallet?.payment_method}
                              placeholder="Your Payment Method"
                              type="text"
                              className="form-control"
                              id="payment_method"
                              {...updatePersonalInfoForm("payment_method")}
                            />
                            {updatePersonalInfoErrors.payment_method?.message && (
                              <span className="invalid">{updatePersonalInfoErrors.payment_method?.message}</span>
                            )}
                          </div>
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="form-group">
                          <label className="form-label" htmlFor="club">
                            Wallet ID
                          </label>
                          <div className="form-control-wrap">
                            <input
                              defaultValue={systemwallet?.wallet_id}
                              placeholder="Your Wallet ID"
                              type="text"
                              className="form-control"
                              id="wallet"
                              {...updatePersonalInfoForm("wallet")}
                            />
                            {updatePersonalInfoErrors.wallet?.message && (
                              <span className="invalid">{updatePersonalInfoErrors.wallet?.message}</span>
                            )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <div className="form-group mt-2 ">
                          {!submittingUpdatePersonalInformation && (
                            <Button className="btn-round" color="primary" type="submit" size="sm">
                              Save
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </form>
                </ModalBody>
              </Modal>
            </div>
          </div>
        </Card>
      </Content>
    </React.Fragment>
  );
};

export default UserProfileRegularPage;
