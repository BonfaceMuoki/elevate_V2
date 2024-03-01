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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import classnames from "classnames";
import UserAvatar from "./UserAvatar";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Badge, DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useGetSuppliersQuery, useSendSupplierRegistrationMutation, useSendSupplierUpdateMutation } from "../../api/admin/adminActionsApi";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { setActiveSupplierDetails } from "../../featuers/authSlice";
const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
function AdminSuppliersList() {
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
  const { data: suppliers, isLoading: loadingsuppliers, refetch: refetchSuppliers } = useGetSuppliersQuery();
  const [currentItems, setcurrentItems] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (suppliers != null) {
      setTableData(suppliers);
    } else {
      setTableData([{}]);
    }
  }, [suppliers]);
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
  const sendMail = () => { };
  const navigateto = useNavigate();
  const viewSupplierProfile = (supp) => {
   
    dispatch(setActiveSupplierDetails(supp));
    navigateto("/admin/supplier-details");
  };
  const [modalSupplierdetails, setModalSupplierdetails] = useState();
  const [modalAddSupplier, setModalAddSupplier] = useState();
  const togglesupplierdetailsmodal = () => setModalSupplierdetails(!modalSupplierdetails);
  const toggleaddSupplierModal = () => {
    setModalAddSupplier(!modalAddSupplier);
  }
  //add supplier form
  const addsupplierschema = yup.object().shape({
    supplier_name: yup.string().required(" Provide supplier name"),
    supplier_email: yup.string().required("Please provide supplier email"),
    supplier_phone: yup.string().required("Please provide supplier phone number")
  });

  const {
    register: addSupplierForm,
    handleSubmit: handleSubmitSupplier,
    setValue: setSupplierValue,
    isLoading: submittingAddSupplierForm,
    formState: { errors: addSupplierErrrors },
    reset: resetAddSupplierForm
  } = useForm({
    resolver: yupResolver(addsupplierschema),
  });
  const [sendAddSupplierRequest, { isLoading: addinSupplier }] = useSendSupplierRegistrationMutation();
  const [sendUpdateSupplierRequest, { isLoading: updatingSupplier }] = useSendSupplierUpdateMutation();
  const submitSupplierRegistration = async (data) => {
   
    const formData = new FormData();
    formData.append("supplier_name", data.supplier_name);
    formData.append("supplier_email", data.supplier_email);
    formData.append("supplier_phone", data.supplier_phone);
    formData.append("about_supplier", data.about_supplier);
    formData.append("location_description", data.location_description);
    let result = null;
    if (editingSupplier) {
      formData.append("supplier", activeSupplier.id);
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
      resetAddSupplierForm()
      refetchSuppliers();
      setEditingngSupplier(false);

    }
  };
  //invite form
  // updating supplier org
  const [editingSupplier, setEditingngSupplier] = useState(false);
  const [activeSupplier, setActiveSupplier] = useState(null);
  const [asupp, setAsupp] = useState(null);
  const showAddModal = (supplier) => {
  
    resetAddSupplierForm();
    setActiveSupplier(null);
    setEditingngSupplier(false);
    setModalAddSupplier(true);
  }
  const showUpdateModal = (supplier) => {
   
    setActiveSupplier(supplier);
    setSupplierValue("supplier_name", supplier.supplier_name);
    setSupplierValue("supplier_email", supplier.supplier_email);
    setSupplierValue("supplier_phone", supplier.supplier_phone);
    setSupplierValue("about_supplier", supplier.about_supplier);
    setSupplierValue("supplier_location", supplier.supplier_location);
    setEditingngSupplier(true);
    setModalAddSupplier(true);
  }
  // updating supplier org
  return (
    <>
      {/* //modal view details */}
      <Modal size="lg" isOpen={modalSupplierdetails} toggle={togglesupplierdetailsmodal}>
        <ModalHeader
          toggle={togglesupplierdetailsmodal}
          close={
            <button className="close" onClick={togglesupplierdetailsmodal}>
              <Icon name="cross" />
            </button>
          }
        >
          Supplier Details Modal
        </ModalHeader>
        <ModalBody></ModalBody>
        <ModalFooter className="bg-light">
          <span className="sub-text"></span>
        </ModalFooter>
      </Modal>
      {/* ///close modal view details */}
      {/* //modal add supplier */}
      {/* //modal view details */}
      <Modal size="lg" isOpen={modalAddSupplier} toggle={toggleaddSupplierModal}>
        <ModalHeader
          toggle={toggleaddSupplierModal}
          close={
            <button className="close" onClick={toggleaddSupplierModal}>
              <Icon name="cross" />
            </button>
          }
        >

          {(editingSupplier) ? "Edit Supplier" : "Add Supplier"}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmitSupplier(submitSupplierRegistration)}>
            <Row className="g-gs">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    Supplier Name
                  </label>
                  <div className="form-control-wrap">
                    <input
                      placeholder="Supplier Name"
                      type="text"
                      className="form-control"
                      id="supplier_name"
                      {...addSupplierForm("supplier_name")}
                    />
                    {addSupplierErrrors.supplier_name?.message && (
                      <span className="invalid">{addSupplierErrrors.supplier_name?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    Supplier Email
                  </label>
                  <div className="form-control-wrap">
                    <input
                      placeholder="Supplier Email"
                      type="email"
                      className="form-control"
                      id="supplier_email"

                      {...addSupplierForm("supplier_email")}
                    />
                    {addSupplierErrrors.supplier_email?.message && (
                      <span className="invalid">{addSupplierErrrors.supplier_email?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    Supplier Phone
                  </label>
                  <div className="form-control-wrap">
                    <input
                      placeholder="Supplier Phone"
                      type="text"
                      className="form-control"
                      id="supplier_phone"

                      {...addSupplierForm("supplier_phone")}
                    />
                    {addSupplierErrrors.supplier_phone?.message && (
                      <span className="invalid">{addSupplierErrrors.supplier_phone?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="g-gs">
              <Col md="12">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    About Supplier
                  </label>
                  <div className="form-control-wrap">
                    <textarea
                      placeholder="About Supplier"
                      type="text"
                      className="form-control"

                      id="about_supplier"
                      {...addSupplierForm("about_supplier")}
                    ></textarea>
                    {addSupplierErrrors.about_supplier?.message && (
                      <span className="invalid">{addSupplierErrrors.about_supplier?.message}</span>
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

                      {...addSupplierForm("supplier_location")}
                    ></textarea>
                    {addSupplierErrrors.supplier_location?.message && (
                      <span className="invalid">{addSupplierErrrors.supplier_location?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="form-group mt-2 ">
                  {!submittingAddSupplierForm && (
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
      <Head title="List Of Elavate  Members" />
      <Content page="">
        <Block size="">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">Suppliers List</BlockTitle>
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
                  New Supplier
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
                    <span className="sub-text">Supplier Information</span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Phone Number </span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Email </span>
                  </DataTableRow>
                  <DataTableRow size="mb">
                    <span className="sub-text">Status </span>
                  </DataTableRow>
                  <DataTableRow className="nk-tb-col-tools text-end">
                    <span className="sub-text">Action</span>
                  </DataTableRow>
                </DataTableHead>
                {/*Head*/}
                {suppliers != undefined &&
                  suppliers != null &&
                  suppliers.map((supplier) => {
                    let supplier_name_split = supplier.supplier_name.split(" ");
                    let passed_for_avatar = "";
                    if (supplier_name_split.length == 1) {
                      passed_for_avatar = supplier_name_split[0];
                    } else if (supplier_name_split.length == 2) {
                      passed_for_avatar = supplier_name_split[0] + " " + supplier_name_split[1];
                    } else if (supplier_name_split.length > 2) {
                      passed_for_avatar = supplier_name_split[0] + " " + supplier_name_split[1];
                    }
                    return (
                      <DataTableItem key={supplier.id}>
                        <DataTableRow>
                          {/* <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${supplier.id}`}> */}
                          <div className="user-card">
                            <UserAvatar theme="default" text={findUpper(passed_for_avatar)} image=""></UserAvatar>
                            <div className="user-info">
                              <span className="tb-lead">
                                {supplier?.supplier_name}{" "}
                                <span
                                  className={`dot dot-${supplier.status === 1 ? "success" : supplier?.status === 0 ? "warning" : "danger"
                                    } d-md-none ms-1`}
                                ></span>
                              </span>
                              {/* <span>{supplier?.sup}</span> */}
                            </div>
                          </div>
                          {/* </Link> */}
                        </DataTableRow>
                        <DataTableRow size="mb">{supplier?.supplier_phone}</DataTableRow>
                        <DataTableRow size="mb">{supplier?.created_at}</DataTableRow>
                        <DataTableRow size="mb">
                          {supplier.status == 1 && (
                            <Badge color="success" style={{ width: "50%" }}>
                              Active
                            </Badge>
                          )}
                          {supplier.status == 0 && (
                            <Badge color="warning" style={{ width: "50%" }}>
                              Deactivated
                            </Badge>
                          )}
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
                                    {supplier?.status === 1 && (
                                      <React.Fragment>
                                        <li onClick={() => activateDeactivate(supplier, "deactivate")}>
                                          <DropdownItem
                                            tag="a"
                                            href="#edit"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="cross"></Icon>
                                            <span>Deactivate</span>
                                          </DropdownItem>
                                        </li>
                                        {/* <li className="divider"></li> */}
                                        {/* <li onClick={() => sendMail(item)}>
                                        <DropdownItem
                                          tag="a"
                                          href="#suspend"
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                          }}
                                        >
                                          <Icon name="mail"></Icon>
                                          <span>Send Mail</span>
                                        </DropdownItem>
                                      </li> */}
                                        <li className="divider"></li>
                                        <li onClick={() => showUpdateModal(supplier)}>
                                          <DropdownItem
                                            tag="a"
                                            href="#suspend"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="pen2"></Icon>
                                            <span>Edit Supplier</span>
                                          </DropdownItem>
                                        </li>
                                        <li className="divider"></li>
                                        <li onClick={() => viewSupplierProfile(supplier)}>
                                          <DropdownItem
                                            tag="a"
                                            href="#suspend"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="eye"></Icon>
                                            <span>View Details</span>
                                          </DropdownItem>
                                        </li>
                                      </React.Fragment>
                                    )}
                                    {supplier?.status === 0 && (
                                      <React.Fragment>
                                        <li onClick={() => activateDeactivate(supplier, "activate")}>
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
                {suppliers != null && suppliers != undefined ? (
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

export default AdminSuppliersList;
