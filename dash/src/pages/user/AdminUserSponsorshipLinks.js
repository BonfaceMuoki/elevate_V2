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
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
  Button,
} from "reactstrap";
import {
  BlockHead,
  BlockHeadContent,
  PreviewCard,
  Block,
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
  BackTo,
  RSelect,
} from "../../components/Component";
import classnames from "classnames";
import UserAvatar from "./UserAvatar";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Badge, DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetUsersQuery,
  useGetSponsorshipLinksQuery,
  useDeactivateUserMutation,
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
function AdminusersList() {
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
  const [activateDeactivateUser, { isLoading: submittingactivation }] = useDeactivateUserMutation();
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const { data: users, isLoading: loadingusers, refetch: refetchUsers } = useGetSponsorshipLinksQuery();
  const [currentItems, setcurrentItems] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (users != null) {
      setTableData(users?.data);
    } else {
      setTableData([{}]);
    }
  }, [users]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
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
  const sendMail = () => {};
  const viewUserProfile = (user) => {
    dispatch(setActiveUserDetails(user));
    navigateto("/user-profile");
  };
  const handleCopyLink = (token) => {
    const textArea1 = document.createElement("textarea");
    textArea1.value = `${process.env.REACT_APP_FRONTEND_BASE_URL}/accepting-oinvite?oinvite_token=${token}`;
    document.body.appendChild(textArea1);
    textArea1.select();
    document.execCommand("copy");
    document.body.removeChild(textArea1);
    toastMessage("copied", "success");
  };
  return (
    <>
      <Head title="List Of Elavate  Members" />
      <Content page="">
        <Block size="">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">User Registration ponsorship</BlockTitle>
            </BlockHeadContent>
          </BlockHead>

          <PreviewCard>
            <BlockHead size="" wide="">
              <Row className={`justify-between g-2 with-export}`}>
                <Col className="col-7 text-start" sm="4">
                  <div id="DataTables_Table_0_filter" className="dataTables_filter">
                    <label>
                      &nbsp;<br></br>
                      <input type="search" className="form-control form-control-sm" placeholder="Search by name" />
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
                    <span className="sub-text">Names </span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Tier 2 Payback</span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Amount Used For Sponsorships</span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Sponsored List</span>
                  </DataTableRow>
                </DataTableHead>
                {users != undefined &&
                  users != null &&
                  users.data.map((user) => {
                    let eligiblesponsorships = 0;
                    if (user?.payback_paid_total > 150) {
                      eligiblesponsorships = Math.floor(
                        (user?.payback_paid_total - (150 + user.sponsorship_total_used + 60)) / 50
                      );
                    }
                    return (
                      <DataTableItem key={user.id}>
                        <DataTableRow>
                          {/* <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${user.id}`}> */}
                          <div className="user-card">
                            <UserAvatar
                              theme="default"
                              text={findUpper(
                                user.full_name != null && user.full_name != undefined ? user.full_name : ""
                              )}
                              image=""
                            ></UserAvatar>
                            <div className="user-info">
                              <span className="tb-lead">
                                {user?.full_name}{" "}
                                <span
                                  className={`dot dot-${
                                    user.status === "Active"
                                      ? "success"
                                      : user?.status === "Pending"
                                      ? "warning"
                                      : "danger"
                                  } d-md-none ms-1`}
                                ></span>
                              </span>
                              <span>{user?.email}</span>
                            </div>
                          </div>
                          &nbsp; <br />
                          <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                            {user.user.user_one_time_invite_links.map((va, ke) => {
                              if (va.is_sponsorship === 1 && eligiblesponsorships > 0) {
                                return (
                                  <Button
                                    color="primary"
                                    outline
                                    className="btn-dim btn-white  "
                                    onClick={() => handleCopyLink(va.invite_token)}
                                  >
                                    <Icon name="briefcase"></Icon>
                                    <span>Sponsorship Link </span>
                                  </Button>
                                );
                              } else if (va.is_sponsorship === 0) {
                                return (
                                  <Button color="primary" outline onClick={() => handleCopyLink(va.invite_token)}>
                                    <Icon name="briefcase"></Icon>
                                    <span>Normal Link </span>
                                  </Button>
                                );
                              }
                            })}
                          </div>
                          {/* </Link> */}
                        </DataTableRow>
                        <DataTableRow size="mb">{user?.payback_paid_total}</DataTableRow>
                        <DataTableRow size="mb">{user?.sponsorship_total_used}</DataTableRow>
                        <DataTableRow size="mb">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <td>Name</td>
                                <td>Email</td>
                              </tr>
                            </thead>
                            {user.sponsored_registrations.map((valu, ke) => {
                              return (
                                <tr>
                                  <td>{valu.full_name}</td>
                                  <td>{valu.email}</td>
                                </tr>
                              );
                            })}
                          </table>
                        </DataTableRow>
                      </DataTableItem>
                    );
                  })}
              </DataTableBody>
              <div className="card-inner">
                {users != null && users != undefined ? (
                  <PaginationComponent
                    itemPerPage={itemPerPage}
                    totalItems={tableData?.length}
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

export default AdminusersList;
