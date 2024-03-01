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
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
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
  BackTo,
  RSelect,
  Sidebar,
  OverlineTitle,
  BlockContent,
} from "../../components/Component";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import classnames from "classnames";
import UserAvatar from "./UserAvatar";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Badge, DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { useSelector } from "react-redux";
import { useGetTierDetailsQuery } from "../../api/admin/adminActionsApi";
import { useGetUserSubLinksQuery } from "../../api/commonEndPointsAPI";
import {
  useGetSubLinksQuery,
  useSendAddRegistrationLinkMutation,
  useSendUpdateRegistrationLinkMutation,
} from "../../api/commonEndPointsAPI";
import { Link, useNavigate } from "react-router-dom";
import { selectActiveGlobalTier } from "../../featuers/authSlice";
import makeAnimated from "react-select/animated";
import Select from "react-select";

const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
const animatedComponents = makeAnimated();
function TierDetails() {
  const navigate = useNavigate();
  const tier = useSelector(selectActiveGlobalTier);

  //   const [subLinks,setSubLinks]
  const { data: sublinks, isLoading: loadingsubscriptionLinks } = useGetSubLinksQuery();
  const { data: tierDetails, isLoading: loadingTierDetails, refetch: refetchTierDetails } = useGetTierDetailsQuery(tier.id);

  const [sm, updateSm] = useState(false);
  //   refetchUserSubLinks
  useEffect(() => {

  }, []);

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
  //setup for invites


  const [currentItems, setcurrentItems] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (tierDetails != null) {
      setTableData(tierDetails);
    } else {
      setTableData([{}]);
    }
  }, [tierDetails]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  useEffect(() => {
    if (tableData != null) {
      const indexOfLastItem = currentPage * itemPerPage;
      const indexOfFirstItem = indexOfLastItem - itemPerPage;
      setcurrentItems(tableData?.slice(indexOfFirstItem, indexOfLastItem));
    }
  }, [tableData]);
  ///close setup for invites

  const activateDeactivate = async (supplier, action) => { };
  const sendMail = () => { };
  const viewSupplierProfile = () => { };
  const [modalAddRegistrationLink, setAddModalRegistrationLink] = useState();
  const toggleaddRegistrationLinkModal = () => {
    setAddModalRegistrationLink(!modalAddRegistrationLink);
  };
  //add supplier form
  const addregistrationlinkschema = yup.object().shape({
    // parent_link: yup.string().required("The Link category is required"),
    my_registration_invite: yup.string().required("Please provide your invite link"),
    parent_link: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.string(),
          value: yup.string(),
          label: yup.string(),
        })
      )
      .min(1, "Please choose only one link")
      .max(1, "Please choose only one link."),
  });
  const {
    register: addRegstrationLinkForm,
    handleSubmit: handleSubmitRegistrationLinkForm,
    setValue: setRegistrationLinkValue,
    isLoading: submittingAddRegistrationLinkForm,
    formState: { errors: addRegistrationLinkErrrors },
    reset: resetAddRegistrationLinkForm,
    control,
  } = useForm({
    resolver: yupResolver(addregistrationlinkschema),
  });
  const [sendAddaddregistrationlinkRequest, { isLoading: addinSupplier }] = useSendAddRegistrationLinkMutation();
  const [sendUpdateaddregistrationlinkRequest, { isLoading: updatingSupplier }] =
    useSendUpdateRegistrationLinkMutation();

  //invite form
  // updating product org
  const [editingRegistrationLink, setEditingngRegistrationLink] = useState(false);
  const [activeRegistrationLink, setActiveRegistrationLink] = useState(null);
  const showAddModal = (product) => {
    resetAddRegistrationLinkForm();
    setActiveRegistrationLink(null);
    setEditingngRegistrationLink(false);
    // setModalAddRegistrationLink(true);
  };
  const [selectedLinkValue, setSelectedLinkValue] = useState(null);

  const showUpdateRegistrationLinkModal = async (registrationlink) => {

    setActiveRegistrationLink(registrationlink);
    setRegistrationLinkValue("parent_link", [{
      id: registrationlink.subscriplink_link_id,
      value: registrationlink.subscriplink_link_id,
      label: registrationlink.associated_parent_link.link,
    }]);
    setRegistrationLinkValue("my_registration_invite", registrationlink.link_value);

    // if(selectedLinkValue!=null){
    setEditingngRegistrationLink(true);
    setAddModalRegistrationLink(true);
    // }

  };
  // updating product org
  const [sideBar, setSidebar] = useState(false);
  // function to toggle sidebar
  const toggle = () => {
    setSidebar(!sideBar);
  };

  useEffect(() => {
    sideBar ? document.body.classList.add("toggle-shown") : document.body.classList.remove("toggle-shown");
  }, [sideBar]);
  const [activeTab, setActiveTab] = useState("invites");
  const myRef = React.createRef();
  const handleRefreshList = () => {
    refetchTierDetails();
  }

  return (
    <>
      <Head title="Tier Details" />
      <Content onFocus={refetchTierDetails}>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>System Elevate Tier Details</BlockTitle>
              <BlockDes className="text-soft">
                <p>Logged in as Admin !!!!</p>
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

          <Row className="g-gs mt-3">
            <Col md="12">

              <Card className="card-bordered" style={{ height: "100%" }}>
                <CardHeader className="border-bottom">
                  <div className="card-title-group">
                    <CardTitle>
                      <h6 className="title">Investment Tiers &nbsp;  <Button color="primary" size="sm" onClick={handleRefreshList}> Refresh </Button></h6>
                    </CardTitle>
                    <div className="card-tools">
                      <a
                        href="#viewall"
                        className="link"
                        onClick={(ev) => {
                          ev.preventDefault();
                        }}
                      >


                      </a>
                    </div>
                  </div>
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
                        <DataTableRow size="mb">
                          <span className="sub-text"></span>
                        </DataTableRow>
                      </DataTableHead>
                      {/*Head*/}
                      {tierDetails != undefined &&
                        tierDetails != null &&
                        tierDetails.map((tierDetail) => {

                          let user_split = tierDetail.user.full_name.split(" ");
                          let passed_for_avatar = "";

                          if (user_split.length == 1) {

                            passed_for_avatar = tierDetail.user.full_name[0];

                          } else if (user_split.length == 2) {
                            passed_for_avatar = user_split[0] + " " + user_split[1];
                          } else if (user_split.length > 2) {
                            passed_for_avatar = user_split[0] + " " + user_split[1];
                          }

                          return (
                            <DataTableItem key={tierDetail.id}>
                              <DataTableRow>
                                {/* <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${supplier.id}`}> */}
                                <div className="user-card">
                                  <UserAvatar
                                    theme="default"
                                    text={findUpper(passed_for_avatar)}
                                    image=""
                                  ></UserAvatar>
                                  <div className="user-info">
                                    <span className="tb-lead">
                                      {tierDetail.user.full_name}{" "}
                                      <span
                                        className={`dot dot-${tierDetail.admin_Approved === "Approved"
                                          ? "success"
                                          : tierDetail.admin_Approved === 0
                                            ? "warning"
                                            : "danger"
                                          } d-md-none ms-1`}
                                      >
                                        {tierDetail.admin_Approved === "Approved" ? "Completed" : "Pending"}
                                      </span>
                                    </span>
                                    {/* <span>{supplier?.sup}</span> */}
                                  </div>
                                </div>
                                {/* </Link> */}
                              </DataTableRow>
                              <DataTableRow size="mb">{tierDetail?.paid_To?.full_name}</DataTableRow>
                              <DataTableRow size="mb">
                                <table className="table table-bordered">
                                  <thead>
                                    <tr>
                                      <th scope="col">Member Name</th>
                                      <th scope="col">Date Paid</th>
                                      <th scope="col">Amount Paid</th>
                                      <th scope="col">Payment Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      tierDetail.pay_back_entries.map((payback, paybackkey) => {
                                        return (
                                          <tr key={paybackkey}>
                                            <td>{payback.full_name}</td>
                                            <td>{payback.created_at}</td>
                                            <td>
                                              {payback.contribution_amount}
                                            </td>
                                            <td>
                                              {payback.payment_status != "" && <Badge color="info">{payback.payment_status}</Badge>}
                                            </td>
                                          </tr>
                                        )
                                      })

                                    }

                                  </tbody>
                                </table>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                {tierDetail.admin_Approved == "Approved" && (
                                  <Badge color="success" style={{ width: "50%" }}>
                                    Completed
                                  </Badge>
                                )}
                                {tierDetail.admin_Approved == "Pending" && (
                                  <Badge color="warning" style={{ width: "50%" }}>
                                    Pending
                                  </Badge>
                                )}
                              </DataTableRow>
                            </DataTableItem>
                          );
                        })}
                    </DataTableBody>
                    <div className="card-inner">
                      {tierDetails != null && tierDetails != undefined ? (
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

export default TierDetails;
