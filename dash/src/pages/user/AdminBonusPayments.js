import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { findUpper } from "../../utils/Utils";
import {
  BlockHead,
  BlockHeadContent,
  PreviewCard,
  Block,
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
import UserAvatar from "./UserAvatar";
import { toast } from "react-toastify";
import { Badge, DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetUsersQuery,
  useDeactivateUserMutation,
  useGetTierEarningsQuery,
  usePayMemberBonusMutation,
  useGetBonusPaymentsQuery,
} from "../../api/admin/adminActionsApi";
import { Link, useNavigate } from "react-router-dom";
import { setActiveUserDetails } from "../../featuers/authSlice";
const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
function AdminBonusPayments() {
  const navigateto = useNavigate();
  const dispatch = useDispatch();
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
  const [searchText, setSearchText] = useState("");
  const [activateDeactivateUser, { isLoading: submittingactivation }] = useDeactivateUserMutation();
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const { data: users, isLoading: loadingusers, refetch: refetchUsers } = useGetUsersQuery();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [currentItems, setcurrentItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const {
    data: tierEarnings,
    isLoading: loadingTierEarnings,
    refetch: refetchTierEarnings,
  } = useGetTierEarningsQuery();
  const {
    data: bonusPayments,
    isLoading: loadingBonusPayment,
    refetch: refetchBonusPayments0,
  } = useGetBonusPaymentsQuery({ currentPage, searchText, rowsPerPage });

  useEffect(() => {
    if (bonusPayments?.data?.data != null) {
      setTotalRecords(bonusPayments?.data?.total);
      setTableData(bonusPayments?.data?.data);
      // alert(totalRecords + "n" + totalRecords + "m" + rowsPerPage)
    } else {
      setTableData([{}]);
    }
  }, [loadingBonusPayment, bonusPayments?.data?.data]);

  useEffect(() => {
    if (tableData != null) {
      const indexOfLastItem = currentPage * itemPerPage;
      const indexOfFirstItem = indexOfLastItem - itemPerPage;
      setcurrentItems(tableData?.slice(indexOfFirstItem, indexOfLastItem));
    }
  }, [tableData]);
  const activateDeactivate = async (user, action) => {
    const forData = new FormData();
    forData.append("action", action);
    forData.append("user", user.id);
    const result = await activateDeactivateUser(forData);

    if ("error" in result) {
      toastMessage(result.error.data.message, "error");
    } else {
      toastMessage(result.data.message, "success");
      refetchUsers();

      // resetInvestmenrForm();
    }
  };
  const [payMember, { isLoading: payingMember }] = usePayMemberBonusMutation();
  const sendPayment = async (earning, action) => {
    console.log(earning);
    if (earning.recipient === null) {
      toastMessage("The are no associated payment details", "error");
      return;
    }
    if (earning?.recipient[0].wallet_id === null || earning?.recipient[0].wallet_id === undefined) {
      toastMessage("The are no associated payment details", "error");
      return;
    }

    const formData = new FormData();
    formData.append("earning", earning.id);
    formData.append("method", earning.recipient[0].payment_method);
    formData.append("wallet_id", earning.recipient[0].wallet_id);
    const result = await payMember(formData);

    if ("error" in result) {
      toastMessage(result.error.data.message, "error");
    } else {
      toastMessage(result.data.message, "success");
      refetchBonusPayments0();
    }
  };
  return (
    <>
      <Head title="Member Payments" />
      <Content page="">
        <Block size="">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Bonus Payments</BlockTitle>
            </BlockHeadContent>
          </BlockHead>
          <PreviewCard>
            <BlockHead size="" wide="">
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
                              <option value="25">25</option>
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
            </BlockHead>
            <DataTable className="card-stretch">
              <DataTableBody>
                <DataTableHead>
                  <DataTableRow>
                    <span className="sub-text">User Name</span>
                  </DataTableRow>
                  <DataTableRow>
                    <span className="sub-text">Invitee</span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Amount To Pay </span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Status </span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Action </span>
                  </DataTableRow>
                </DataTableHead>
                {bonusPayments?.data?.data != undefined &&
                  bonusPayments?.data?.data != null &&
                  bonusPayments?.data?.data.map((bonusPayment) => {
                    return (
                      <DataTableItem key={bonusPayment.id}>
                        <DataTableRow>
                          <div className="user-card">
                            <UserAvatar
                              theme="default"
                              text={findUpper(
                                bonusPayment.recipient[0].full_name != null &&
                                  bonusPayment.recipient[0].full_name != undefined
                                  ? bonusPayment.recipient[0].full_name
                                  : ""
                              )}
                              image=""
                            ></UserAvatar>
                            <div className="user-info">
                              <span className="tb-lead">
                                {bonusPayment.recipient[0].full_name}{" "}
                                <span
                                  className={`dot dot-${
                                    bonusPayment.recipient[0].status === "Active"
                                      ? "success"
                                      : bonusPayment.recipient[0].status === "Pending"
                                      ? "warning"
                                      : "danger"
                                  } d-md-none ms-1`}
                                ></span>
                              </span>
                              <span>{bonusPayment.recipient[0].email}</span>
                              <br></br>
                              {/* <span></span><br></br> */}
                              <span>
                                {bonusPayment.recipient[0]?.payment_method} - {bonusPayment.recipient[0]?.wallet_id}
                              </span>
                              <br></br>
                              {/* user_account */}
                            </div>
                          </div>
                        </DataTableRow>
                        <DataTableRow>
                          <div className="user-card">
                            <UserAvatar
                              theme="default"
                              text={findUpper(
                                bonusPayment.payer.full_name != null && bonusPayment.payer.full_name != undefined
                                  ? bonusPayment.payer.full_name
                                  : ""
                              )}
                              image=""
                            ></UserAvatar>
                            <div className="user-info">
                              <span className="tb-lead">
                                {bonusPayment.payer.full_name}{" "}
                                <span
                                  className={`dot dot-${
                                    bonusPayment.payer.status === "Active"
                                      ? "success"
                                      : bonusPayment.payer.status === "Pending"
                                      ? "warning"
                                      : "danger"
                                  } d-md-none ms-1`}
                                ></span>
                              </span>
                              <span>{bonusPayment.payer.email}</span>
                              <br></br>
                              {/* <span></span><br></br> */}
                              {/* <span>{bonusPayment.recipient?.wallet_id} - {bonusPayment.recipient?.user_account?.payment_method}</span><br></br> */}
                              {/* user_account */}
                            </div>
                          </div>
                        </DataTableRow>

                        <DataTableRow size="mb">{bonusPayment.amount_paid}</DataTableRow>
                        <DataTableRow size="mb">
                          {bonusPayment.payment_status == 1 && <Badge color="success">Paid</Badge>}
                          {bonusPayment.payment_status == 0 && <Badge color="warning">Pending</Badge>}
                        </DataTableRow>
                        <DataTableRow>
                          {bonusPayment.payment_status == 1 && (
                            <Badge color="success" onClick={() => sendPayment(bonusPayment, "cpay")}>
                              Cancel
                            </Badge>
                          )}
                          {bonusPayment.payment_status == 0 && (
                            <Badge color="warning" onClick={() => sendPayment(bonusPayment)}>
                              Pay
                            </Badge>
                          )}
                        </DataTableRow>
                      </DataTableItem>
                    );
                  })}
              </DataTableBody>
              <div className="card-inner">
                {totalRecords > 0 ? (
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
          </PreviewCard>
        </Block>
      </Content>
    </>
  );
}

export default AdminBonusPayments;
