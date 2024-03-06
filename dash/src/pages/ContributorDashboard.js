import React, { useEffect, useState } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import { Card, CardHeader, CardFooter, CardBody, CardTitle } from "reactstrap";
import { useGetAllTiersQuery } from "../api/commonEndPointsAPI";
import {
  Block,
  BlockDes,
  BlockBetween,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Button,
  Row,
  Col,
  PreviewAltCard,
  TooltipComponent,
} from "../components/Component";
import { DepositBarChart, WithdrawBarChart } from "../components/partials/charts/invest/InvestChart";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetMyInvitesQuery, useSendUserInviteMutation } from "../api/auth/authApiSlice";
import {
  useSendInvestmentMutation,
  useGetMyInvestmentsQuery,
  useGetMyDashboardQuery,
} from "../api/contributor/investmentEndPoints";
import { toast } from "react-toastify";
import { Badge, Alert, UncontrolledAlert } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectHasInvested,
  selectInviteToken,
  selectSponsorshipInviteToken,
  setActiveMemberProfile,
  selectSystemWallet,
} from "../featuers/authSlice";
import { useGetMyProfileDataQuery } from "../api/contributor/investmentEndPoints";
import Swal from "sweetalert2";

const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};

const ContributorDashboard = () => {
  const dispatch = useDispatch();
  const logged = useSelector(selectCurrentUser);
  const walletforadmin = useSelector(selectSystemWallet);
  const { data: memberDetails, isLoading: loadingUserDetails } = useGetMyProfileDataQuery(logged?.user_id);
  // console.log(memberDetails, "memberDetails");
  useEffect(() => {
    dispatch(setActiveMemberProfile(memberDetails));
  }, [memberDetails]);

  const onetimeinvitetoken = useSelector(selectInviteToken);
  const onetimesponsorshiptoken = useSelector(selectSponsorshipInviteToken);
  const onetimeinvitelink =
    process.env.REACT_APP_FRONTEND_BASE_URL + "/accepting-oinvite?oinvite_token=" + onetimeinvitetoken;

  const onetimesponsorshipinvitelink =
    process.env.REACT_APP_FRONTEND_BASE_URL + "/accepting-oinvite?oinvite_token=" + onetimesponsorshiptoken;

  const handleCopyLink = () => {
    const textArea = document.createElement("textarea");
    textArea.value = onetimeinvitelink;

    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    toastMessage("copied", "success");
  };
  const handleCopySponsorLink = () => {
    const textArea = document.createElement("textarea");
    textArea.value = onetimesponsorshipinvitelink;

    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    toastMessage("copied", "success");
  };
  const handleCopyWallet = () => {
    const textArea1 = document.createElement("textarea");
    textArea1.value = walletforadmin?.wallet_id;

    document.body.appendChild(textArea1);
    textArea1.select();
    document.execCommand("copy");
    document.body.removeChild(textArea1);
    toastMessage("copied", "success");
  };
  const handleCopyBankInfo = () => {
    const textArea1 = document.createElement("textarea");
    textArea1.value = "63073536858";

    document.body.appendChild(textArea1);
    textArea1.select();
    document.execCommand("copy");
    document.body.removeChild(textArea1);
    toastMessage("copied", "success");
  };

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
  const hasinvested = useSelector(selectHasInvested);
  const { data: alltiers, isLoading: loadingtiers, refetch: refetchMyTiers } = useGetMyInvestmentsQuery();
  // console.log(alltiers);
  const { data: allinvites, isLoading: loadingInvites, refetch: refetchInvites } = useGetMyInvitesQuery();
  // console.log(allinvites);
  const {
    data: mydashboardData,
    isLoading: loadingMyDashboard,
    refetch: refetchDashboard,
  } = useGetMyDashboardQuery(logged.user_id);
  const [sm, updateSm] = useState(false);
  const toggleForm = () => setModalForm(!modalForm);
  const [modalForm, setModalForm] = useState(false);
  const toggleInvestmentForm = () => setModalInvestmentForm(!modalInvestmentForm);
  const [modalInvestmentForm, setModalInvestmentForm] = useState(false);
  const paymentoptions = [
    { value: "SDT ERC2", label: "SDT ERC2" },
    { value: "USDT TRC20", label: "USDT TRC20" },
    { value: "USDT BEP20", label: "USDT BEP20" },
    { value: "USDC", label: "USDC" },
    { value: "DAI", label: "DAI" },
  ];
  //invite form
  const schemaInvite = yup.object().shape({
    full_name: yup.string().required(" Provide his/her name"),
    invite_email: yup.string().required("Please provide  email through which the user will be notified"),
    invite_phone: yup.string().required("Please provide the user phone number"),
  });

  const {
    register: inviteUserForm,
    handleSubmit: handleSubmitUserInvite,
    setValue: setInviteValue,
    isLoading: loadingInviteDetails,
    formState: { errors: inviteUserErrors },
    reset: resetInviteUserForm,
  } = useForm({
    resolver: yupResolver(schemaInvite),
  });
  const [sendUserInvive, { isLoading: loadingInvite }] = useSendUserInviteMutation();
  const submitInvite = async (data) => {
    const formData = new FormData();
    formData.append("invite_name", data.full_name);
    formData.append("invite_email", data.invite_email);
    formData.append("invite_phone", data.invite_phone);
    formData.append("registration_link", process.env.REACT_APP_FRONTEND_BASE_URL + "/accepting-invite");
    const result = await sendUserInvive(formData);

    if ("error" in result) {
      toastMessage(result.error.data.message, "error");
      if ("backendvalerrors" in result.error.data) {
      }
    } else {
      toggleForm();
      toastMessage(result.data.message, "success");
      resetInviteUserForm();
      refetchInvites();
    }
  };
  //invite form
  //investment form
  const schemaInvest = yup.object().shape({
    amount: yup.string().required("Amount is required"),
    paymentProof: yup
      .mixed()
      .required("Please upload a file")
      .nullable()
      .test("fileSize", "Payment Proof size is too large", (value) => {
        if (value[0]) {
          return value[0].size <= 1024 * 1024 * 2;
        }
        return true;
      })
      .test("fileType", "Only PDF/JPG,PNG,JPEG files are allowed", (value) => {
        if (value[0]) {
          return [
            "application/pdf",
            "pdf",
            "jpg",
            "jpeg",
            "png",
            "PNG",
            "JPEG",
            "JPG",
            "image/jpg",
            "image/jpeg",
            "image/png",
            "image/PNG",
            "image/JPEG",
            "image/JPG",
          ].includes(value[0].type);
        }
        return true;
      }),
    tier: yup.string().required("Tier Is required"),
  });

  const {
    register: investmentForm,
    handleSubmit: handleSubmitUserInvestment,
    setValue: setInvestValue,
    isLoading: loadingInvestmentDetails,
    formState: { errors: investmentErrors },
    reset: resetInvestmenrForm,
  } = useForm({
    resolver: yupResolver(schemaInvest),
  });
  const [sendInvestment, { isLoading: loadingInvestmestment }] = useSendInvestmentMutation();
  const submitInvestment = async (data) => {
    console.log("data");
    console.log(data);
    const formData = new FormData();
    formData.append("amount", data.amount);
    formData.append("paymentProof", data.paymentProof[0]);
    formData.append("club", data.club);
    formData.append("tier", data.tier);
    const result = await sendInvestment(formData);
    console.log(result);
    if ("error" in result) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: result.error.data.message,
        focusConfirm: false,
      });
      if ("backendvalerrors" in result.error.data) {
      }
    } else {
      refetchMyTiers();
      toggleInvestmentForm();
      Swal.fire({
        icon: "success",
        title: "Upload of Payment",
        text: result.data.message,
        focusConfirm: false,
      });
      // toastMessage(result.data.message, "success");

      // resetInvestmenrForm();
    }
  };
  //investment form
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const handleMouseDown = (e) => {
    if (e.button === 2) {
      // Right mouse button
      e.preventDefault();
    }
  };
  return (
    <>
      <Head title="Invest Dashboard" />
      <Content>
        <BlockHead size="sm" style={{ width: "100%" }}>
          <BlockBetween style={{ width: "100%" }}>
            <BlockHeadContent style={{ width: "100%" }}>
              <BlockTitle page>Home Dashboard</BlockTitle>
              <BlockDes className="text-soft" style={{ width: "100%" }}>
                <Row>
                  <Col md="3">
                    <Alert
                      className="alert-icon"
                      color="info"
                      style={{ width: "100%", height: "210px", marginTop: "20px" }}
                    >
                      <Icon name="alert-circle" />
                      <strong>Method of payment is {walletforadmin?.payment_method} </strong>
                      <br></br>
                      <Button color="primary" outline className="btn-dim btn-white  " onClick={handleCopyWallet}>
                        <Icon name="briefcase"></Icon>
                        <span>Copy Wallet ID </span>
                      </Button>
                      &nbsp;&nbsp;
                    </Alert>
                  </Col>
                  <Col md="4">
                    <Alert
                      className="alert-icon"
                      color="info"
                      style={{ width: "100%", height: "210px", marginTop: "20px" }}
                    >
                      <Icon name="alert-circle" />
                      <p>You can also use our Bank Details as captured below</p>
                      <strong> BANK NAME: First National Bank(FNB) </strong>
                      <br></br>
                      <strong> ACC NO: 63073536858 </strong>
                      <br></br>
                      <strong> BRANCH CODE: 252005 </strong>
                      <br></br>
                      <Button color="primary" outline className="btn-dim btn-white  " onClick={handleCopyBankInfo}>
                        <Icon name="briefcase"></Icon>
                        <span>Copy Account Number </span>
                      </Button>
                      &nbsp;&nbsp;
                    </Alert>
                  </Col>
                  <Col md="5">
                    <Alert
                      className="alert-icon"
                      color="info"
                      style={{ width: "100%", height: "210px", marginTop: "20px" }}
                    >
                      <Icon name="alert-circle" />
                      <h3>Invite Links </h3>
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr>
                            <td>Sponsorship Link</td>
                            <td>
                              <Button
                                style={{ width: "100%" }}
                                color="primary"
                                outline
                                className="btn-dim btn-white  "
                                onClick={handleCopySponsorLink}
                              >
                                <Icon name="user-add-fill"></Icon>
                                <span>Copy Sponsored Link </span>
                              </Button>
                            </td>
                          </tr>
                          <tr>
                            <td>Invite Link</td>
                            <td>
                              <Button
                                color="primary"
                                style={{ width: "100%", marginTop: "5px" }}
                                outline
                                className="btn-dim btn-white  "
                                onClick={handleCopyLink}
                              >
                                <Icon name="user-add-fill"></Icon>
                                <span>Copy Link </span>
                              </Button>
                            </td>
                          </tr>
                          <tr>
                            <td>Invite</td>
                            <td>
                              <Button
                                style={{ width: "100%", marginTop: "5px" }}
                                color="primary"
                                outline
                                className="btn-dim btn-white  "
                                onClick={toggleForm}
                                onContextMenu={handleContextMenu}
                                onMouseDown={handleMouseDown}
                              >
                                <Icon name="user-add-fill"></Icon>
                                <span>Invite User </span>
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </Alert>
                  </Col>
                </Row>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="more-v"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}></div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row className="g-gs">
            <Col md="6">
              <PreviewAltCard className="card-full">
                <div className="card-title-group align-start mb-0">
                  <div className="card-title">
                    <h6 className="subtitle">My Invites</h6>
                  </div>
                  <div className="card-tools">
                    <TooltipComponent
                      iconClass="card-hint"
                      icon="help-fill"
                      direction="left"
                      id="invest-deposit"
                      text="Total Deposited"
                    ></TooltipComponent>
                  </div>
                </div>
                <div className="card-amount">
                  <span className="amount">{mydashboardData?.allinvites}</span>
                  <span className="change up text-success">{/* <Icon name="arrow-long-up"></Icon>1.93% */}</span>
                </div>
                <div className="invest-data">
                  <div className="invest-data-amount g-2">
                    <div className="invest-data-history">
                      <div className="title">Uncompleted</div>
                      <span className="amount">
                        {mydashboardData?.unCompletedInvites} <span className="currency currency-usd"> </span>
                      </span>
                    </div>
                    <div className="invest-data-history">
                      <div className="title">Completed</div>
                      <span className="amount">
                        {mydashboardData?.completedInvites} <span className="currency currency-usd"> </span>
                      </span>
                    </div>
                  </div>
                  <div className="invest-data-ck">{/* <DepositBarChart /> */}</div>
                </div>
              </PreviewAltCard>
            </Col>

            <Col md="6">
              <PreviewAltCard className="card-full">
                <div className="card-title-group align-start mb-0">
                  <div className="card-title">
                    <h6 className="subtitle">My Invite Bonus</h6>
                  </div>
                  <div className="card-tools">
                    <TooltipComponent
                      iconClass="card-hint"
                      icon="help-fill"
                      direction="left"
                      id="invest-withdraw"
                      text="Total Withdrawn"
                    ></TooltipComponent>
                  </div>
                </div>
                <div className="card-amount">
                  <span className="amount">
                    {mydashboardData?.totalbBonus} <span className="currency currency-usd"></span>
                  </span>
                  <span className="change down text-danger">{/* <Icon name="arrow-long-down"></Icon>1.93% */}</span>
                </div>
                <div className="invest-data">
                  <div className="invest-data-amount g-2">
                    <div className="invest-data-history">
                      <div className="title">This Week</div>
                      <div className="amount">
                        {mydashboardData?.totalBonusThisWeek}
                        <span className="currency currency-usd"> </span>
                      </div>
                    </div>
                    <div className="invest-data-history">
                      <div className="title">Total</div>
                      <div className="amount">
                        {mydashboardData?.totalBonusThisMonth}
                        <span className="currency currency-usd"> </span>
                      </div>
                    </div>
                  </div>
                  <div className="invest-data-ck">{/* <WithdrawBarChart /> */}</div>
                </div>
              </PreviewAltCard>
            </Col>
          </Row>
          <Row className="g-gs mt-3">
            <Col md="6">
              <Modal isOpen={modalInvestmentForm} toggle={toggleInvestmentForm}>
                <ModalHeader
                  toggle={toggleInvestmentForm}
                  close={
                    <button className="close" onClick={toggleInvestmentForm}>
                      <Icon name="cross" />
                    </button>
                  }
                >
                  Your Membership Details
                </ModalHeader>
                <ModalBody>
                  <form onSubmit={handleSubmitUserInvestment(submitInvestment)}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="club">
                        Club
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          id="club"
                          defaultValue="Club"
                          {...investmentForm("club")}
                        />
                        {investmentErrors.club?.message && (
                          <span className="invalid">{investmentErrors.club?.message}</span>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="tier">
                        Tier
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="text"
                          className="form-control"
                          id="tier"
                          readOnly
                          defaultValue="Tier 1"
                          {...investmentForm("tier")}
                        />
                        {investmentErrors.tier?.message && (
                          <span className="invalid">{investmentErrors.tier?.message}</span>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="amount">
                        Amount
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="number"
                          className="form-control"
                          id="phone-no"
                          defaultValue="50"
                          readOnly
                          {...investmentForm("amount")}
                        />
                        {investmentErrors.amount?.message && (
                          <span className="invalid">{investmentErrors.amount?.message}</span>
                        )}
                      </div>
                    </div>
                    <p>
                      Please make a payment to account () . Upload the payment Proof in form of PDF, JPG OR JPEG below.
                    </p>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">
                        Payment Proof
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="file"
                          className="form-control"
                          id="payment_proof"
                          {...investmentForm("paymentProof")}
                          required
                        />
                        {investmentErrors.paymentProof?.message && (
                          <span className="invalid">{investmentErrors.paymentProof?.message}</span>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      {!loadingInvestmestment && (
                        <Button color="primary" type="submit" size="lg">
                          Send Payment Details.
                        </Button>
                      )}
                    </div>
                  </form>
                </ModalBody>
                <ModalFooter className="bg-light">
                  <span className="sub-text"></span>
                </ModalFooter>
              </Modal>
              <Card className="card-bordered" style={{ height: "100%" }}>
                <CardHeader className="border-bottom">
                  <div className="card-title-group">
                    <CardTitle>
                      <h6 className="title">Membership Contributions</h6>
                    </CardTitle>
                    <div className="card-tools">
                      <a
                        href="#viewall"
                        className="link"
                        onClick={(ev) => {
                          ev.preventDefault();
                        }}
                      >
                        {logged.investment_done === 0 ? (
                          <Button
                            color="primary"
                            outline
                            className="btn-dim btn-white  "
                            onClick={toggleInvestmentForm}
                          >
                            <Icon name="briefcase"></Icon>
                            <span>Pay Membership Fee </span>
                          </Button>
                        ) : (
                          <Button color="primary" outline className="btn-dim btn-white  " disabled>
                            <Icon name="briefcase"></Icon>
                            <span>Pay Membership Fee </span>
                          </Button>
                        )}
                      </a>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="card-inner">
                  <div className="table-responsive">
                    <table className="table table-bordered table-responsive ">
                      <thead>
                        <tr>
                          <th scope="col">Club</th>
                          <th scope="col">Tier</th>
                          {/* <th scope="col">Contribution Amount</th>
                          <th scope="col">Paybacks</th> */}
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alltiers != undefined &&
                          alltiers.length > 0 &&
                          alltiers.map((tier, key) => {
                            return (
                              <tr key={key}>
                                <td>{tier.contribution_tier.club}</td>
                                <td>{tier.contribution_tier.tier_name}</td>
                                {/* <td>{tier.contribution_amount}</td>
                                <td>{tier.payback_paid_total}</td> */}
                                <td>
                                  {tier.status === "Not Progress and Receiving" && (
                                    <Badge color="warning">Receiving Payments</Badge>
                                  )}
                                  {tier.status === "Progressed But Receiving" && (
                                    <Badge color="warning">Actively Receiving</Badge>
                                  )}
                                  {tier.status === "Completed" && <Badge color="success">Completed</Badge>}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
                <CardFooter className="border-top"></CardFooter>
              </Card>
            </Col>

            <Col md="6" style={{ maxHeight: "" }}>
              <Modal isOpen={modalForm} toggle={toggleForm}>
                <ModalHeader
                  toggle={toggleForm}
                  close={
                    <button className="close" onClick={toggleForm}>
                      <Icon name="cross" />
                    </button>
                  }
                >
                  User Information
                </ModalHeader>
                <ModalBody>
                  <form onSubmit={handleSubmitUserInvite(submitInvite)}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="full-name">
                        Full Name
                      </label>
                      <div className="form-control-wrap">
                        <input type="text" className="form-control" id="full-name" {...inviteUserForm("full_name")} />
                        {inviteUserErrors.full_name?.message && (
                          <span className="invalid">{inviteUserErrors.full_name?.message}</span>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">
                        Email
                      </label>
                      <div className="form-control-wrap">
                        <input type="text" className="form-control" id="email" {...inviteUserForm("invite_email")} />
                        {inviteUserErrors.invite_email?.message && (
                          <span className="invalid">{inviteUserErrors.invite_email?.message}</span>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone-no">
                        Phone No
                      </label>
                      <div className="form-control-wrap">
                        <input
                          type="number"
                          className="form-control"
                          id="phone-no"
                          defaultValue=""
                          {...inviteUserForm("invite_phone")}
                        />
                        {inviteUserErrors.invite_phone?.message && (
                          <span className="invalid">{inviteUserErrors.invite_phone?.message}</span>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      {!loadingInvite && (
                        <Button color="primary" type="submit" size="lg">
                          Send Invite
                        </Button>
                      )}
                    </div>
                  </form>
                </ModalBody>
                <ModalFooter className="bg-light">
                  <span className="sub-text"></span>
                </ModalFooter>
              </Modal>
              <Card className="card-bordered" style={{ height: "100%" }}>
                <CardHeader className="border-bottom">
                  <div className="card-title-group">
                    <CardTitle>
                      <h6 className="title">Invites You have made</h6>
                    </CardTitle>
                    <div className="card-tools">
                      <a
                        href="#viewall"
                        className="link"
                        onClick={(ev) => {
                          ev.preventDefault();
                        }}
                      >
                        {hasinvested == 1 && (
                          <span>
                            <br></br>
                            &nbsp;&nbsp;
                          </span>
                        )}
                        {hasinvested == 0 && (
                          <Alert className="alert-icon" color="warning" style={{ width: "100%" }}>
                            <Icon name="alert-circle" />
                            <strong>Please pay your membership fee to get an invite Link </strong>
                          </Alert>
                        )}
                      </a>
                      0
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="card-inner" style={{ maxHeight: "100%", overflowY: "hidden " }}>
                  <div className="table-responsive">
                    <table className="table table-bordered table-responsive ">
                      <thead>
                        <tr>
                          <th scope="col">Invite Name</th>
                          <th scope="col">Invite Phone</th>
                          <th scope="col">Invite Email</th>
                          <th scope="col">Reg Type</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allinvites != undefined &&
                          allinvites.length > 0 &&
                          allinvites.map((invite, key) => {
                            let is_sponsored = 1;
                            if (invite?.one_time_invite_record?.length > 0) {
                              is_sponsored = 1;
                              if (invite?.one_time_invite_record[0]?.is_sponsorship === 1) {
                                is_sponsored = 1;
                              } else {
                                is_sponsored = 0;
                              }
                            } else {
                              is_sponsored = 0;
                              is_sponsored = 1;
                            }
                            return (
                              <tr key={key}>
                                <td>{invite.invite_name}</td>
                                <td>{invite.invite_phone}</td>
                                <td>{invite.invite_email}</td>
                                <td>
                                  {is_sponsored === 0 ? (
                                    <Badge color="info">Non Sponsored</Badge>
                                  ) : (
                                    <Badge color="info">Sponsored </Badge>
                                  )}
                                </td>
                                <td>
                                  {invite.completed == 0 ? (
                                    <Badge color="warning">Not Completed</Badge>
                                  ) : (
                                    <Badge color="success">Completed</Badge>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
                <CardFooter className="border-top"></CardFooter>
              </Card>
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
};

export default ContributorDashboard;
