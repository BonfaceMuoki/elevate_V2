import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { findUpper } from "../../utils/Utils";
import ImageContainer from "../../components/GalleryImage";
import Slider from "react-slick";
import { SlickArrowLeft, SlickArrowRight } from "../../components/partials/slick/SlickComponents";
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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import classnames from "classnames";
import UserAvatar from "./UserAvatar";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Badge, DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { useSelector } from "react-redux";
import {
  useSendProductCreationMutation,
  useSendProductUpdateMutation,
  useGetSupplierProductsQuery,
  useDeleteProductMutation,
} from "../../api/admin/adminActionsApi";
import { Link, useNavigate } from "react-router-dom";
import {
  reduceCartItemQTY,
  removeCartItem,
  selectActiveSupplierDetails,
  selectCartItems,
  setActiveProductGlobal,
  setCartItems,
} from "../../featuers/authSlice";
import { formatNumberAddCommas } from "../../utils/Utils";
import { useDispatch } from "react-redux";
import "./Productlist.css";
import { useGetAllCategoriesQuery } from "../../api/commonEndPointsAPI";

const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
function ProductsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const supplier = useSelector(selectActiveSupplierDetails);
  const cartItems = useSelector(selectCartItems);
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

  //pagination section
  const [searchText, setSearchText] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [as, setAs] = useState("customer");
  const [supplierID, setSupplierID] = useState("");
  const [orderColumn, setOrderColumn] = useState("product_name");

  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    if (supplier != null) {
      setSupplierID(supplier?.id);
    }
  });
  const {
    data: supplierproducts,
    isLoading: loadingproducts,
    refetch: refetchSupplierProducts,
  } = useGetSupplierProductsQuery({
    supplierID,
    as,
    currentPage,
    rowsPerPage,
    searchText,
    orderColumn,
    sortOrder,
    filterCategory,
  });
  console.log(supplierproducts?.meta, "supplierproductssupplierproducts");

  useEffect(() => {
    if (supplierproducts != null) {
      setCurrentPage(supplierproducts.meta.current_page);
      setTotalRecords(supplierproducts.meta.total);
      setTableData(supplierproducts.data);
    } else {
      setTableData([{}]);
    }
  }, [loadingproducts]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const orderBy = (column) => {
    setOrderColumn(column);
    setSortOrder(sortOrder === "DESC" ? "ASC" : "DESC");
    refetchSupplierProducts();
  };
  //pagination section

  // const currentItems = ;
  const frontendbaseurl = process.env.REACT_APP_FRONT_BASE_URL;
  // Change Page

  const activateDeactivate = async (supplier, action) => {};
  const sendMail = () => {};
  const viewSupplierProfile = () => {};
  const [modalProductdetails, setModalProductdetails] = useState();
  const [modalAddProduct, setModalAddProduct] = useState();
  const toggleproductdetailsmodal = () => setModalProductdetails(!modalProductdetails);
  const toggleaddSupplierModal = () => {
    setModalAddProduct(!modalAddProduct);
  };
  //add supplier form

  // isOpen={modalSeeProductImaages} toggle={toggleProductImages}
  const [sliderData, setSliderData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState({});
  const [colorSector, setColorSelector] = useState(1);
  const [sizeSelector, setSizeSelector] = useState(1);
  const [counter, setCounter] = useState(1);
  const [videoOpen, setVideoOpen] = useState(false);
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  const [modalSeeProductImaages, setModalSeeProductImaages] = useState(false);
  const toggleProductImages = () => setModalSeeProductImaages(!modalSeeProductImaages);
  const showProductImages = (product) => {
    // console.log(product, "product");
    setActiveProduct(product);
    if (product?.default_image != null) {
      setCurrentSlide(product?.default_image);
    }

    setModalSeeProductImaages(true);
  };
  const sliderSettings = {
    className: "slider-init row",
    slidesToShow: 3,
    centerMode: false,
    slidesToScroll: 1,
    infinite: false,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />,
    responsive: [
      { breakpoint: 3000, settings: { slidesToShow: 4 } },
      { breakpoint: 1540, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ],
  };
  const slideChange = (index) => {
    // alert(index);
    var product = activeProduct.product_images.find((item) => item.id === index);
    setCurrentSlide(product);
  };
  const sliderSettingsDefault = {
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    slide: null,
    responsive: [
      { breakpoint: 1539, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 420, settings: { slidesToShow: 1 } },
    ],
    arrows: false,
    swipeToSlide: true,
    focusOnSelect: true,
    className: "slider-init slider-nav",
  };
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

  // isOpen={modalSeeProductImaages} toggle={toggleProductImages}
  const addproductschema = yup.object().shape({
    product_name: yup.string().required(" Provide product name"),
    category: yup.string().required("Please provide product category"),
    sku_name: yup.string().required("Please provide SKU Name"),
    quantity_available: yup.string().required(" Available Quantity"),
    price: yup.string().required("Please provide the product price"),
    currency: yup.string().required("Please select the currency"),
    quantity_cap: yup.string().required(" Provide alert level"),
    productImages: yup
      .mixed()
      .required("Please upload a file")
      .nullable()
      .test("fileSize", "File size is too large", (value) => {
        if (value[0]) {
          return value[0].size <= 1024 * 1024 * 2;
        }
        return true;
      })
      .test("fileType", "Only jpg,jpep and png files are allowed", (value) => {
        if (value[0]) {
          return ["image/jpg", "jpg", "image/jpeg", "jpeg", "image/png", "png"].includes(value[0].type);
        }
        return true;
      }),
  });

  const {
    register: addProductForm,
    handleSubmit: handleSubmitProduct,
    setValue: setProductValue,
    isLoading: submittingAddProductForm,
    formState: { errors: addProductErrrors },
    reset: resetAddProductForm,
  } = useForm({
    resolver: yupResolver(addproductschema),
  });
  const [sendAddProductRequest, { isLoading: addinSupplier }] = useSendProductCreationMutation();
  const [sendUpdateProductRequest, { isLoading: updatingSupplier }] = useSendProductUpdateMutation();
  const submitProductRegistration = async (data) => {
    console.log(data.productImages);
    console.log(data.productImages);
    const formData = new FormData();
    formData.append("product_name", data.product_name);
    formData.append("category", data.category);
    formData.append("sku_name", data.sku_name);
    formData.append("quantity_available", data.quantity_available);
    formData.append("price", data.price);
    formData.append("currency", data.currency);
    formData.append("quantity_cap", data.quantity_cap);
    const uploadedfiles = data.productImages;
    console.log(uploadedfiles, "uploadedfilesuploadedfiles");

    if (uploadedfiles) {
      for (let i = 0; i < uploadedfiles.length; i++) {
        formData.append("product_images[]", uploadedfiles[i]);
      }
    }
    // data.productImages.forEach((file) => {
    //   formData.append("product_images[]", file);
    // });

    formData.append("about_product", data.about_product);
    formData.append("supplier", supplier.id);

    let result = null;
    if (editingProduct) {
      formData.append("product", activeProduct.id);
      result = await sendUpdateProductRequest(formData);
    } else {
      result = await sendAddProductRequest(formData);
    }

    if ("error" in result) {
      toastMessage(result.error.data.message.join("\n"), "error");
      if ("backendvalerrors" in result.error.data) {
      }
    } else {
      toastMessage(result.data.message, "success");
      resetAddProductForm();
      refetchSupplierProducts();
      setEditingngProduct(false);
    }
  };
  //invite form
  // updating product org
  const [editingProduct, setEditingngProduct] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const showAddModal = (product) => {
    resetAddProductForm();
    setActiveProduct(null);
    setEditingngProduct(false);
    setModalAddProduct(true);
  };
  const showUpdateModal = (product) => {
    setActiveProduct(product);
    setProductValue("product_name", product.product_name);
    setProductValue("category", product.category.category_name);
    setProductValue("sku_name", product.sku_name);
    setProductValue("quantity_available", product.quantity_available);
    setProductValue("price", product.price);
    setProductValue("currency", product.currency.currency_label);
    setProductValue("quantity_cap", product.quantity_cap);
    // setSupplierValue("product_images", supplier.product_images);
    setProductValue("about_product", product.about_product);
    setEditingngProduct(true);
    setModalAddProduct(true);
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

  const deleteProduct = (product) => {
    Swal.fire({
      title: "Are You Sure You want to Delete this?",
      text: "Operation cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteProduct(product);
      } else {
        toastMessage("Product deletion canceled", "success");
      }
    });
  };
  const [deleteSupplierProduct, { errors: errosDEleting }] = useDeleteProductMutation();
  const handleDeleteProduct = async (product) => {
    const formdata = new FormData();
    formdata.append("product", product?.id);
    const result = await deleteSupplierProduct(formdata);
    if ("error" in result) {
      toastMessage(result.error.data.message.join("\n"), "error");
      if ("backendvalerrors" in result.error.data) {
      }
    } else {
      toastMessage(result.data.message, "success");
      refetchSupplierProducts();
    }
  };
  const showProductDetails = (product) => {
    dispatch(setActiveProductGlobal(product));
    navigate("/product-details");
  };
  const addItemToCart = (product) => {
    dispatch(setCartItems(product));
  };
  const increaseCounter = (product) => {
    dispatch(setCartItems(product));
  };
  const decreaseCounter = (product) => {
    dispatch(reduceCartItemQTY(product));
  };
  const removeFromCart = (product) => {
    dispatch(removeCartItem(product));
  };

  const { data: allcategories, isLoading: loadingcategories, refetch: refetchCategories } = useGetAllCategoriesQuery();
  const setCat = (cat) => {
    if (cat != "" && cat != undefined) {
      setFilterCategory(cat);
    }
  };
  const goToProductDetails = (prod) => {
    dispatch(setActiveProductGlobal(prod));
    navigate("/product-details");
  };
  return (
    <>
      {/* //modal view details */}
      <Modal size="lg" isOpen={modalProductdetails} toggle={toggleproductdetailsmodal}>
        <ModalHeader
          toggle={toggleproductdetailsmodal}
          close={
            <button className="close" onClick={toggleproductdetailsmodal}>
              <Icon name="cross" />
            </button>
          }
        >
          Product Details Modal
        </ModalHeader>
        <ModalBody>
          {/* //product details */}
          <Block>
            <Card className="card-bordered"></Card>
          </Block>
          {/* //product details */}
        </ModalBody>
        <ModalFooter className="bg-light">
          <span className="sub-text"></span>
        </ModalFooter>
      </Modal>
      {/* ///close modal view details */}
      {/* //modal add supplier */}
      {/* //modal view details */}

      <Modal size="lg" isOpen={modalSeeProductImaages} toggle={toggleProductImages}>
        <ModalHeader
          toggle={toggleProductImages}
          close={
            <button className="close" onClick={toggleProductImages}>
              <Icon name="cross" />
            </button>
          }
        >
          Product Images
        </ModalHeader>
        <ModalBody>
          <Card className="card-bordered">
            <div className="card-inner">
              <div className="product-gallery me-xl-1 me-xxl-5">
                <Slider
                  slidesToShow={1}
                  slidesToScroll={1}
                  initialSlide={currentSlide?.id}
                  className="slider-init"
                  prevArrow
                >
                  <div className="slider-item rounded" key={currentSlide?.id}>
                    <div>
                      <img
                        src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/${currentSlide?.image_url}`}
                        className="w-100"
                        alt=""
                      />
                    </div>
                    {/* <img src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/${currentSlide?.image_url}`} className="w-100" alt="" /> */}
                  </div>
                </Slider>
                <Slider {...settings}>
                  {activeProduct?.product_images.map((item, key) => {
                    return (
                      <div
                        className={`slider-item ${currentSlide.id === item.id ? "slick-current" : ""}`}
                        key={item.id}
                        onClick={() => slideChange(item?.id)}
                      >
                        {/* {currentSlide.id}{item?.id} */}
                        <div className="thumb">
                          <img
                            src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/${item?.image_url}`}
                            className="w-100"
                            alt=""
                          />
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            </div>
          </Card>
        </ModalBody>
        <ModalFooter className="bg-light">
          <span className="sub-text"></span>
        </ModalFooter>
      </Modal>

      <Head title="Products" />
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
                <div className="card-inner">
                  <Block>
                    <BlockHead>
                      <BlockHeadContent></BlockHeadContent>
                    </BlockHead>
                    <BlockHead size="" wide="">
                      <Row className={`justify-between g-2 with-export}`}>
                        <Col sm="12" md="6">
                          <label>Search By Product Name</label>
                          <br></br>
                          <input
                            type="search"
                            className="form-control form-control-sm"
                            placeholder="Search by Product name"
                            onChange={(e) => {
                              setSearchText(e.target.value);
                            }}
                          />
                        </Col>
                        <Col sm="12" md="3">
                          <div id="DataTables_Table_0_filter" className="dataTables_filter">
                            <label>Search By Category</label>
                            <br></br>
                            <select
                              style={{ width: "100%" }}
                              name="DataTables_Table_0_length"
                              className="custom-select custom-select-sm form-control form-control-sm"
                              onChange={(e) => setCat(e.target.value)}
                              value={filterCategory}
                            >
                              <option value="All">All</option>
                              {(allcategories != null) & (allcategories != null) &&
                                allcategories.map((cat, index) => {
                                  return (
                                    <option key={cat?.id} value={`${cat?.id}`}>
                                      {cat?.category_name}
                                    </option>
                                  );
                                })}
                            </select>
                          </div>
                        </Col>
                        <Col sm="12" md="3">
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
                      <hr></hr>
                    </BlockHead>
                    <BlockContent>
                      {/* <Row>
                                                <Col md="12">
                                                    {JSON.stringify(cartItems)}
                                                </Col>
                                            </Row> */}
                      <Row className="g-gs">
                        {supplierproducts != undefined && supplierproducts.data != null
                          ? supplierproducts.data.map((item) => {
                              const indexIfFound = cartItems.findIndex((citem) => citem.id === item.id);

                              return (
                                <Col xxl={3} lg={4} sm={6} key={item.id}>
                                  <Card className="card-bordered product-card">
                                    <div className="product-thumb">
                                      <a onClick={() => showProductImages(item)}>
                                        <img
                                          className="card-img-top"
                                          style={{ maxHeight: "300px", minHeight: "300px" }}
                                          src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/${item?.default_image?.image_url}`}
                                          alt=""
                                        />
                                      </a>
                                      <ul className="product-badges">
                                        {/* {item.new && ( */}
                                        <li>
                                          <Badge color="success">New</Badge>
                                        </li>
                                        {/* )}
                                                                        {item.hot && (
                                                                            <li>
                                                                                <Badge color="danger">New</Badge>
                                                                            </li>
                                                                        )} */}
                                      </ul>
                                      <ul className="product-actions">
                                        <li>
                                          <a href="#cart" onClick={(ev) => ev.preventDefault()}>
                                            <Icon name="cart"></Icon>
                                          </a>
                                        </li>
                                        <li>
                                          <a href="#like" onClick={(ev) => ev.preventDefault()}>
                                            <Icon name="heart"></Icon>
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                    <div className="card-inner text-center">
                                      <ul className="product-tags">
                                        <li>{item.product_name}</li>
                                      </ul>
                                      <h5 className="product-title">
                                        <a style={{ cursor: "pointer" }} onClick={() => goToProductDetails(item)}>
                                          {item.product_name}
                                        </a>
                                      </h5>
                                      <div className="product-price text-primary h5">
                                        {item.price && (
                                          <small className="text-muted del fs-13px">
                                            {item?.currency?.currency_abreviation} {item?.price + 300}
                                          </small>
                                        )}{" "}
                                        {item?.currency?.currency_abreviation}
                                        {formatNumberAddCommas(item?.price)}
                                      </div>
                                    </div>
                                    <div className="card-inner text-center">
                                      {indexIfFound > -1 ? (
                                        <Row>
                                          <Col md="9">
                                            <div className="cart-action-container">
                                              <Button color="light" outline onClick={() => decreaseCounter(item)}>
                                                <Icon name="minus"></Icon>
                                              </Button>
                                              <input
                                                className="form-control "
                                                style={{ width: "30% !impotant" }}
                                                type="number"
                                                value={cartItems[indexIfFound].quantity}
                                                onChange={(e) => setCounter(Number(e.target.value))}
                                              />
                                              <Button color="light" outline onClick={() => increaseCounter(item)}>
                                                <Icon name="plus"></Icon>
                                              </Button>
                                            </div>
                                          </Col>
                                          <Col md="3">
                                            <div className="cart-action-container">
                                              <Button color="warning" onClick={() => removeFromCart(item)}>
                                                <Icon name="trash"></Icon>
                                              </Button>
                                            </div>
                                          </Col>
                                        </Row>
                                      ) : (
                                        <Button color="primary" onClick={() => addItemToCart(item)}>
                                          Add to Cart
                                        </Button>
                                      )}
                                    </div>
                                  </Card>
                                </Col>
                              );
                            })
                          : ""}
                      </Row>
                      <div className="card-inner">
                        {supplierproducts?.data != null && supplierproducts?.data != undefined ? (
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
                    </BlockContent>
                  </Block>
                </div>
              </div>
            </div>
          </Card>
        </Block>
      </Content>
    </>
  );
}

export default ProductsList;
