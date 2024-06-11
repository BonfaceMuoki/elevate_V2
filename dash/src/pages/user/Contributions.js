import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { findUpper } from "../../utils/Utils";
import ImageContainer from "../../components/GalleryImage";
import Slider from "react-slick";
import { SlickArrowLeft, SlickArrowRight } from "../../components/partials/slick/SlickComponents";
import {
  Alert,
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
  Row,
  Col,
} from "reactstrap";
import {
  PaginationComponent,
  BlockHead,
  BlockHeadContent,
  PreviewCard,
  Block,
  BlockBetween,
  Icon,
  BlockContent,
  PreviewAltCard,
} from "../../components/Component";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import classnames from "classnames";
import UserAvatar from "./UserAvatar";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Badge, DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { useSelector } from "react-redux";
import { useGetSupplierProductsQuery, useUpdateOrderProductStatausMutation } from "../../api/admin/adminActionsApi";
import { Link, useNavigate } from "react-router-dom";
import {
  clearCart,
  reduceCartItemQTY,
  removeCartItem,
  selectActiveSupplierDetails,
  selectCartItems,
  setActiveProductGlobal,
  setCartItems,
} from "../../featuers/authSlice";
import { formatNumberAddCommas } from "../../utils/Utils";
import { useDispatch } from "react-redux";
import "./ShoppingCart.css";
import DataTable from "react-data-table-component";
import { useCheckoutFromCartMutation, useGetContributionsQuery, useGetOrdersQuery } from "../../api/commonEndPointsAPI";
const ExpandableRowComponent = ({ data }) => {
  return (
    <ul className="dtr-details p-2 border-bottom ms-1">
      <li className="d-block d-sm-none mb-10">
        <span className="dtr-title">Line Total</span>{" "}
        <span className="dtr-data">
          <LineTotal order={data} />
        </span>
      </li>
      <li className="d-block d-sm-none  mb-10">
        <span className="dtr-title ">Order Status</span>{" "}
        <span className="dtr-data">
          {" "}
          <OrderStatus order={data} />
        </span>
      </li>
      <li>
        <span className="dtr-title">Remove From Cart</span>{" "}
        <span className="dtr-data">
          {" "}
          <ProductsList order={data} />
        </span>
      </li>
    </ul>
  );
};
const NoDataInCard = () => {
  const navigate = useNavigate();
  const goToShp = () => {
    navigate("/products");
  };
  return (
    <div style={{ width: "100%" }}>
      <Alert
        className="alert-icon"
        color="primary"
        style={{
          margin: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div>
          <p>
            {" "}
            <Icon name="alert-circle" /> No contributions found.
          </p>
        </div>
        <div>&nbsp;&nbsp;</div>
      </Alert>
    </div>
  );
};
const RenderCustomer = ({ row }) => {
  return (
    <div className="user-card">
      <UserAvatar size="sm" theme="primary" text={findUpper(row?.user?.full_name)} image={""}></UserAvatar>
      <div className="user-name">
        <span className="tb-lead">{row?.user?.full_name}</span>
      </div>
    </div>
  );
};
const ConvertDate = ({ row }) => {
  const date = new Date(row.created_at);

  // Define arrays for month names and day names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Extract day, month, year, and day of the week
  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();
  const dayOfWeek = date.getUTCDay();

  // Create the wordy date using template literals
  const wordyDate = `${dayNames[dayOfWeek]}, ${monthNames[month]} ${day}, ${year}`;

  return (
    <div className="user-card">
      <span color="primary">
        {" "}
        <Icon name="calender"></Icon> {wordyDate}
      </span>
    </div>
  );
};

const ProductsList = ({ order, intiateRefresh }) => {
  const [modalShoworderproducts, setModalShoworderproducts] = useState(false);
  const toggleorderproductsmodal = () => {
    setModalShoworderproducts(!modalShoworderproducts);
  };
  const [modalShowoProductManage, setModalShowoProductManage] = useState(false);
  const togglemodalShowoProductManage = () => {
    setModalShowoProductManage(!modalShowoProductManage);
  };
  const showOrderProductsModal = () => {
    setModalShoworderproducts(true);
  };
  const [activeOrderProduct, setActiveOrderProduct] = useState(null);
  const showOrderProductsManagement = (prod) => {
    setActiveOrderProduct(prod);
    setModalShowoProductManage(true);
  };

  //update status
  const addproductstatusschema = yup.object().shape({
    product_delivery_status: yup.string().required("Product Delivery Status"),
    product_payment_status: yup.string().required("Product Payment Status"),
  });

  const {
    register: updatestatusform,
    handleSubmit: handleUpdateProductStatus,
    setValue: setProductStatusValue,
    isLoading: submittingProductStatus,
    formState: { errors: errorsSubmittingProductStatus },
    reset: restProductStatusForm,
  } = useForm({
    resolver: yupResolver(addproductstatusschema),
  });
  const [updateOrderProductStataus, { errors: errorsUpdatingStatus }] = useUpdateOrderProductStatausMutation();
  const submitProductStatus = async (data) => {
    const formdata = new FormData();
    formdata.append("op", activeOrderProduct?.id);
    formdata.append("payment", data?.product_payment_status);
    formdata.append("delivery", data?.product_delivery_status);
    const result = await updateOrderProductStataus(formdata);
    if ("error" in result) {
      if (result.error.data.message) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.error.data.message,
          focusConfirm: false,
        });
      } else if (result.error.data.error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: result.error.data.error,
          focusConfirm: false,
        });
      }
    } else {
      setModalShowoProductManage(false);
      intiateRefresh();
      Swal.fire({
        icon: "success",
        title: "Order Product Update",
        text: result.data.message,
        focusConfirm: false,
      });
    }
  };

  //update status
  return (
    <>
      {/* //modal view details */}
      <Modal size="md" isOpen={modalShowoProductManage} toggle={togglemodalShowoProductManage}>
        <ModalHeader
          toggle={togglemodalShowoProductManage}
          close={
            <button className="close" onClick={togglemodalShowoProductManage}>
              <Icon name="cross" />
            </button>
          }
        >
          Contributions
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleUpdateProductStatus(submitProductStatus)}>
            <Row>
              <Col md="6">
                <div className="form-group">
                  <label>Delivery Status</label>
                  <select
                    className="form-control"
                    defaultValue={activeOrderProduct?.delivery_status}
                    {...updatestatusform("product_delivery_status")}
                  >
                    <option value="DELIVERED">Delivered</option>
                    <option value="UNDELIVERED">UnDelivered</option>
                  </select>
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <label>Payment Status</label>
                  <select
                    className="form-control"
                    defaultValue={activeOrderProduct?.payment_status}
                    {...updatestatusform("product_payment_status")}
                  >
                    <option value="PAID">Paid</option>
                    <option value="UNPAID">Unpaid</option>
                  </select>
                </div>
              </Col>
            </Row>
            <Row>
              <Col
                className="mt-1"
                md="12"
                style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}
              >
                <Button className="btn-md" color="primary">
                  Update
                </Button>
              </Col>
            </Row>
          </form>
        </ModalBody>
        <ModalFooter className="bg-light">
          <span className="sub-text"></span>
        </ModalFooter>
      </Modal>
      {/* ///modal add supplier */}
      {/* //modal view details */}
      <Modal size="xl" isOpen={modalShoworderproducts} toggle={toggleorderproductsmodal}>
        <ModalHeader
          toggle={toggleorderproductsmodal}
          close={
            <button className="close" onClick={toggleorderproductsmodal}>
              <Icon name="cross" />
            </button>
          }
        >
          Order Products
        </ModalHeader>
        <ModalBody style={{ overflow: "scroll" }}></ModalBody>
        <ModalFooter className="bg-light">
          <span className="sub-text"></span>
        </ModalFooter>
      </Modal>
      {/* ///modal add supplier */}
      <Button color="primary" onClick={() => showOrderProductsModal(order)} style={{ marginRight: "10px" }}>
        {" "}
        <Icon name="eye"> </Icon> Products
      </Button>
      {/* < Button color="primary" onClick={() => showOrderProductsModal(order)} style={{ marginRight: "10px" }} > <Icon name="bag" ></Icon></Button >
            < Button color="primary" onClick={() => showOrderProductsManagement(order)} style={{ marginRight: "10px" }} > <Icon name="wallet" ></Icon></Button > */}
    </>
  );
};
const OrderStatus = ({ order }) => {
  if (order?.status === "Completed") {
    return (
      <div className="cart-action-container">
        <Badge color="success">Received</Badge>
      </div>
    );
  } else {
    return (
      <div className="cart-action-container">
        <Badge color="warning">Pending</Badge>
      </div>
    );
  }
};
const RemoveButton = ({ product }) => {
  const dispatch = useDispatch();
  const removeFromCart = (product) => {
    dispatch(removeCartItem(product));
  };

  return (
    <Button color="warning" onClick={() => removeFromCart(product)}>
      <Icon name="trash"></Icon>
    </Button>
  );
};
const LineTotal = ({ order }) => {
  return (
    <div className="cart-action-container">
      $ {order?.contribution_amount != null && formatNumberAddCommas(order?.contribution_amount)}
    </div>
  );
};
function Contributions() {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const supplier = useSelector(selectActiveSupplierDetails);
  const cartItems = useSelector(selectCartItems);

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
  //pagination section
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      { breakpoint: 3000, settings: { slidesToShow: 2 } },
      { breakpoint: 1540, settings: { slidesToShow: 2 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
    className: "slider-init slider-nav",
    arrows: false,
    swipeToSlide: true,
    focusOnSelect: true,
  };

  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [as, setAs] = useState("customer");
  const [orderColumn, setOrderColumn] = useState("product_name");
  const {
    data: orderslist,
    isLoading: loadingorders,
    refetch: refetchSupplierOrders,
  } = useGetContributionsQuery({ as, currentPage, rowsPerPage, searchText, orderColumn, sortOrder });
  console.log(orderslist, "orders orders");
  useEffect(() => {
    if (orderslist?.data != null) {
      setCurrentPage(orderslist?.current_page);
      setTotalRecords(orderslist?.total);
      setTableData(orderslist?.data);
    } else {
      setTableData([{}]);
    }
  }, [loadingorders]);

  const refreshData = () => {
    console.log("Refreshing data");
    refetchSupplierOrders();
  };

  const { data: orderList, errors: errorsloadingorders } = useGetOrdersQuery({
    as,
    currentPage,
    rowsPerPage,
    searchText,
    orderColumn,
    sortOrder,
  });
  const columns = [
    {
      name: "Name Name",
      cell: (row) => <RenderCustomer row={row} />,
    },
    {
      name: "Date of Contribution",
      cell: (row) => <ConvertDate row={row} />,
    },
    {
      name: "Contribution Amount Total",
      hide: "md",
      selector: (row) => <LineTotal order={row} />,
    },
    {
      name: "Status",
      hide: "md",
      selector: (row) => <OrderStatus order={row} />,
    },
    {
      name: "S Expected Total",
      hide: "md",
      selector: (row) => row?.expected_amount_for_sponsorship,
      sortable: true,
    },
    {
      name: "S Amount Used",
      hide: "md",
      selector: (row) => row?.subscription_total_used,
      sortable: true,
    },
    {
      name: "S Amount To Use",
      hide: "md",
      selector: (row) => row?.current_available_amount_for_sponsorship,
      sortable: true,
    },
    {
      name: "S Link",
      hide: "md",
    },
  ];
  const [mobileView, setMobileView] = useState();
  const viewChange = () => {
    if (window.innerWidth < 960) {
      console.log(window.innerWidth);
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  };
  useEffect(() => {
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    return () => {
      window.removeEventListener("resize", viewChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [saveCartProducts, { errors: savingProductserrors }] = useCheckoutFromCartMutation();
  const checkOut = async () => {
    const resutlt = await saveCartProducts({ cartItems: cartItems });
    if ("error" in resutlt) {
      if (resutlt.error.data.message) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: resutlt.error.data.message,
          focusConfirm: false,
        });
      } else if (resutlt.error.data.error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: resutlt.error.data.error,
          focusConfirm: false,
        });
      }
    } else {
      dispatch(clearCart());
      Swal.fire({
        icon: "success",
        title: "Order Placed",
        text: resutlt.data.message,
        focusConfirm: false,
      });
    }
  };
  let cart_total = cartItems.reduce((acc, row) => acc + row.quantity * row.price, 0);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
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
              <DataTable
                columns={columns}
                data={orderslist?.data}
                noDataComponent={<NoDataInCard />}
                expandableRowsComponent={ExpandableRowComponent}
                expandableRows={mobileView}
              />
              <div className="card-inner">
                {orderslist?.data != null && orderslist?.data != undefined ? (
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
            </CardBody>
            <CardFooter className="border-top"></CardFooter>
          </Card>
        </Block>
      </Content>
    </>
  );
}

export default Contributions;
