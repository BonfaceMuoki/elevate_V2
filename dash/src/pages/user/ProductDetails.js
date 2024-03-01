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
    Block,
    BlockBetween,
    Icon,
    Row,
    Col,
} from "../../components/Component";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { reduceCartItemQTY, removeCartItem, selectActiveProductGlobal, selectCartItems, setCartItems } from "../../featuers/authSlice";
import makeAnimated from "react-select/animated";
import { SlickArrowLeft, SlickArrowRight } from "../../components/partials/slick/SlickComponents";
import Slider from "react-slick";
import { formatNumberAddCommas } from "../../utils/Utils";
const CloseButton = () => {
    return (
        <span className="btn-trigger toast-close-button" role="button">
            <Icon name="cross"></Icon>
        </span>
    );
};
const animatedComponents = makeAnimated();
function ProductDetails({ product_Details }) {
    const dispatch = useDispatch();
    const activeProduct = useSelector(selectActiveProductGlobal);
    const cartItems = useSelector(selectCartItems);
    const indexIfFound = cartItems.findIndex((citem) => citem.id === activeProduct.id);
    console.log(activeProduct, "activeProductactiveProduct");
    // isOpen={modalSeeProductImaages} toggle={toggleProductImages}
    const [counter, setCounter] = useState(1);
    const [currentSlide, setCurrentSlide] = useState({});
    const [modalSeeProductImaages, setModalSeeProductImaages] = useState(false);
    const toggleProductImages = () => setModalSeeProductImaages(!modalSeeProductImaages);
    useEffect(() => {
        if (activeProduct?.default_image != null) {
            setCurrentSlide(activeProduct?.default_image);
        }
    }, []);

    const slideChange = (index) => {
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
    const addItemToCart = (product) => {
        dispatch(setCartItems(product));
    }
    const increaseCounter = (product) => {
        dispatch(setCartItems(product));
    }
    const decreaseCounter = (product) => {
        dispatch(reduceCartItemQTY(product));
    }
    const removeFromCart = (product) => {
        dispatch(removeCartItem(product));
    }
    return (
        <>
            <Head title={`${activeProduct?.product_name} Details`} />
            <Content>
                <BlockHead size="sm">
                    <BlockBetween className="g-3">
                        <BlockHeadContent>


                        </BlockHeadContent>
                        <BlockHeadContent>
                            <Link to={`${process.env.PUBLIC_URL}/product-card`}>
                                <Button color="light" outline className="bg-white d-none d-sm-inline-flex">
                                    <Icon name="arrow-left"></Icon>
                                    <span>Back</span>
                                </Button>
                            </Link>
                            <Link to={`${process.env.PUBLIC_URL}/product-card`}>
                                <Button color="light" outline className="btn-icon bg-white d-inline-flex d-sm-none">
                                    <Icon name="arrow-left"></Icon>
                                </Button>
                            </Link>
                        </BlockHeadContent>
                    </BlockBetween>
                </BlockHead>

                <Block>
                    <Card className="card-bordered">
                        <div className="card-inner">
                            <Row className="pb-5">
                                <Col lg={6}>
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
                                </Col>
                                <Col lg={6}>
                                    <div className="product-info mt-5 me-xxl-5">
                                        <h4 className="product-price text-primary">
                                            {activeProduct?.currency?.currency_abreviation}   {formatNumberAddCommas(activeProduct?.price)}{" "}
                                            {/* <small className="text-muted fs-14px">
                                                ${sliderData.prevPrice === null ? "0.00" : sliderData.prevPrice}
                                            </small> */}
                                        </h4>
                                        <h2 className="product-title">{activeProduct?.product_name}</h2>
                                        <div className="product-rating">
                                            <ul className="rating">
                                                <li>
                                                    <Icon name="star-fill"></Icon>
                                                </li>
                                                <li>
                                                    <Icon name="star-fill"></Icon>
                                                </li>
                                                <li>
                                                    <Icon name="star-fill"></Icon>
                                                </li>
                                                <li>
                                                    <Icon name="star-fill"></Icon>
                                                </li>
                                                <li>
                                                    <Icon name="star-half"></Icon>
                                                </li>
                                            </ul>
                                            {/* <div className="amount">(2 Reviews)</div> */}
                                        </div>
                                        <div className="product-excrept text-soft">
                                            <p className="lead">
                                                {activeProduct?.about_product}
                                            </p>
                                        </div>
                                        <div className="product-meta">
                                            <ul className="d-flex g-3 gx-5">
                                                <li>
                                                    <div className="fs-14px text-muted">Category</div>
                                                    <div className="fs-16px fw-bold text-secondary">{activeProduct?.category?.category_name}{" "}</div>
                                                </li>

                                            </ul>
                                        </div>
                                        <div className="product-meta">

                                            {
                                                (indexIfFound > -1) ?
                                                    <ul className="d-flex flex-wrap ailgn-center g-2 pt-1">
                                                        <li className="w-140px">
                                                            <div className="form-control-wrap number-spinner-wrap">
                                                                <Button
                                                                    color="light"
                                                                    outline
                                                                    className="btn-icon number-spinner-btn number-minus"
                                                                    onClick={() => decreaseCounter(activeProduct)}
                                                                >
                                                                    <Icon name="minus"></Icon>
                                                                </Button>
                                                                <input
                                                                    type="number"
                                                                    className="form-control number-spinner"
                                                                    value={cartItems[indexIfFound].quantity}
                                                                    onChange={(e) => setCounter(Number(e.target.value))}
                                                                />
                                                                <Button
                                                                    color="light"
                                                                    outline
                                                                    className="btn-icon number-spinner-btn number-plus"
                                                                    onClick={() => increaseCounter(activeProduct)}
                                                                >
                                                                    <Icon name="plus"></Icon>
                                                                </Button>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <Button onClick={() => removeFromCart(activeProduct)} color="warning"> <Icon name="trash"></Icon></Button>
                                                        </li>
                                                    </ul>

                                                    : <Button color="primary" onClick={() => addItemToCart(activeProduct)}>Add to Cart</Button>
                                            }

                                            {/* <li className="ms-n1">
                                                    <Button className="btn-icon btn-trigger text-primary">
                                                        <Icon name="heart"></Icon>
                                                    </Button>
                                                </li> */}

                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <hr className="hr border-light" />

                        </div>
                    </Card>
                </Block>
            </Content>
        </>
    );
}

export default ProductDetails;
