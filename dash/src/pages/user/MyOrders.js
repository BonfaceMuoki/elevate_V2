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
import { useGetSupplierProductsQuery } from "../../api/admin/adminActionsApi";
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
import { useCheckoutFromCartMutation, useGetOrdersQuery } from "../../api/commonEndPointsAPI";
const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
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
            <Icon name="alert-circle" /> You do not have orders.
          </p>
        </div>
        <div>
          <Button color="primary" outline className="btn-dim btn-white  " onClick={goToShp}>
            <Icon name="briefcase"></Icon>
            <span>Start Shopping </span>
          </Button>
          &nbsp;&nbsp;
        </div>
      </Alert>
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

const ProductsList = ({ order }) => {
  const [modalShoworderproducts, setModalShoworderproducts] = useState(false);
  const toggleorderproductsmodal = () => {
    setModalShoworderproducts(!modalShoworderproducts);
  };
  const showOrderProductsModal = () => {
    setModalShoworderproducts(true);
  };
  return (
    <>
      {/* //modal view details */}
      <Modal size="lg" isOpen={modalShoworderproducts} toggle={toggleorderproductsmodal}>
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
        <ModalBody>
          <table className="table table-bordered table-responsive table-condensed">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity Ordered</th>
                <th>Total Cost</th>
                <th>Payment Status</th>
                <th>Delivery Status</th>
              </tr>
            </thead>
            <tbody>
              {order.order_products.length > 0 ? (
                order.order_products.map((prod, index) => {
                  let dstatusbadge = "";
                  let pstatusbadge = "";
                  if (prod?.delivery_status === "UNDELIVERED") {
                    dstatusbadge = "warning";
                  } else if (prod?.delivery_status === "ON TRANSIT") {
                    dstatusbadge = "info";
                  } else if (prod?.delivery_status === "DELIVERED") {
                    dstatusbadge = "success";
                  }

                  if (prod?.payment_status === "UNPAID") {
                    pstatusbadge = "warning";
                  } else if (prod?.payment_status === "PAID") {
                    pstatusbadge = "success";
                  }

                  return (
                    <tr>
                      <td>{prod?.product?.product_name}</td>
                      <td>{formatNumberAddCommas(prod?.total_product_cost / prod?.quantity_bought)}</td>
                      <td>{prod?.quantity_bought}</td>
                      <td>{formatNumberAddCommas(prod?.total_product_cost)}</td>
                      <td>
                        <Badge color={pstatusbadge}>{prod?.payment_status}</Badge>
                      </td>
                      <td>
                        <Badge color={dstatusbadge}>{prod?.delivery_status}</Badge>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <div>No Products</div>
              )}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter className="bg-light">
          <span className="sub-text"></span>
        </ModalFooter>
      </Modal>
      {/* ///modal add supplier */}
      <Button color="primary" onClick={() => showOrderProductsModal(order)}>
        {" "}
        View Order Products
      </Button>
    </>
  );
};
const OrderStatus = ({ order }) => {
  return (
    <div className="cart-action-container">
      <Badge color="success">Received</Badge>
    </div>
  );
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
  console.log(order, "orderorderorder");
  return (
    <div className="cart-action-container">
      {order?.total_order_cost != null && formatNumberAddCommas(order?.total_order_cost)}
    </div>
  );
};
function MyOrders() {
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
  } = useGetOrdersQuery({ as, currentPage, rowsPerPage, searchText, orderColumn, sortOrder });
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
      name: "Order Date",
      cell: (row) => <ConvertDate row={row} />,
    },
    {
      name: "Order Total",
      hide: "md",
      selector: (row) => <LineTotal order={row} />,
    },
    {
      name: "Products",
      hide: "md",
      selector: (row) => <ProductsList style={{ width: "100%" }} order={row} />,
    },
    {
      name: "Order Status",
      hide: "md",
      selector: (row) => <OrderStatus order={row} />,
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
        </Block>
      </Content>
    </>
  );
}

export default MyOrders;
