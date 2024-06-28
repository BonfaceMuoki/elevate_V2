import React, { useEffect, useState } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import { findUpper } from "../utils/Utils";
import {
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  CardTitle,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
} from "reactstrap";
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
import { useSendInvestmentMutation, useGetMyInvestmentsQuery } from "../api/contributor/investmentEndPoints";
import { toast } from "react-toastify";
import { Badge } from "reactstrap";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectHasInvested, setHasInvested } from "../featuers/authSlice";
import {
  useGetPaymentsQuery,
  useVerifyPaymentMutation,
  useGetDashboardQuery,
  useDownloadPaymentOfProofQuery,
} from "../api/admin/adminActionsApi";
import classnames from "classnames";
import UserAvatar from "./user/UserAvatar";
import Swal from "sweetalert2";
import PaymentsList from "./user/PaymentsList";
const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};

const AdminDashboard = () => {
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

  const logged = useSelector(selectCurrentUser);
  const hasinvested = useSelector(selectHasInvested);
  const { data: allpayments, isLoading: loadingtiers, refetch: refetchPayments } = useGetPaymentsQuery();
  const [paymentId, setPaymentId] = useState();
  // const { data: paymentProof, isLoading: loadingpaymentProof, refetch: refetchPaymentProof } = useDownloadPaymentOfProofQuery(paymentId);

  const [payments, setPayments] = useState([]);
  useEffect(() => {
    if (allpayments) {
      setPayments(allpayments?.data.data);
    }
  });
  const { data: allinvites, isLoading: loadingInvites, refetch: refetchInvites } = useGetMyInvitesQuery();
  const { data: admindashboard, isLoading: loadingdashboard, refetch: refetchDashboard } = useGetDashboardQuery();

  const [sm, updateSm] = useState(false);

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
      .test("fileType", "Only PDF files are allowed", (value) => {
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
  //investment form

  //payment distribution

  const [modalViewPaymentDetails, setModalViewPaymentDetails] = useState(false);

  const [modalTab, setModalTab] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = () => setModalTab(!modalTab);

  const toggleViewPaymentDetails = (payment) => {
    setModalViewPaymentDetails(!modalViewPaymentDetails);
  };

  const [activePayment, setActivePayment] = useState();
  const [companyPayments, setCompanyPayments] = useState();
  const [matrixPayments, setMatrixPayments] = useState();
  const [bonusPayments, setBonusPayments] = useState();
  const [subscriptionPayments, setSubscriptionPayments] = useState();
  const openPaymentDetails = (payment) => {
    setActivePayment(payment);
    setCompanyPayments(payment.company_payments);
    setBonusPayments(payment.bonuses);
    setMatrixPayments(payment.matrix_payments);
    setModalViewPaymentDetails(true);
  };

  //cloase payment distribution
  const [modalViewPDistribution, setModalViewPDistribution] = useState();

  const rejectPayment = (payment) => {};
  const [submitPaymentVerification, { isLoading: isSendingPaymentVerification }] = useVerifyPaymentMutation();
  const verifyPayment = async (payment) => {
    Swal.fire({
      title: "Are you sure you want to verify this payment?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
    }).then((result) => {
      if (result.isConfirmed) {
        //submit verification
        subMitVerification();

        //close submit verification
      } else {
        Swal.fire("Verification Cancelled!", "You have successfully cancelled.", "success");
      }
    });
    const subMitVerification = async () => {
      const formdata = new FormData();

      formdata.append("action", 1);
      formdata.append("payment", JSON.stringify(payment));
      const result = await submitPaymentVerification(formdata);
      if ("error" in result) {
        toastMessage(result.error.data.message, "error");
      } else {
        toggleInvestmentForm();
        toastMessage(result.data.message, "success");
        refetchPayments();
        // resetInvestmenrForm();
      }
    };
  };
  const addCommas = (newvalue) => {
    if (newvalue != null) {
      return newvalue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return "0.00";
    }
  };

  const getTotalEntryPayments = () => {
    if (admindashboard?.totalIntialNonSponsoredPayments && admindashboard?.totalIntialSponsoredPayments) {
      return (
        parseInt(admindashboard?.totalIntialNonSponsoredPayments) +
        parseInt(admindashboard?.totalIntialSponsoredPayments)
      );
    }
  };
  // const downloadProof = (payment) => {
  //     refetchPaymentProof();
  // }

  return (
    <>
      <Head title="Invest Dashboard" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Home Dashboard</BlockTitle>
              <BlockDes className="text-soft">
                <p>Logged in as Elevate Admin !!!!</p>
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
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  {/* <ul className="nk-block-tools g-3">
                    <li>
                      <Button color="primary" outline className="btn-dim btn-white">
                        <Icon name="user-add-fill"></Icon>
                        <span>Invite </span>
                      </Button>
                    </li>
                  </ul> */}
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row className="g-gs">
            <Col md="4">
              <PreviewAltCard className="card-full">
                <div className="card-title-group align-start mb-0">
                  <div className="card-title">
                    <h6 className="subtitle">TOTAL REGISTERED USERS</h6>
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
                  <span className="amount">{admindashboard?.thisyearsusers}</span>
                  <span className="change up text-success">{/* <Icon name="arrow-long-up"></Icon>1.93% */}</span>
                </div>
                <div className="invest-data">
                  <div className="invest-data-amount g-2">
                    <div className="invest-data-history">
                      <div className="title">Non Sponsored Paid Users</div>
                      <span className="amount">
                        {admindashboard?.totalIntialNonSponsoredPaidUsers}
                        <span className="currency currency-usd"> </span>
                      </span>
                      <div className="title">Sponsored Paid Users</div>
                      <span className="amount">
                        {admindashboard?.totalIntialSponsoredPaidUsers}
                        <span className="currency currency-usd"> </span>
                      </span>
                    </div>
                    <div className="invest-data-history">
                      <div className="title">Non Paid Users</div>
                      <span className="amount">
                        {admindashboard?.nonpaidUsers} <span className="currency currency-usd"> </span>
                      </span>
                    </div>
                  </div>
                </div>
              </PreviewAltCard>
            </Col>
            <Col md="4">
              <PreviewAltCard className="card-full">
                <div className="card-title-group align-start mb-0">
                  <div className="card-title">
                    <h6 className="subtitle">TOTAL ENTRY PAYMENTS</h6>
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
                  <span className="amount"> ${addCommas(getTotalEntryPayments())}</span>
                  <span className="change up text-success">{/* <Icon name="arrow-long-up"></Icon>1.93% */}</span>
                </div>
                <div className="invest-data">
                  <div className="invest-data-amount g-2">
                    <div className="invest-data-history">
                      <div className="title">Sponsored Payments </div>
                      <span className="amount">
                        ${addCommas(admindashboard?.totalIntialSponsoredPayments)}
                        <span className="currency currency-usd"> </span>
                      </span>
                    </div>
                    <div className="invest-data-history">
                      <div className="title">Non Sponsored Payments </div>
                      <span className="amount">
                        ${addCommas(admindashboard?.totalIntialNonSponsoredPayments)}{" "}
                        <span className="currency currency-usd"> </span>
                      </span>
                    </div>
                  </div>
                </div>
              </PreviewAltCard>
            </Col>

            <Col md="4">
              <PreviewAltCard className="card-full">
                <div className="card-title-group align-start mb-0">
                  <div className="card-title">
                    <h6 className="subtitle">REVOLVING PAYMENTS</h6>
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
                    ${addCommas(admindashboard?.totalpayments)}
                    <span className="currency currency-usd"></span>
                  </span>
                  <span className="change down text-danger">{/* <Icon name="arrow-long-down"></Icon>1.93% */}</span>
                </div>
                <div className="invest-data">
                  <div className="invest-data-amount g-2">
                    <div className="invest-data-history">
                      <div className="title">Company Payments </div>
                      <div className="amount">
                        ${addCommas(admindashboard?.totalcompanyPayments)}{" "}
                        <span className="currency currency-usd"> </span>
                      </div>
                    </div>
                    <div className="invest-data-history">
                      <div className="title">Matrix Payments</div>
                      <div className="amount">
                        ${addCommas(admindashboard?.payments)} <span className="currency currency-usd"> </span>
                      </div>
                    </div>
                    <div className="invest-data-history">
                      <div className="title">Bonus Payments</div>
                      <div className="amount">
                        ${addCommas(admindashboard?.payments)} <span className="currency currency-usd"> </span>
                      </div>
                    </div>
                  </div>
                </div>
              </PreviewAltCard>
            </Col>
            <Col md="12">
              <PaymentsList />
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
};

export default AdminDashboard;
