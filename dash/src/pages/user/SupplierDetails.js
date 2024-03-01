import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { findUpper, formatTimestampDate } from "../../utils/Utils";
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
  useGetSupplierOrderedProductsQuery,
  useDeleteProductMutation
} from "../../api/admin/adminActionsApi";
import { Link, useNavigate } from "react-router-dom";
import { selectActiveSupplierDetails, setActiveProductGlobal } from "../../featuers/authSlice";
import { formatNumberAddCommas } from "../../utils/Utils";
import { useDispatch } from "react-redux";

const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};
function SupplierDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const supplier = useSelector(selectActiveSupplierDetails);

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
  const [currentItems, setCurrentItems] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [as, setAs] = useState("admin");
  const [supplierID, setSupplierID] = useState("");
  const [orderColumn, setOrderColumn] = useState("product_name");
  const [filterCategory, setFilterCategory] = useState("");
  const [od_supplierID, setOd_supplierID] = useState("");
  useEffect(() => {
    if (supplier != null) {
      setSupplierID(supplier?.id);
      setOd_supplierID(supplier?.id);
    }
  }, [])
  // supplierID, as, currentPage, rowsPerPage, searchText, orderColumn, sortOrder, filterCategory
  const { data: supplierproducts,
    isLoading: loadingproducts,
    refetch: refetchSupplierProducts } = useGetSupplierProductsQuery({ supplierID, as, currentPage, rowsPerPage, searchText, orderColumn, sortOrder, filterCategory });


  useEffect(() => {
    if (supplierproducts != null) {
      setTotalRecords(supplierproducts?.meta?.total);
      setTableData(supplierproducts?.data);

    } else {
      setTableData([{}]);
    }
  }, [loadingproducts]);

  useEffect(() => {
    if (tableData != null) {
      setCurrentItems(tableData);
    }
  }, [tableData]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  }
  const orderBy = (column) => {
    setOrderColumn(column);
    setSortOrder((sortOrder === "DESC") ? "ASC" : "DESC");
    refetchPermissions();
  }
  //pagination section

  // const currentItems = ;
  const frontendbaseurl = process.env.REACT_APP_FRONT_BASE_URL;
  // Change Page



  const activateDeactivate = async (supplier, action) => { };
  const sendMail = () => { };
  const viewSupplierProfile = () => {
  };
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

  }
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
      { breakpoint: 3000, settings: { slidesToShow: 4 } },
      { breakpoint: 1540, settings: { slidesToShow: 3 } },
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
      .required('Please upload a file')
      .nullable()
      .test('fileSize', 'File size is too large', (value) => {
        if (value[0]) {
          return value[0].size <= 1024 * 1024 * 2;
        }
        return true;

      })
      .test('fileType', 'Only jpg,jpep and png files are allowed', (value) => {
        if (value[0]) {
          return ['image/jpg', 'jpg', 'image/jpeg', 'jpeg', 'image/png', 'png',].includes(value[0].type);
        }
        return true;

      })
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
        formData.append('product_images[]', uploadedfiles[i]);
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

  }
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

  }
  const showProductDetails = (product) => {
    dispatch(setActiveProductGlobal(product));
    navigate("/product-details");
  }

  const [activeTab, setActiveTab] = useState("products");
  //fetching supplier ordered products
  const [od_searchText, setOd_searchText] = useState("");
  const [od_currentItems, setOd_currentItems] = useState([]);
  const [od_rowsPerPage, setOd_rowsPerPage] = useState(10);
  const [od_tableData, setOd_tableData] = useState([]);
  const [od_totalRecords, setOd_totalRecords] = useState(0);
  const [od_currentPage, setOd_currentPage] = useState(1);
  const [od_sortOrder, setOd_sortOrder] = useState("ASC");

  const [od_orderColumn, setOd_orderColumn] = useState("product_name");
  const [od_filterCategory, setOd_filterCategory] = useState("");
  const { data: supplierorderedproducts,
    isLoading: loadinsupplierorderedgproducts,
    refetch: refetchSupplierOrderedProducts } = useGetSupplierOrderedProductsQuery({ od_supplierID, as, od_currentPage, od_rowsPerPage, od_searchText, od_orderColumn, od_sortOrder, od_filterCategory });
  useEffect(() => {
    if (supplierproducts != null) {
      setOd_totalRecords(supplierorderedproducts?.total);
      setOd_tableData(supplierorderedproducts?.data);

    } else {
      setOd_tableData([{}]);
    }
  }, [loadinsupplierorderedgproducts]);

  useEffect(() => {
    if (od_tableData != null) {
      setOd_currentItems(od_tableData);
    }
  }, [tableData]);

  const odpaginate = (pageNumber) => {
    setOd_currentPage(pageNumber);
  }
  //fetching supplier ordered products
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
            <Card className="card-bordered">

            </Card>
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
      <Modal size="lg" isOpen={modalAddProduct} toggle={toggleaddSupplierModal}>
        <ModalHeader
          toggle={toggleaddSupplierModal}
          close={
            <button className="close" onClick={toggleaddSupplierModal}>
              <Icon name="cross" />
            </button>
          }
        >
          {/* 
  

    setProductValue("currency", supplier.currency);
    setProductValue("quantity_cap", supplier.quantity_cap);
    // setSupplierValue("product_images", supplier.product_images);
    setProductValue("about_product", supplier.about_product); */}
          {editingProduct ? "Edit Product" : "Add Product"}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmitProduct(submitProductRegistration)}>
            <Row className="g-gs">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    Category
                  </label>
                  <div className="form-control-wrap">
                    <input
                      placeholder="Product Category"
                      type="text"
                      className="form-control"
                      id="product_category"
                      {...addProductForm("category")}
                    />
                    {addProductErrrors.category?.message && (
                      <span className="invalid">{addProductErrrors.category?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    Product Name
                  </label>
                  <div className="form-control-wrap">
                    <input
                      placeholder="Product Name"
                      type="text"
                      className="form-control"
                      id="supplier_name"
                      {...addProductForm("product_name")}
                    />
                    {addProductErrrors.product_name?.message && (
                      <span className="invalid">{addProductErrrors.product_name?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    Product SKU
                  </label>
                  <div className="form-control-wrap">
                    <input
                      placeholder="SKU Name"
                      type="text"
                      className="form-control"
                      id="sku_name"
                      {...addProductForm("sku_name")}
                    />
                    {addProductErrrors.sku_name?.message && (
                      <span className="invalid">{addProductErrrors.sku_name?.message}</span>
                    )}
                  </div>
                </div>
              </Col>

            </Row>
            <Row className="g-gs">
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    Quantity Available
                  </label>
                  <div className="form-control-wrap">
                    <input
                      placeholder="Quantity Available"
                      type="text"
                      className="form-control"
                      id="quantity_available"
                      {...addProductForm("quantity_available")}
                    />
                    {addProductErrrors.quantity_available?.message && (
                      <span className="invalid">{addProductErrrors.quantity_available?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    Price
                  </label>
                  <div className="form-control-wrap">
                    <input
                      placeholder="Price"
                      type="text"
                      className="form-control"
                      id="price"
                      {...addProductForm("price")}
                    />
                    {addProductErrrors.price?.message && (
                      <span className="invalid">{addProductErrrors.price?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col md="4">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    currency
                  </label>
                  <div className="form-control-wrap">
                    <input
                      placeholder="Currency"
                      type="text"
                      className="form-control"
                      id="currency"
                      {...addProductForm("currency")}
                    />
                    {addProductErrrors.currency?.message && (
                      <span className="invalid">{addProductErrrors.currency?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="g-gs">
              <Col md="6">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    Quantity Cap
                  </label>
                  <div className="form-control-wrap">
                    <input
                      placeholder="Quantity Available"
                      type="text"
                      className="form-control"
                      id="quantity_cap"
                      {...addProductForm("quantity_cap")}
                    />
                    {addProductErrrors.quantity_cap?.message && (
                      <span className="invalid">{addProductErrrors.quantity_cap?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Product Images</label>
                  <div className="form-control-wrap">
                    <div className="form-file">
                      <input className="form-control" type="file" {...addProductForm("productImages")} multiple id="customMultipleFiles" />
                      {addProductErrrors.productImages && (
                        <span className="invalid">{addProductErrrors.productImages?.message}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Col>

            </Row>
            <Row className="g-gs">
              <Col md="12">
                <div className="form-group">
                  <label className="form-label" htmlFor="club">
                    About Product
                  </label>
                  <div className="form-control-wrap">
                    <textarea
                      placeholder="About Supplier"
                      type="text"
                      className="form-control"
                      id="about_supplier"
                      {...addProductForm("about_product")}
                    ></textarea>
                    {addProductErrrors.about_product?.message && (
                      <span className="invalid">{addProductErrrors.about_product?.message}</span>
                    )}
                  </div>
                </div>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <div className="form-group mt-2 ">
                  {!submittingAddProductForm && (
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

                      <img src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/${currentSlide?.image_url}`} className="w-100" alt="" />
                    </div>
                    {/* <img src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/${currentSlide?.image_url}`} className="w-100" alt="" /> */}
                  </div>
                </Slider>
                <Slider

                  {...settings}
                >
                  {
                    activeProduct?.product_images.map((item, key) => {
                      return (
                        <div
                          className={`slider-item ${currentSlide.id === item.id ? "slick-current" : ""}`}
                          key={item.id}
                          onClick={() => slideChange(item?.id)}>
                          {/* {currentSlide.id}{item?.id} */}
                          <div className="thumb">
                            <img src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/${item?.image_url}`} className="w-100" alt="" />
                          </div>
                        </div>
                      )
                    })
                  }

                </Slider>
              </div>
            </div>
          </Card>

        </ModalBody>
        <ModalFooter className="bg-light">
          <span className="sub-text"></span>
        </ModalFooter>
      </Modal>
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
                      className="nav-link "
                      href="#personal"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setActiveTab("products");
                      }}
                    >
                      <Icon name="user-circle"></Icon>
                      <span>Products</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link "
                      href="#personal"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setActiveTab("ordered_products");
                      }}
                    >
                      <Icon name="repeat"></Icon>
                      <span>Ordered Products</span>
                    </a>
                  </li>

                  <li className="nav-item nav-item-trigger d-xxl-none">
                    <Button className={`toggle btn-icon btn-trigger ${sideBar && "active"}`} onClick={toggle}>
                      <Icon name="user-list-fill"></Icon>
                    </Button>
                  </li>
                </ul>
                {
                  ((activeTab === "products")) &&
                  <div className="card-inner">
                    <Block>
                      <BlockHead>
                        <BlockHeadContent>
                          <Button
                            color="primary"
                            style={{ display: "0", justifyContent: "right" }}
                            onClick={showAddModal}
                          >
                            New Product
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
                                  onChange={(e) => setSearchText(e.target.value)}

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
                      </BlockHead>
                      <BlockContent>
                        <DataTable className="card-stretch">
                          <DataTableBody>
                            <DataTableHead>

                              <DataTableRow size="mb">
                                <span className="sub-text">Product Name Name </span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">SKU Name </span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">Price </span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">Quantity Available </span>
                              </DataTableRow>
                              <DataTableRow className="nk-tb-col-tools text-end">
                                <span className="sub-text">Action</span>
                              </DataTableRow>
                            </DataTableHead>
                            {/*Head*/}
                            {supplierproducts != undefined &&
                              supplierproducts.data != null &&
                              supplierproducts.data.map((product, index) => {
                                let product_name_split = product.product_name.split(" ");
                                let passed_for_avatar = "";
                                if (product_name_split.length == 1) {
                                  passed_for_avatar = product_name_split[0];
                                } else if (product_name_split.length == 2) {
                                  passed_for_avatar = product_name_split[0] + " " + product_name_split[1];
                                } else if (product_name_split.length > 2) {
                                  passed_for_avatar = product_name_split[0] + " " + product_name_split[1];
                                }
                                return (
                                  <DataTableItem key={index}>

                                    <DataTableRow size="mb">{product?.product_name}</DataTableRow>
                                    <DataTableRow size="mb">{product?.sku_name}</DataTableRow>
                                    <DataTableRow size="mb">{formatNumberAddCommas(product?.price)}</DataTableRow>
                                    <DataTableRow size="mb">
                                      {product.status == 1 && (
                                        <Badge color="success" >
                                          Active
                                        </Badge>
                                      )}
                                      {product.status == 0 && (
                                        <Badge color="warning" >
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
                                                {product?.status === 1 && (
                                                  <React.Fragment>
                                                    <li onClick={() => deleteProduct(product)}>
                                                      <DropdownItem
                                                        tag="a"
                                                        href="#edit"
                                                        onClick={(ev) => {
                                                          ev.preventDefault();
                                                        }}
                                                      >
                                                        <Icon name="cross"></Icon>
                                                        <span>Delete Product</span>
                                                      </DropdownItem>
                                                    </li>
                                                    <li className="divider"></li>
                                                    <li onClick={() => showUpdateModal(product)}>
                                                      <DropdownItem
                                                        tag="a"
                                                        href="#suspend"
                                                        onClick={(ev) => {
                                                          ev.preventDefault();
                                                        }}
                                                      >
                                                        <Icon name="pen2"></Icon>
                                                        <span>Edit Product</span>
                                                      </DropdownItem>
                                                    </li>
                                                    <li className="divider"></li>
                                                    <li onClick={() => showProductImages(product)}>
                                                      <DropdownItem
                                                        tag="a"
                                                        href="#suspend"
                                                        onClick={(ev) => {
                                                          ev.preventDefault();
                                                        }}
                                                      >
                                                        <Icon name="eye"></Icon>
                                                        <span>View Images</span>
                                                      </DropdownItem>
                                                    </li>
                                                    <li className="divider"></li>
                                                    <li onClick={() => showProductDetails(product)}>
                                                      <DropdownItem
                                                        tag="a"
                                                        href="#suspend"
                                                        onClick={(ev) => {
                                                          ev.preventDefault();
                                                        }}
                                                      >
                                                        <Icon name="eye"></Icon>
                                                        <span>View Product Details</span>
                                                      </DropdownItem>
                                                    </li>
                                                  </React.Fragment>
                                                )}
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
                            {currentItems != null && currentItems != undefined ? (
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
                      </BlockContent>
                    </Block>
                  </div>
                }

                {
                  ((activeTab === "ordered_products")) &&
                  <div className="card-inner">
                    <Block>
                      <BlockHead>
                        <BlockHeadContent>

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
                                  onChange={(e) => setOd_searchText(e.target.value)}

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
                                        onChange={(e) => setOd_rowsPerPage(e.target.value)}
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
                      </BlockHead>
                      <BlockContent>
                        <DataTable className="card-stretch">
                          <DataTableBody>
                            <DataTableHead>

                              <DataTableRow size="mb">
                                <span className="sub-text">Product Name </span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">SKU Name </span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">Quantity Bought </span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">Total Cost </span>
                              </DataTableRow>
                              <DataTableRow size="mb">
                                <span className="sub-text">Date Ordered </span>
                              </DataTableRow>
                            </DataTableHead>
                            {/*Head*/}
                            {supplierorderedproducts != undefined &&
                              supplierorderedproducts.data != null &&
                              supplierorderedproducts.data.map((product, index) => {
                                let product_name_split = product.product_name.split(" ");
                                let passed_for_avatar = "";
                                if (product_name_split.length == 1) {
                                  passed_for_avatar = product_name_split[0];
                                } else if (product_name_split.length == 2) {
                                  passed_for_avatar = product_name_split[0] + " " + product_name_split[1];
                                } else if (product_name_split.length > 2) {
                                  passed_for_avatar = product_name_split[0] + " " + product_name_split[1];
                                }
                                return (
                                  <DataTableItem key={index}>
                                    <DataTableRow size="mb">{product?.product_name}</DataTableRow>
                                    <DataTableRow size="mb">{product?.sku_name}</DataTableRow>
                                    <DataTableRow size="mb">{formatNumberAddCommas(product?.quantity_available)}</DataTableRow>
                                    <DataTableRow size="mb">{formatNumberAddCommas(product?.total_product_cost)}</DataTableRow>
                                    <DataTableRow size="mb">{formatTimestampDate(product?.created_at)}</DataTableRow>
                                  </DataTableItem>
                                );
                              })}
                          </DataTableBody>
                          <div className="card-inner">
                            {od_currentItems != null && od_currentItems != undefined ? (
                              <PaginationComponent
                                itemPerPage={od_rowsPerPage}
                                totalItems={od_totalRecords}
                                paginate={odpaginate}
                                currentPage={od_currentPage}
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
                }


              </div>

              <Sidebar toggleState={sideBar}>
                <div className="card-inner">
                  <div className="user-card user-card-s2 mt-5 mt-xxl-0">
                    <UserAvatar className="lg" theme="primary" text={findUpper("")} />
                    <div className="user-info">
                      <Badge color="outline-light" pill className="ucap"></Badge>
                      <h5>{supplier.supplier_name}</h5>
                      <span className="sub-text">{supplier.supplier_email}</span>
                      <span className="sub-text">{supplier.supplier_phone}</span>
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
                        }}
                        className="btn-trigger btn-icon"
                      >
                        <Icon name="shield-off"></Icon>
                      </Button>
                    </li>
                    <li>
                      <Button
                        href="#mail"
                        onClick={(ev) => {
                          ev.preventDefault();
                        }}
                        className="btn-trigger btn-icon"
                      >
                        <Icon name="mail"></Icon>
                      </Button>
                    </li>
                    <li>
                      <Button
                        href="#download"
                        onClick={(ev) => {
                          ev.preventDefault();
                        }}
                        className="btn-trigger btn-icon"
                      >
                        <Icon name="download-cloud"></Icon>
                      </Button>
                    </li>
                    <li>
                      <Button
                        href="#bookmark"
                        onClick={(ev) => {
                          ev.preventDefault();
                        }}
                        className="btn-trigger btn-icon"
                      >
                        <Icon name="bookmark"></Icon>
                      </Button>
                    </li>
                    <li>
                      <Button
                        href="#cancel"
                        onClick={(ev) => {
                          ev.preventDefault();
                        }}
                        className="btn-trigger btn-icon text-danger"
                      >
                        <Icon name="na"></Icon>
                      </Button>
                    </li>
                  </ul>
                </div>

                <div className="card-inner">
                  <Row className="text-center">
                    <Col size="6">
                      <div className="profile-stats">
                        <span className="amount">{supplierproducts?.data.length}</span>
                        <span className="sub-text">Total Products</span>
                      </div>
                    </Col>
                    <Col size="6">
                      <div className="profile-stats">
                        <span className="amount">{supplier.supplier_product.length}</span>
                        <span className="sub-text">Total ordered products</span>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="card-inner">
                  <OverlineTitle tag="h6" className="mb-3">
                    About The supplier
                  </OverlineTitle>
                  <p>{supplier.about_supplier}</p>
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

export default SupplierDetails;
