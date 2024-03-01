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
    BlockHead,
    BlockHeadContent,
    PreviewCard,
    Block,
    BlockBetween,
    Icon,
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
    useGetSupplierProductsQuery,
} from "../../api/admin/adminActionsApi";
import { Link, useNavigate } from "react-router-dom";
import { clearCart, reduceCartItemQTY, removeCartItem, selectActiveSupplierDetails, selectCartItems, setActiveProductGlobal, setCartItems } from "../../featuers/authSlice";
import { formatNumberAddCommas } from "../../utils/Utils";
import { useDispatch } from "react-redux";
import "./ShoppingCart.css";
import DataTable from "react-data-table-component";
import { useCheckoutFromCartMutation } from "../../api/commonEndPointsAPI";
const ExpandableRowComponent = ({ data }) => {
    return (
        <ul className="dtr-details p-2 border-bottom ms-1">
            <li className="d-block d-sm-none mb-10">
                <span className="dtr-title">Order Quantity</span> <span className="dtr-data"><CartOperations product={data} /></span>
            </li>
            <li className="d-block d-sm-none  mb-10">
                <span className="dtr-title ">Line Total</span> <span className="dtr-data"> <LineTotal product={data} /></span>
            </li>
            <li>
                <span className="dtr-title">Remove From Cart</span> <span className="dtr-data"> <RemoveButton product={data} /></span>
            </li>
        </ul>
    );
};
const NoDataInCard = () => {
    const navigate = useNavigate();
    const goToShp = () => {
        navigate("/products");
    }
    return (
        <div style={{ width: '100%' }}>
            <Alert className="alert-icon" color="info" style={{ margin: "50px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }} >
                <div>

                    <p> <Icon name="alert-circle" /> No Items In the Cart.</p>

                </div>
                <div>
                    <Button color="primary" outline className="btn-dim btn-white  " onClick={goToShp}>
                        <Icon name="briefcase"></Icon>
                        <span>Start Shopping </span>
                    </Button>&nbsp;&nbsp;
                </div>


            </Alert>
        </div>
    );
}
const ProductThumpNail = ({ product }) => {
    return (
        <span style={{ margin: "10px", display: "flex", flexDirection: "column", }}>
            <span className="title" style={{ width: "100%" }}>{product?.product_name}</span><br></br>
            <img style={{ height: "50px", width: "50px" }} src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/${product?.default_image?.image_url}`} alt="product" className="thumb" />
        </span>
    );
};
const CartOperations = ({ product }) => {
    const dispatch = useDispatch();
    const increaseCounter = (product) => {
        dispatch(setCartItems(product));
    }
    const decreaseCounter = (product) => {
        dispatch(reduceCartItemQTY(product));
    }
    const removeFromCart = (product) => {
        dispatch(removeCartItem(product));
    }
    return (<div className="cart-action-container" >
        <Button
            color="light"
            outline
            onClick={() => decreaseCounter(product)}
        >
            <Icon name="minus"></Icon>
        </Button>
        <input
            className="form-control "
            type="number"
            value={product.quantity}
            onChange={(e) => setCounter(Number(e.target.value))}
        />
        <Button
            color="light"
            outline
            onClick={() => increaseCounter(product)}
        >
            <Icon name="plus"></Icon>
        </Button>

    </div>);
};
const RemoveButton = ({ product }) => {
    const dispatch = useDispatch();
    const removeFromCart = (product) => {
        dispatch(removeCartItem(product));
    }

    return (<Button
        color="warning"
        onClick={() => removeFromCart(product)}
    >
        <Icon name="trash"></Icon>
    </Button>);
};
const LineTotal = ({ product }) => {
    const removeFromCart = (product) => {
        dispatch(removeCartItem(product));
    }

    return (<span>
        {product?.currency?.currency_abreviation} {formatNumberAddCommas(product.quantity * product.price)}
    </span>);
};
function ShoppingCart() {

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

    const columns = [
        {
            name: 'Product',

            cell: row => <ProductThumpNail product={row} />,
        },
        {
            name: 'Line Total',
            selector: row => <LineTotal product={row} />,
        }, {
            name: 'Order Quantity',
            hide: "md",
            selector: row => <CartOperations product={row} />,
        },
        {
            name: 'Remove',
            hide: "md",
            selector: row => <RemoveButton product={row} />,
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
        const resutlt = await saveCartProducts({ 'cartItems': cartItems });
        if ("error" in resutlt) {
            if (resutlt.error.data.message) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: resutlt.error.data.message,
                    focusConfirm: false
                });
            } else if (resutlt.error.data.error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: resutlt.error.data.error,
                    focusConfirm: false
                });
            }

        } else {
            dispatch(clearCart());
            Swal.fire({
                icon: "success",
                title: "Order Placed",
                text: resutlt.data.message,
                focusConfirm: false
            });


        }
    }
    let cart_total = cartItems.reduce((acc, row) => acc + (row.quantity * row.price), 0);

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
                        data={cartItems}
                        noDataComponent={<NoDataInCard />}
                        expandableRowsComponent={ExpandableRowComponent}
                        expandableRows={mobileView}

                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                        {
                            (cartItems.length > 0) ?
                                <table className="table table-bordered" style={{ width: "300px" }}>
                                    <tbody>
                                        <tr>
                                            <td><strong>SubTotal (RA)</strong></td>
                                            <td>{formatNumberAddCommas(cart_total)}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Taxes (RA)</strong></td>
                                            <td>{formatNumberAddCommas(0.00)}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total Due (RA)</strong></td>
                                            <td>{formatNumberAddCommas(cart_total)}</td>
                                        </tr>
                                        <tr>

                                            <td colSpan="2" >
                                                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center", }}>
                                                    <Button color="primary" className="rounded" onClick={checkOut} >
                                                        <span>Checkout</span>
                                                        <Icon name="arrow-right" />
                                                    </Button>
                                                </div>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                :
                                <div></div>
                        }

                    </div>
                </Block >
            </Content >
        </>
    );
}

export default ShoppingCart;
