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
import { useSendProductCreationMutation, useSendProductUpdateMutation, useGetLinkInviteesMutation } from "../../api/admin/adminActionsApi";
import { useGetUserSubLinksQuery, useSendSubscriptionInviteesFettchMutation, useUpdatePersonalInformationMutation } from "../../api/commonEndPointsAPI";
import {
  useGetSubLinksQuery,
  useSendAddRegistrationLinkMutation,
  useSendUpdateRegistrationLinkMutation,
} from "../../api/commonEndPointsAPI";
import { Link, useNavigate } from "react-router-dom";
import { selectCurrentUser, selectMainRole, selectActiveMember, selectActiveUserDetails } from "../../featuers/authSlice";
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
function UserProfile() {
  const [myLinkInviteees, setMyLinkInviteees] = useState();
  const currentRole = useSelector(selectMainRole);
  const currentuser = useSelector(selectCurrentUser);
  const activeuserd = useSelector(selectActiveUserDetails);
  const activememberd = useSelector(selectActiveMember);
  const navigate = useNavigate();
  const user = (currentRole?.role_name != "Contributor") ? activeuserd : activememberd;


  //   const [subLinks,setSubLinks]
  const { data: sublinks, isLoading: loadingsubscriptionLinks } = useGetSubLinksQuery();
  const { data: usersublinks, isLoading: loadingusersubscriptionLinks, refetch: refetchUserSubLinks } = useGetUserSubLinksQuery(user.id);

  //   refetchUserSubLinks
  const [existingLinksss, setExistingLinksss] = useState();
  useEffect(() => {
    if (sublinks != undefined) {
      const restructuredData = sublinks.map(({ id, link }) => ({
        id: id,
        value: id,
        label: link,
      }));
      setExistingLinksss(restructuredData);
    }
  }, [loadingsubscriptionLinks]);

  useEffect(() => {
    const cleanupFunction = () => {
      // const confirmation = window.confirm("Are you sure you want to leave this page?");
      // if (!confirmation) {
      //   throw new Error("Cancelled navigation");
      // }
    };
    return cleanupFunction;
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
  const userinvites = user.invites;

  const [currentItems, setcurrentItems] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (userinvites != null) {
      setTableData(userinvites);
    } else {
      setTableData([{}]);
    }
  }, [userinvites]);

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
  //setup for tiers
  const contributions = user.matrix_payments;

  const [currentItemsContri, setcurrentItemsContri] = useState([]);
  const [rowsPerPageContri, setRowsPerPageContri] = useState(10);
  const [tableDataContri, setTableDataContri] = useState([]);

  useEffect(() => {
    if (contributions != null) {
      setTableDataContri(contributions);
    } else {
      setTableDataContri([{}]);
    }
  }, [contributions]);

  const paginateContri = (pageNumber) => setRowsPerPageContri(pageNumber);
  const [currentPageContri, setCurrentPageContri] = useState(1);
  const [itemPerPageContri, setItemPerPageContri] = useState(10);
  useEffect(() => {
    if (tableDataContri != null) {
      const indexOfLastItemContri = currentPageContri * itemPerPageContri;
      const indexOfFirstItemContri = indexOfLastItemContri - itemPerPageContri;
      setcurrentItemsContri(tableDataContri?.slice(indexOfFirstItemContri, indexOfLastItemContri));
    }
  }, [tableDataContri]);
  ///close setup for tiers
  const activateDeactivate = async (supplier, action) => { };
  const sendMail = () => { };
  const viewSupplierProfile = () => { };
  const [modalAddRegistrationLink, setAddModalRegistrationLink] = useState();
  const toggleaddRegistrationLinkModal = () => {
    setAddModalRegistrationLink(!modalAddRegistrationLink);
  };
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

  const submitUpdatePersonalInformation = async (data) => {

    const formData = new FormData();
    formData.append("full_name", data.full_name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("payment_method", data.payment_method);
    formData.append("wallet_id", data.wallet);
    formData.append("user", user?.id);
    formData.append("sys", 0);
    let result = await sendUpdatePersonalInfor(formData);


    if ("error" in result) {

      toastMessage(result.error.data.message, "warning");
      if ("backendvalerrors" in result.error.data) {
        toastMessage(result.error.data.message.join("\n"), "error");
      }
    } else {
      togglemodalUpdatePersonalInfo();
      toastMessage(result.data.message, "success");
      resetUpdatePersonalInfoForm()
    }
  };
  //update personal information form


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
  const submitAddregistrationLinkRegistration = async (data) => {
    const formData = new FormData();
    formData.append("parent_url", data.parent_link[0].id);
    formData.append("your_registration_invite", data.my_registration_invite);
    formData.append("user", user.id);
    let result = null;
    if (editingRegistrationLink) {
      formData.append("action", "update");
      formData.append("registration_link_id", activeRegistrationLink.id);
      result = await sendUpdateaddregistrationlinkRequest(formData);
    } else {

      formData.append("action", "add");
      result = await sendAddaddregistrationlinkRequest(formData);
    }

    if ("error" in result) {

      toastMessage(result.error.data.message.join("\n"), "error");
      if ("backendvalerrors" in result.error.data) {
      }
    } else {
      toggleaddRegistrationLinkModal();
      toastMessage(result.data.message, "success");
      resetAddRegistrationLinkForm()
      refetchUserSubLinks();
      setEditingngRegistrationLink(false);
    }
  };
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
  const [sendInviteesFetchRequest, { isLoading: loadingInvitees }] = useGetLinkInviteesMutation();
  const showLinkSubscriptionInviteees = async (sublink) => {

    const formData = new FormData();
    formData.append("user", user?.id);
    formData.append("tier", sublink?.associated_parent_link?.subscription_tier_level);
    const result = await sendInviteesFetchRequest(formData);
    setModalShowInvitees(true);

    if ("error" in result) {

    } else {

      setMyLinkInviteees(result?.data?.pay_back_entries);
    }
  }

  ///close setup for tiers
  const [modalShowInvitees, setModalShowInvitees] = useState();
  const toggleShowInvitees = () => {
    setModalShowInvitees(!modalShowInvitees);
  };
  //add supplier form
  // edit personal indexOfFirstItem
  const showProfileUpdateModal = () => {
    togglemodalUpdatePersonalInfo();
  }
  // edit personal information

  const myRef = React.createRef();
  return (
    <>
      <Modal size="lg" isOpen={modalShowInvitees} toggle={toggleShowInvitees}>
        <ModalHeader
          toggle={toggleShowInvitees}
          close={
            <button className="close" onClick={toggleShowInvitees}>
              <Icon name="cross" />
            </button>
          }
        >

        </ModalHeader>
        <ModalBody>
          {
            (myLinkInviteees && myLinkInviteees != null && myLinkInviteees != undefined) &&
            <table className="table table-bordered table-striped">
              <thead><tr><th>Full Name</th></tr></thead>
              <tbody>
                {
                  myLinkInviteees.map((invit) => {

                    return <tr key={invit.id}>
                      {/* <td>{key}</td> */}
                      <td>{invit.full_name}</td>
                    </tr>
                  })
                }
              </tbody>
            </table>
          }
        </ModalBody>
        <ModalFooter className="bg-light">
          <span className="sub-text"></span>
        </ModalFooter>
      </Modal>

      <Modal size="lg" isOpen={modalAddRegistrationLink} toggle={toggleaddRegistrationLinkModal}>
        <ModalHeader
          toggle={toggleaddRegistrationLinkModal}
          close={
            <button className="close" onClick={toggleaddRegistrationLinkModal}>
              <Icon name="cross" />
            </button>
          }
        >
          {editingRegistrationLink ? "Edit User Subscription Links" : "Add Subscription Link"}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmitRegistrationLinkForm(submitAddregistrationLinkRegistration)}>
            <Row className="g-gs">
              <Col md="6">
                <div className="form-group">
                  <label className="form-label" htmlFor="fw-token-address">
                    Parent Link
                  </label>
                  <div className="form-control-wrap">
                    {existingLinksss && existingLinksss.length > 0 && (
                      <Controller
                        name="parent_link"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <Select isMulti value={selectedLinkValue} options={existingLinksss} isSearchable={true} isClearable={true} {...field} />
                        )}
                      />
                    )}
                    {addRegistrationLinkErrrors.parent_link && (
                      <span className="invalid" style={{ color: "#e85347", fontSize: "11px", fontStyle: "italic" }}>
                        {addRegistrationLinkErrrors.parent_link?.message}
                      </span>
                    )}
                  </div>
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    Your Invite Link
                  </label>
                  <div className="form-control-wrap">
                    <input
                      placeholder="Your Invite Link"
                      type="text"
                      className="form-control"
                      id="supplier_name"
                      {...addRegstrationLinkForm("my_registration_invite")}
                    />
                    {addRegistrationLinkErrrors.my_registration_invite?.message && (
                      <span className="invalid">{addRegistrationLinkErrrors.my_registration_invite?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="form-group mt-2 ">
                  {!submittingAddRegistrationLinkForm && (
                    <Button className="btn-round" color="primary" type="submit" size="sm">
                      Save
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </form>
        </ModalBody>
        <ModalFooter className="bg-light">
          <span className="sub-text"></span>
        </ModalFooter>
      </Modal>
      {/* modal update wallet */}
      <Modal size="lg" isOpen={modalUpdatePersonalInfo} toggle={togglemodalUpdatePersonalInfo}>
        <ModalHeader
          toggle={togglemodalUpdatePersonalInfo}
          close={
            <button className="close" onClick={togglemodalUpdatePersonalInfo}>
              <Icon name="cross" />
            </button>
          }
        >
          Update Personal Information
        </ModalHeader>
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
                      <span className="invalid">{addRegistrationLinkErrrors.full_name?.message}</span>
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
        <ModalFooter className="bg-light">
          <span className="sub-text"></span>
        </ModalFooter>
      </Modal>
      {/* modal update wallet */}
      {/* ///modal add supplier */}
      <Head title="List Of Elavate  Members" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent></BlockHeadContent>
            <BlockHeadContent>
              <Button color="light" outline className="bg-white d-none d-sm-inline-flex" onClick={() => navigate(-1)}>
                <Icon name="arrow-left"></Icon>
                <span>Back</span>
              </Button>
              <a
                href="#back"
                onClick={(ev) => {
                  ev.preventDefault();
                  navigate(-1);
                }}
                className="btn btn-icon btn-outline-light bg-white d-inline-flex d-sm-none"
              >
                <Icon name="arrow-left"></Icon>
              </a>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Card className="card-bordered">
            <div className="card-aside-wrap" id="user-detail-block">
              <div className="card-content">
                <ul className="nav nav-tabs nav-tabs-mb-icon nav-tabs-card">
                  <li className="nav-item">
                    <a
                      className={activeTab == "invites" ? "nav-link active" : "nav-link"}
                      href="#invites"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setActiveTab("invites");
                      }}
                    >
                      <Icon name="repeat"></Icon>
                      <span>User Invites</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={activeTab == "contributions" ? "nav-link active" : "nav-link"}
                      href="#tiers"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setActiveTab("contributions");
                      }}
                    >
                      <Icon name="user-circle"></Icon>
                      <span>Tier Contributions</span>
                    </a>
                  </li>

                  <li className="nav-item">
                    <a
                      className={activeTab == "sub_links" ? "nav-link active" : "nav-link"}
                      href="#links"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setActiveTab("sub_links");
                      }}
                    >
                      <Icon name="repeat"></Icon>
                      <span>Subscription Links</span>
                    </a>
                  </li>

                  <li className="nav-item nav-item-trigger d-xxl-none">
                    <Button className={`toggle btn-icon btn-trigger ${sideBar && "active"}`} onClick={toggle}>
                      <Icon name="user-list-fill"></Icon>
                    </Button>
                  </li>
                </ul>
                {activeTab == "invites" && (
                  <div className={activeTab == "invites" ? "card-inner active" : "card-inner"}>
                    <Block>
                      <BlockHead></BlockHead>
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
                      <BlockContent>
                        <DataTable className="card-stretch">
                          <DataTableBody>
                            <DataTableHead>
                              <DataTableRow>
                                <span className="sub-text">Invitee Name</span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">Email </span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">Phone Number </span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">Registration Status</span>
                              </DataTableRow>
                            </DataTableHead>
                            {/*Head*/}
                            {userinvites != undefined &&
                              userinvites != null &&
                              userinvites.map((userinvite) => {
                                let userinvite_split = userinvite.invite_name.split(" ");
                                let passed_for_avatar = "";
                                if (userinvite_split.length == 1) {
                                  passed_for_avatar = userinvite_split[0];
                                } else if (userinvite_split.length == 2) {
                                  passed_for_avatar = userinvite_split[0] + " " + userinvite_split[1];
                                } else if (userinvite_split.length > 2) {
                                  passed_for_avatar = userinvite_split[0] + " " + userinvite_split[1];
                                }
                                return (
                                  <DataTableItem key={userinvite.id}>
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
                                            {userinvite?.invite_name}{" "}
                                            <span
                                              className={`dot dot-${userinvite.status === 1
                                                ? "success"
                                                : userinvite?.status === 0
                                                  ? "warning"
                                                  : "danger"
                                                } d-md-none ms-1`}
                                            >
                                              {userinvite.status === 1 ? "Completed" : "Pending"}
                                            </span>
                                          </span>
                                          {/* <span>{supplier?.sup}</span> */}
                                        </div>
                                      </div>
                                      {/* </Link> */}
                                    </DataTableRow>
                                    <DataTableRow size="mb">{userinvite?.invite_email}</DataTableRow>
                                    <DataTableRow size="mb">{userinvite?.invite_phone}</DataTableRow>
                                    <DataTableRow size="mb">
                                      {userinvite.completed == 1 && (
                                        <Badge color="success" style={{ width: "50%" }}>
                                          Completed
                                        </Badge>
                                      )}
                                      {userinvite.completed == 0 && (
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
                            {userinvites != null && userinvites != undefined ? (
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
                      </BlockContent>
                    </Block>
                  </div>
                )}

                {activeTab == "contributions" && (
                  <div className="card-inner" id="tiers">
                    <Block>
                      <BlockHead></BlockHead>
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
                                        onChange={(e) => setRowsPerPageContri(e.target.value)}
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
                      <BlockContent>
                        <DataTable className="card-stretch">
                          <DataTableBody>
                            <DataTableHead>
                              <DataTableRow>
                                <span className="sub-text">Tier Name</span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">Membership Amount Fees  </span>
                              </DataTableRow>
                              {
                                (currentRole?.role_name != "Contributor") && <>
                                  <DataTableRow size="mb">
                                    <span className="sub-text">Payback Count </span>
                                  </DataTableRow>
                                  <DataTableRow size="mb">
                                    <span className="sub-text">Payback Amount</span>
                                  </DataTableRow>
                                </>
                              }

                              <DataTableRow size="mb">
                                <span className="sub-text">Status</span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">Action</span>
                              </DataTableRow>
                            </DataTableHead>
                            {/*Head*/}
                            {contributions != undefined &&
                              contributions != null &&
                              contributions.map((contri) => {
                                return (
                                  <DataTableItem key={contri.id}>
                                    <DataTableRow>
                                      Club {contri?.contribution_tier.club} - {contri?.contribution_tier.tier_name}
                                    </DataTableRow>
                                    <DataTableRow size="mb">{contri?.contribution_amount}</DataTableRow>
                                    {
                                      (currentRole?.role_name != "Contributor") && <>
                                        <DataTableRow size="mb">{contri?.payback_count}</DataTableRow>
                                        <DataTableRow size="mb">{contri?.payback_paid_total}</DataTableRow>
                                      </>
                                    }

                                    <DataTableRow size="mb">
                                      {contri.status == "Completed" && (
                                        <Badge color="success" style={{ width: "100%" }}>
                                          {contri.status}
                                        </Badge>
                                      )}
                                      {contri.status == "Progressed But Receiving" && (
                                        <Badge color="warning" style={{ width: "100%" }}>
                                          {contri.status}
                                        </Badge>
                                      )}
                                      {contri.status == "Not Progressed and Not Receiving" && (
                                        <Badge color="danger" style={{ width: "100%" }}>
                                          {contri.status}
                                        </Badge>
                                      )}
                                    </DataTableRow>
                                    <DataTableRow size="mb">
                                      <ul className="nk-tb-actions gx-1">
                                        <li>
                                          <UncontrolledDropdown>
                                            <DropdownToggle
                                              tag="a"
                                              className="dropdown-toggle btn btn-icon btn-trigger"
                                            >
                                              <Icon name="more-h"></Icon>
                                            </DropdownToggle>
                                            <DropdownMenu end>
                                              <ul className="link-list-opt no-bdr">
                                                <React.Fragment>
                                                  <li onClick={() => activateDeactivate(user, "deactivate")}>
                                                    <DropdownItem
                                                      tag="a"
                                                      href="#edit"
                                                      onClick={(ev) => {
                                                        ev.preventDefault();
                                                      }}
                                                    >
                                                      <Icon name="list"></Icon>
                                                      <span>Pay Backs</span>
                                                    </DropdownItem>
                                                  </li>
                                                </React.Fragment>
                                              </ul>
                                            </DropdownMenu>
                                          </UncontrolledDropdown>
                                        </li>
                                      </ul>
                                    </DataTableRow>
                                  </DataTableItem>
                                );
                              })}
                          </DataTableBody>
                          <div className="card-inner">
                            {userinvites != null && userinvites != undefined ? (
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
                      </BlockContent>
                    </Block>
                  </div>
                )}
                {activeTab == "sub_links" && (
                  <div className="card-inner" id="links">
                    <Block>
                      <BlockHead>
                        <Button
                          className="btn-round"
                          color="primary"
                          size="sm"
                          onClick={toggleaddRegistrationLinkModal}
                        >
                          Add Subscription Link
                        </Button>
                      </BlockHead>
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
                                        onChange={(e) => setRowsPerPageContri(e.target.value)}
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
                      <BlockContent>
                        <DataTable className="card-stretch">
                          <DataTableBody>
                            <DataTableHead>
                              <DataTableRow>
                                <span className="sub-text">Parent Link</span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">Invite Link </span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">Monthly Subscription </span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">Annual Subscription</span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">Status</span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">Action</span>
                              </DataTableRow>
                            </DataTableHead>
                            {/*Head*/}
                            {usersublinks != undefined &&
                              usersublinks.links != null &&
                              usersublinks.links.map((sublink) => {
                                return (
                                  <DataTableItem key={sublink.id}>
                                    <DataTableRow>
                                      {sublink?.associated_parent_link.link}
                                    </DataTableRow>
                                    <DataTableRow size="mb">{sublink?.link_value}</DataTableRow>
                                    <DataTableRow size="mb">$ {sublink.associated_parent_link?.monthly_subscription_amount}</DataTableRow>
                                    <DataTableRow size="mb">$ {sublink.associated_parent_link?.annual_subscription_amount}</DataTableRow>
                                    <DataTableRow size="mb">
                                      {sublink.status == "Subscription Paid and Back Registrations Completed" && (
                                        <Badge color="success" style={{ width: "100%" }}>
                                          {sublink.status}
                                        </Badge>
                                      )}
                                      {sublink.status == "Subscription Paid and Receiving back Registration" && (
                                        <Badge color="warning" style={{ width: "100%" }}>
                                          {sublink.status}
                                        </Badge>
                                      )}
                                      {sublink.status == "Pending Subscription Fee Payment" && (
                                        <Badge color="danger" style={{ width: "100%" }}>
                                          {sublink.status}
                                        </Badge>
                                      )}
                                    </DataTableRow>
                                    <DataTableRow size="mb">
                                      <ul className="nk-tb-actions gx-1">
                                        <li>
                                          <UncontrolledDropdown>
                                            <DropdownToggle
                                              tag="a"
                                              className="dropdown-toggle btn btn-icon btn-trigger"
                                            >
                                              <Icon name="more-h"></Icon>
                                            </DropdownToggle>
                                            <DropdownMenu end>
                                              <ul className="link-list-opt no-bdr">
                                                <React.Fragment>
                                                  <li onClick={() => showUpdateRegistrationLinkModal(sublink, "deactivate")}>
                                                    <DropdownItem
                                                      tag="a"
                                                      href="#edit"
                                                      onClick={(ev) => {
                                                        ev.preventDefault();
                                                      }}
                                                    >
                                                      <Icon name="list"></Icon>
                                                      <span>Update</span>
                                                    </DropdownItem>
                                                  </li>
                                                  <li onClick={() => showLinkSubscriptionInviteees(sublink, "deactivate")}>
                                                    <DropdownItem
                                                      tag="a"
                                                      href="#edit"
                                                      onClick={(ev) => {
                                                        ev.preventDefault();
                                                      }}
                                                    >
                                                      <Icon name="list"></Icon>
                                                      <span>Show Invitees</span>
                                                    </DropdownItem>
                                                  </li>
                                                </React.Fragment>
                                              </ul>
                                            </DropdownMenu>
                                          </UncontrolledDropdown>
                                        </li>
                                      </ul>
                                    </DataTableRow>
                                  </DataTableItem>
                                );
                              })}
                          </DataTableBody>
                          <div className="card-inner">
                            {userinvites != null && userinvites != undefined ? (
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
                      </BlockContent>
                    </Block>
                  </div>
                )}
              </div>

              <Sidebar toggleState={sideBar}>
                <div className="card-inner">
                  <div className="user-card user-card-s2 mt-5 mt-xxl-0">
                    <UserAvatar className="lg" theme="primary" text={findUpper("")} />
                    <div className="user-info">
                      <Badge color="outline-light" pill className="ucap"></Badge>
                      <h5>{user.full_name}</h5>
                      <span className="sub-text">{user.email}</span>
                      <span className="sub-text">{user.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="card-inner card-inner-sm">
                  <ul className="btn-toolbar justify-center gx-1">
                    <li>
                      <Button
                        href="#tool"
                        onClick={(ev) => {
                          ev.preventDefault();
                          showProfileUpdateModal();
                        }}
                        className="btn-trigger btn-icon"
                      >
                        <Icon name="edit"></Icon>
                      </Button>
                    </li>


                  </ul>
                </div>

                <div className="card-inner">
                  <Row className="text-center">
                    <Col size="4">
                      <div className="profile-stats">
                        <span className="amount">{user.invites.length}</span>
                        <span className="sub-text">Invites</span>
                      </div>
                    </Col>
                    <Col size="4">
                      <div className="profile-stats">
                        <span className="amount">{user.matrix_payments.length}</span>
                        <span className="sub-text">Tiers Done</span>
                      </div>
                    </Col>
                    <Col size="4">
                      <div className="profile-stats">
                        <span className="amount">{user.user_subscription_links.length}</span>
                        <span className="sub-text">Subscriptions</span>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="card-inner">
                  <OverlineTitle tag="h6" className="mb-3">
                    About The User
                  </OverlineTitle>
                  {/* <p>{supplier.about_supplier}</p> */}
                </div>
              </Sidebar>
              {sideBar && <div className="toggle-overlay" onClick={() => toggle()}></div>}
            </div>
          </Card>
        </Block>
      </Content>
    </>
  );
}

export default UserProfile;
