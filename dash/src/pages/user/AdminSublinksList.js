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
  Modal, ModalBody, ModalHeader, ModalFooter
} from "reactstrap";
import {
  BlockHead,
  BlockHeadContent,
  PreviewCard,
  Block,
  BlockDes,
  BlockBetween,
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
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import classnames from "classnames";
import UserAvatar from "./UserAvatar";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Badge, DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useSendSubscriptionLinkRegistrationMutation, useSendSubscriptionLinkUpdateMutation, useSendSupplierUpdateMutation } from "../../api/admin/adminActionsApi";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useGetSubLinksQuery, useGetAllTiersQuery } from "../../api/commonEndPointsAPI";
import Select from "react-select";
const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
function SubscriptionLinksList() {
  const { data: alltiers, isLoading: loadingtiers } = useGetAllTiersQuery();
  const [existingLinksss, setExistingLinksss] = useState();
  const [selectedLinkValue, setSelectedLinkValue] = useState(null);
  useEffect(() => {
    if (alltiers != undefined) {
      const restructuredData = alltiers.map(({ id, club, tier_name }) => ({
        id: id,
        value: id,
        label: 'club ' + club + ' ' + tier_name,
      }));
      setExistingLinksss(restructuredData);
    }
  }, [loadingtiers]);
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const { data: subscriptionlinks, isLoading: loadingsublinks, refetch: refetchsubscriptionlinks } = useGetSubLinksQuery();
  const [currentItems, setcurrentItems] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (subscriptionlinks != null) {
      setTableData(subscriptionlinks);
    } else {
      setTableData([{}]);
    }
  }, [subscriptionlinks]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  useEffect(() => {
    if (tableData != null) {
      const indexOfLastItem = currentPage * itemPerPage;
      const indexOfFirstItem = indexOfLastItem - itemPerPage;
      setcurrentItems(tableData?.slice(indexOfFirstItem, indexOfLastItem));
    }
  }, [tableData]);
  const activateDeactivate = async (supplier, action) => { };

  const navigateto = useNavigate();


  const [modalAddSubscriptionDetails, setModalAddSubscriptionDetails] = useState();

  const toggleaddSupplierModal = () => {
    setModalAddSubscriptionDetails(!modalAddSubscriptionDetails);
  }
  //add supplier form
  const addsubscriptionlinkschema = yup.object().shape({
    subscription_link: yup.string().required(" Provide subscription Link"),
    monthly_subscription: yup.string().required("Provide Monthly Subscription amount"),
    annual_subscription: yup.string().required("Provide Annual Subscription amount"),
    sponsoring_organization: yup.string().required("Sponsoring Organization is required"),
    description: yup.string().required("Description is required"),
    subscription_tier_level: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.string(),
          value: yup.string(),
          label: yup.string(),
        })
      )
      .min(1, "Please choose only one Level")
      .max(1, "Please choose only one Level.")
  });

  const {
    register: addSubscriptionLinkForm,
    handleSubmit: handleSubmitSupplier,
    setValue: setSupplierValue,
    isLoading: submittingaddSubscriptionLinkForm,
    formState: { errors: addSubscriptionLinkErrors },
    reset: resetaddSubscriptionLinkForm,
    control
  } = useForm({
    resolver: yupResolver(addsubscriptionlinkschema),
  });

  const [sendAddSupplierRequest, { isLoading: addinSupplier }] = useSendSubscriptionLinkRegistrationMutation();
  const [sendUpdateSupplierRequest, { isLoading: updatingSupplier }] = useSendSubscriptionLinkUpdateMutation();
  const submitSupplierRegistration = async (data) => {

    const formData = new FormData();
    formData.append("subscription_link", data.subscription_link);
    formData.append("monthly_subscription", data.monthly_subscription);
    formData.append("annual_subscription", data.annual_subscription);
    formData.append("sponsoring_organization", data.sponsoring_organization);
    formData.append("description", data.description);
    formData.append("subscription_tier_level", data.subscription_tier_level[0].id);
    let result = null;
    if (editingSupplier) {
      formData.append("link", activeSubscriptionLink.id);
      result = await sendUpdateSupplierRequest(formData);
    } else {
      result = await sendAddSupplierRequest(formData);
    }

    
    if ("error" in result) {
     
      toastMessage(result.error.data.message.join('\n'), "error");
      if ("backendvalerrors" in result.error.data) {
      }
    } else {

      toggleaddSupplierModal();
      toastMessage(result.data.message, "success");
      resetaddSubscriptionLinkForm()
      refetchsubscriptionlinks();
      setEditingngSubscription(false);

    }
  };
  //invite form
  // updating supplier org
  const [editingSupplier, setEditingngSubscription] = useState(false);
  const [activeSubscriptionLink, setActiveSubscriptionLink] = useState(null);
  const [asupp, setAsupp] = useState(null);
  const showAddModal = (supplier) => {
  
    resetaddSubscriptionLinkForm();
    setActiveSubscriptionLink(null);
    setEditingngSubscription(false);
    setModalAddSubscriptionDetails(true);
  }
  const showUpdateModal = (link) => {

    setActiveSubscriptionLink(link);
    setSupplierValue("subscription_link", link.link);
    setSupplierValue("monthly_subscription", link.monthly_subscription_amount);
    setSupplierValue("annual_subscription", link.annual_subscription_amount);
    setSupplierValue("sponsoring_organization", link.owned_by_organisation_name);
    setSupplierValue("description", link.description);
    setSupplierValue("subscription_tier_level", [{
      id: link.id,
      value: link.id,
      label: 'club ' + link.tier.club + ' ' + link.tier.tier_name,
    }]);
    //   setSelectedLinkValue();

    setEditingngSubscription(true);
    setModalAddSubscriptionDetails(true);
  }
  // updating supplier org
  return (
    <>
      {/* //modal view details */}

      <Modal size="lg" isOpen={modalAddSubscriptionDetails} toggle={toggleaddSupplierModal}>
        <ModalHeader
          toggle={toggleaddSupplierModal}
          close={
            <button className="close" onClick={toggleaddSupplierModal}>
              <Icon name="cross" />
            </button>
          }
        >

          {(editingSupplier) ? "Edit Subscription Link" : "Add Subscription Link"}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmitSupplier(submitSupplierRegistration)}>
            <Row className="g-gs">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    Link(Valid URL)
                  </label>
                  <div className="form-control-wrap">
                    <input
                      placeholder="Supplier Name"
                      type="text"
                      className="form-control"
                      id="supplier_name"
                      {...addSubscriptionLinkForm("subscription_link")}
                    />
                    {addSubscriptionLinkErrors.subscription_link?.message && (
                      <span className="invalid">{addSubscriptionLinkErrors.subscription_link?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    Monthly Subscription
                  </label>
                  <div className="form-control-wrap">
                    <input
                      placeholder="Monthly Subscription"
                      type="text"
                      className="form-control"
                      id="monthly_subscription"

                      {...addSubscriptionLinkForm("monthly_subscription")}
                    />
                    {addSubscriptionLinkErrors.monthly_subscription?.message && (
                      <span className="invalid">{addSubscriptionLinkErrors.monthly_subscription?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    Annual Subscription
                  </label>
                  <div className="form-control-wrap">
                    <input
                      placeholder="Annual Subscription"
                      type="text"
                      className="form-control"
                      id="annual_subscription"

                      {...addSubscriptionLinkForm("annual_subscription")}
                    />
                    {addSubscriptionLinkErrors.annual_subscription?.message && (
                      <span className="invalid">{addSubscriptionLinkErrors.annual_subscription?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="g-gs">
              <Col md="6">
                <div className="form-group">
                  <label className="form-label" htmlFor="fw-token-address">
                    Valid when exiting
                  </label>
                  <div className="form-control-wrap">
                    {existingLinksss && existingLinksss.length > 0 && (
                      <Controller
                        name="subscription_tier_level"
                        control={control}
                        defaultValue={null}
                        render={({ field }) => (
                          <Select isMulti value={selectedLinkValue} options={existingLinksss} isSearchable={true} isClearable={true} {...field} />
                        )}
                      />
                    )}
                    {addSubscriptionLinkErrors.subscription_tier_level && (
                      <span className="invalid" style={{ color: "#e85347", fontSize: "11px", fontStyle: "italic" }}>
                        {addSubscriptionLinkErrors.subscription_tier_level?.message}
                      </span>
                    )}
                  </div>
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    Sponsoring Organization
                  </label>
                  <div className="form-control-wrap">
                    <input
                      placeholder="Sponsoring Organization"
                      type="text"
                      className="form-control"

                      id="sponsoring_organization"
                      {...addSubscriptionLinkForm("sponsoring_organization")}
                    />
                    {addSubscriptionLinkErrors.sponsoring_organization?.message && (
                      <span className="invalid">{addSubscriptionLinkErrors.sponsoring_organization?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="g-gs">
              <Col md="12">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    Supplier Location
                  </label>
                  <div className="form-control-wrap">
                    <textarea
                      placeholder="Location Details"
                      type="text"
                      className="form-control"
                      id="supplier_location"

                      {...addSubscriptionLinkForm("description")}
                    ></textarea>
                    {addSubscriptionLinkErrors.supplier_location?.message && (
                      <span className="invalid">{addSubscriptionLinkErrors.description?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="form-group mt-2 ">
                  {!submittingaddSubscriptionLinkForm && (
                    <Button className="btn-round" color="primary" type="submit" size="lg">
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
      {/* ///modal add supplier */}
      <Head title="List Of Suscription Links" />
      <Content page="">
        <Block size="">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Subscription Links List</BlockTitle>
            </BlockHeadContent>
          </BlockHead>

          <PreviewCard>
            <BlockHead>
              <BlockHeadContent>
                <Button
                  color="primary"
                  style={{ display: "0", justifyContent: "right" }}
                  onClick={showAddModal}
                >
                  New Subscription Link
                </Button>
              </BlockHeadContent>
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
                    <span className="sub-text">Sponsoring Org</span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Link</span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Monthly Subscription </span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Annual Subscription </span>
                  </DataTableRow>
                  <DataTableRow className="nk-tb-col-tools text-end">
                    <span className="sub-text">Action</span>
                  </DataTableRow>
                </DataTableHead>
                {/*Head*/}
                {subscriptionlinks != undefined &&
                  subscriptionlinks != null &&
                  subscriptionlinks.map((subscriptionlink) => {
                    let org_name_split = subscriptionlink.owned_by_organisation_name.split(" ");
                    let passed_for_avatar = "";
                    if (org_name_split.length == 1) {
                      passed_for_avatar = org_name_split[0];
                    } else if (org_name_split.length == 2) {
                      passed_for_avatar = org_name_split[0] + " " + org_name_split[1];
                    } else if (org_name_split.length > 2) {
                      passed_for_avatar = org_name_split[0] + " " + org_name_split[1];
                    }
                    return (
                      <DataTableItem key={subscriptionlink.id}>
                        <DataTableRow>
                          {/* <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${supplier.id}`}> */}
                          <div className="user-card">
                            <UserAvatar theme="default" text={findUpper(passed_for_avatar)} image=""></UserAvatar>
                            <div className="user-info">
                              <span className="tb-lead">
                                {subscriptionlink?.owned_by_organisation_name}{" "}
                                <span
                                  className={`dot dot-${subscriptionlink.owned_by_organisation_name.status === 1 ? "success" : subscriptionlink.owned_by_organisation_name?.status === 0 ? "warning" : "danger"
                                    } d-md-none ms-1`}
                                ></span>
                              </span>

                            </div>
                          </div>
                          {/* </Link> */}
                        </DataTableRow>
                        <DataTableRow size="mb">{subscriptionlink?.link}</DataTableRow>
                        <DataTableRow size="mb">{subscriptionlink?.monthly_subscription_amount}</DataTableRow>
                        <DataTableRow size="mb">
                          {subscriptionlink?.annual_subscription_amount}
                        </DataTableRow>
                        <DataTableRow className="nk-tb-col-tools">
                          <ul className="nk-tb-actions gx-1">
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu end>
                                  <ul className="link-list-opt no-bdr">
                                    {subscriptionlink?.status === 1 && (
                                      <React.Fragment>
                                        <li className="divider"></li>
                                        <li onClick={() => showUpdateModal(subscriptionlink)}>
                                          <DropdownItem
                                            tag="a"
                                            href="#suspend"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="pen2"></Icon>
                                            <span>Edit Suscription LInk</span>
                                          </DropdownItem>
                                        </li>
                                        <li className="divider"></li>

                                      </React.Fragment>
                                    )}
                                    {subscriptionlink?.status === 0 && (
                                      <React.Fragment>
                                        <li onClick={() => activateDeactivate(subscriptionlink, "activate")}>
                                          <DropdownItem
                                            tag="a"
                                            href="#edit"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="check"></Icon>
                                            <span>Activate</span>
                                          </DropdownItem>
                                        </li>
                                      </React.Fragment>
                                    )}

                                    {/* {supplier?.status === 0 && (
                                    <React.Fragment>
                                      <li onClick={() => viewRegistrationStatus(supplier)}>
                                        <DropdownItem
                                          tag="a"
                                          href="#edit"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                          }}
                                        >
                                          <Icon name="check"></Icon>
                                          <span>View Company Details</span>
                                        </DropdownItem>
                                      </li>
                                    </React.Fragment>
                                  )} */}
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
                {subscriptionlinks != null && subscriptionlinks != undefined ? (
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

export default SubscriptionLinksList;
