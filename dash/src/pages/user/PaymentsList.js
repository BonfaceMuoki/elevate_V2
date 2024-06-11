import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { findUpper } from "../../utils/Utils";
import {
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  CardTitle,
  Button,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
} from "reactstrap";
import {
  BlockHead,
  BlockHeadContent,
  PreviewCard,
  Block,
  BlockBetween,
  BlockDes,
  BlockTitle,
  Icon,
  Row,
  Col,
  PaginationComponent,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
} from "../../components/Component";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { toast } from "react-toastify";
import { Badge } from "reactstrap";
import { useSelector } from "react-redux";
import { selectCurrentUser, selectHasInvested, setHasInvested } from "../../featuers/authSlice";
import {
  useGetPaymentsQuery,
  useVerifyPaymentMutation,
  useGetDashboardQuery,
  useDownloadPaymentOfProofQuery,
} from "../../api/admin/adminActionsApi";
import classnames from "classnames";
import UserAvatar from "../user/UserAvatar";
import Swal from "sweetalert2";
const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
function PaymentsList() {
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

  //pagination section
  const [searchText, setSearchText] = useState("");
  const [currentItems, setCurrentItems] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [ci, set] = useState(1);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [as, setAs] = useState("admin");
  const [supplierID, setSupplierID] = useState("");
  const [orderColumn, setOrderColumn] = useState("product_name");
  const [filterCategory, setFilterCategory] = useState("");

  // supplierID, as, currentPage, rowsPerPage, searchText, orderColumn, sortOrder, filterCategory
  const {
    data: allpayments,
    isLoading: loadingPayments,
    refetch: refetchPayments,
  } = useGetPaymentsQuery({ currentPage, rowsPerPage, searchText, orderColumn, sortOrder, filterCategory });
  console.log(allpayments, "allpaymentsallpayments");

  useEffect(() => {
    if (allpayments?.data?.data != null) {
      setTotalRecords(allpayments?.data?.total);
      setTableData(allpayments?.data?.data);
      // alert(totalRecords + "n" + totalRecords + "m" + rowsPerPage)
    } else {
      setTableData([{}]);
    }
  }, [loadingPayments, allpayments?.data?.data]);

  useEffect(() => {
    if (tableData != null) {
      setCurrentItems(tableData);
    }
  }, [tableData]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const orderBy = (column) => {
    setOrderColumn(column);
    setSortOrder(sortOrder === "DESC" ? "ASC" : "DESC");
    refetchPayments();
  };
  //pagination section

  const [paymentId, setPaymentId] = useState();
  // const { data: paymentProof, isLoading: loadingpaymentProof, refetch: refetchPaymentProof } = useDownloadPaymentOfProofQuery(paymentId);

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
      console.log(result, "Payment verification");
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
  // const downloadProof = (payment) => {
  //     refetchPaymentProof();
  // }

  return (
    <>
      <Head title="Tier Details" />
      <Content>
        <Block>
          <Row className="g-gs mt-3">
            <Col md="12">
              <Modal size="lg" isOpen={modalViewPaymentDetails} toggle={toggleViewPaymentDetails}>
                <ModalHeader
                  toggle={toggleViewPaymentDetails}
                  close={
                    <button className="close" onClick={toggleViewPaymentDetails}>
                      <Icon name="cross" />
                    </button>
                  }
                >
                  Payment Distribution
                </ModalHeader>
                <ModalBody>
                  <Nav tabs className="mt-n3">
                    <NavItem className="mr-1">
                      <NavLink
                        tag="a"
                        href="#tab"
                        className={classnames({ active: activeTab === "1" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          setActiveTab("1");
                        }}
                      >
                        Bonus Payments
                      </NavLink>
                    </NavItem>
                    <NavItem className="mr-1">
                      <NavLink
                        tag="a"
                        href="#tab"
                        className={classnames({ active: activeTab === "2" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          setActiveTab("2");
                        }}
                      >
                        Company Payments
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        tag="a"
                        href="#tab"
                        className={classnames({ active: activeTab === "3" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          setActiveTab("3");
                        }}
                      >
                        Matrix Payment
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        tag="a"
                        href="#tab"
                        className={classnames({ active: activeTab === "4" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          setActiveTab("4");
                        }}
                      >
                        Subscription
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        tag="a"
                        href="#tab"
                        className={classnames({ active: activeTab === "4" })}
                        onClick={(ev) => {
                          ev.preventDefault();
                          setActiveTab("4");
                        }}
                      ></NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <div className="table-responsive">
                        <table className="table table-bordered table-responsive ">
                          <thead>
                            <tr>
                              <th scope="col">Description</th>
                              <th scope="col">Amount </th>
                              <th scope="col"> Method</th>
                              <th scope="col">Status</th>
                              <th scope="col">Payment Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bonusPayments != undefined &&
                              bonusPayments.length > 0 &&
                              bonusPayments.map((bopay, key) => {
                                return (
                                  <tr key={key}>
                                    <td>{bopay.bonus_for}</td>
                                    <td>{bopay.amount_paid}</td>
                                    <td>{activePayment.payment_method}</td>
                                    <td>
                                      {activePayment.status == "PENDING ADMIN APPROVAL" ? (
                                        <Badge color="primary">{activePayment.status}</Badge>
                                      ) : (
                                        <Badge color="infor">{activePayment.status}</Badge>
                                      )}
                                    </td>
                                    <td>{bopay.created_at}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </TabPane>
                    <TabPane tabId="2">
                      <div className="table-responsive">
                        <table className="table table-bordered table-responsive ">
                          <thead>
                            <tr>
                              <th scope="col">Description</th>
                              <th scope="col">Amount </th>
                              <th scope="col"> Method</th>
                              <th scope="col">Status</th>
                              <th scope="col">Payment Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {companyPayments != undefined &&
                              companyPayments.length > 0 &&
                              companyPayments.map((copay, key) => {
                                return (
                                  <tr key={key}>
                                    <td>{copay.paid_as}</td>
                                    <td>{copay.amount_paid}</td>
                                    <td>{activePayment.payment_method}</td>
                                    <td>
                                      {activePayment.status == "PENDING ADMIN APPROVAL" ? (
                                        <Badge color="primary">{activePayment.status}</Badge>
                                      ) : (
                                        <Badge color="infor">{activePayment.status}</Badge>
                                      )}
                                    </td>
                                    <td>{copay.created_at}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </TabPane>
                    <TabPane tabId="3">
                      <div className="table-responsive">
                        <table className="table table-bordered table-responsive ">
                          <thead>
                            <tr>
                              <th scope="col">Description</th>
                              <th scope="col">Amount </th>
                              <th scope="col"> Method</th>
                              <th scope="col">Payment Status</th>
                              <th scope="col">Progression Status</th>
                              <th scope="col">Payment Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {matrixPayments != undefined &&
                              matrixPayments.length > 0 &&
                              matrixPayments.map((matpay, key) => {
                                return (
                                  <tr key={key}>
                                    <td>{matpay.contribution_tier.tier_name}</td>
                                    <td>{matpay.contribution_amount}</td>
                                    <td>{activePayment.payment_method}</td>
                                    <td>
                                      {activePayment.status == "PENDING ADMIN APPROVAL" ? (
                                        <Badge color="primary">{activePayment.status}</Badge>
                                      ) : (
                                        <Badge color="infor">{activePayment.status}</Badge>
                                      )}
                                    </td>
                                    <td>{matpay.status}</td>
                                    <td>{matpay.created_at}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </TabPane>
                  </TabContent>
                </ModalBody>
              </Modal>
              <Card className="card-bordered" style={{ height: "100%" }}>
                <CardHeader className="border-bottom">
                  <Row className={`justify-between g-2 with-export}`}>
                    <Col className="col-7 text-start" sm="4">
                      <div id="DataTables_Table_0_filter" className="dataTables_filter">
                        <label>
                          &nbsp;<br></br>
                          <input
                            type="search"
                            className="form-control form-control-sm"
                            placeholder="Search by name"
                            onChange={(e) => {
                              setCurrentPage(1);
                              setSearchText(e.target.value);
                            }}
                          />
                        </label>
                      </div>
                    </Col>
                    <Col className="col-5 text-end" sm="8">
                      <div className="datatable-filter">
                        <div className="d-flex justify-content-end ">
                          {/* {<Export data={""} />} */}
                          <div className="dataTables_length" id="DataTables_Table_0_length">
                            <label>
                              <span className="d-none d-sm-inline-block">Show</span>
                              <div className="form-control-select" style={{ width: "100%" }}>
                                {" "}
                                <select
                                  style={{ width: "100%" }}
                                  name="DataTables_Table_0_length"
                                  className="custom-select custom-select-sm form-control form-control-sm"
                                  onChange={(e) => setRowsPerPage(e.target.value)}
                                  value={rowsPerPage}
                                >
                                  <option value="10">10</option>
                                  <option value="20">20</option>
                                  <option value="40">40</option>
                                  <option value="50">50</option>
                                </select>{" "}
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody className="card-inner">
                  <DataTable className="card-stretch">
                    <DataTableBody>
                      <DataTableHead>
                        <DataTableRow>
                          <span className="sub-text">User</span>
                        </DataTableRow>
                        <DataTableRow size="mb">
                          <span className="sub-text">Paid To </span>
                        </DataTableRow>
                        <DataTableRow size="mb">
                          <span className="sub-text">Back Payments</span>
                        </DataTableRow>
                        <DataTableRow>
                          <span className="sub-text">User</span>
                        </DataTableRow>
                        <DataTableRow size="mb">
                          <span className="sub-text">Paid To </span>
                        </DataTableRow>
                        <DataTableRow size="mb">
                          <span className="sub-text">Back Payments</span>
                        </DataTableRow>
                        <DataTableRow size="mb">
                          <span className="sub-text">Actions</span>
                        </DataTableRow>
                      </DataTableHead>
                      {/*Head*/}
                      {allpayments?.data?.data != undefined &&
                        allpayments?.data?.data.length > 0 &&
                        allpayments?.data?.data.map((pay, key) => {
                          return (
                            <DataTableItem key={key}>
                              <DataTableRow>
                                {" "}
                                <div className="user-card">
                                  <UserAvatar
                                    size="sm"
                                    theme="primary"
                                    text={findUpper(pay.user.full_name)}
                                    image={""}
                                  ></UserAvatar>
                                  <div className="user-name">
                                    <span className="tb-lead">{pay.user.full_name}</span> <br></br>
                                    <span className="tb-lead">{pay.user.email}</span>
                                  </div>
                                </div>
                              </DataTableRow>
                              <DataTableRow size="mb">{pay.description}</DataTableRow>
                              <DataTableRow size="mb">{pay.amount_paid}</DataTableRow>
                              <DataTableRow size="mb">{pay.payment_method}</DataTableRow>
                              <DataTableRow size="mb">
                                <a
                                  href={`${process.env.REACT_APP_API_BASE_URL}/api/admin/donwload-payment-proof?file=${pay.payment_proof}`}
                                >
                                  <Button color="primary">Proof</Button>
                                </a>
                              </DataTableRow>
                              <DataTableRow>
                                {pay.status == "PENDING ADMIN APPROVAL" ? (
                                  <Badge color="primary">{pay.status}</Badge>
                                ) : (
                                  <Badge color="primary">{pay.status}</Badge>
                                )}
                              </DataTableRow>
                              <DataTableRow>
                                {pay.status == "PENDING ADMIN APPROVAL" ? (
                                  <>
                                    &nbsp;
                                    <Button
                                      color="primary"
                                      className="btn btn-sm mt-1"
                                      onClick={() => verifyPayment(pay)}
                                    >
                                      <Icon name="eye"></Icon>
                                      <span>Verify</span>
                                    </Button>
                                    &nbsp;
                                  </>
                                ) : (
                                  <Badge color="infor">{pay.status}</Badge>
                                )}
                                <Button
                                  color="primary"
                                  className="btn btn-sm mt-1"
                                  onClick={() => openPaymentDetails(pay)}
                                >
                                  <Icon name="eye"></Icon>
                                  <span>View</span>
                                </Button>
                              </DataTableRow>
                            </DataTableItem>
                          );
                        })}
                    </DataTableBody>
                    <div className="card-inner">
                      {allpayments?.data?.data != null && allpayments?.data?.data != undefined ? (
                        <PaginationComponent
                          itemPerPage={rowsPerPage}
                          totalItems={totalRecords}
                          paginate={paginate}
                          currentPage={currentPage}
                        />
                      ) : (
                        <div className="text-center">
                          <span className="text-silent">No data found</span>
                        </div>
                      )}
                    </div>
                  </DataTable>
                </CardBody>
                <CardFooter className="border-top"></CardFooter>
              </Card>
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
}

export default PaymentsList;
