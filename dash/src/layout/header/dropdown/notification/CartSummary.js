import React from "react";
import { DropdownToggle, DropdownMenu, UncontrolledDropdown, Button } from "reactstrap";
import { useSelector } from "react-redux";
import Icon from "../../../../components/icon/Icon";
import data from "./NotificationData";
import { Badge, Card } from "reactstrap"
import { selectCartItems } from "../../../../featuers/authSlice";
import "./CartSummary.css";
import { formatNumberAddCommas } from "../../../../utils/Utils";
import { useNavigate } from "react-router";

const CartSummary = () => {
    const cartItems = useSelector(selectCartItems);
    const navigate = useNavigate();
    const goToCart = () => {
        navigate("/shoppingCart")
    }

    return (
        <UncontrolledDropdown className="user-dropdown">
            <DropdownToggle tag="a" className="dropdown-toggle nk-quick-nav-icon">
                <div className="" style={{ display: "flex", flexDirection: "row" }}>
                    <Icon name="cart" />
                    <Badge color="primary" style={{ borderRadius: "100%", height: "20px" }}>{cartItems.length}</Badge>

                </div>

            </DropdownToggle>
            <DropdownMenu end className="dropdown-menu-xl dropdown-menu-s1">
                <div className="dropdown-head">

                </div>
                <div className="dropdown-body">
                    <div className="nk-notification" style={{ display: "flex", flexDirection: "column" }}>
                        {
                            cartItems != null &&
                            cartItems.map((item, key) => {
                                return (
                                    <div key={item?.id}>
                                        <div className="single-cart-item-container-name">
                                            {item?.product_name}
                                        </div>
                                        <div className="single-cart-item-container">
                                            <div className="image">
                                                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                                    <div className="card-image">
                                                        <div className="thumb">

                                                            <img src={`${process.env.REACT_APP_API_IMAGE_BASE_URL}/${item?.default_image?.image_url}`} className="w-100" alt="" />
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="quantity">
                                                {item?.quantity}
                                            </div>
                                            <div className="price">
                                                @ {item.currency?.currency_abreviation}   {formatNumberAddCommas(item?.price)}
                                            </div>
                                            <div className="action_remove">
                                                <Button color="warning"><Icon name="trash"  ></Icon></Button>
                                            </div>
                                        </div> </div>);

                            })
                        }


                    </div>
                </div>
                <div className="dropdown-foot center">
                    <a href="#viewall" onClick={goToCart}>
                        View Cart
                    </a>
                </div>
            </DropdownMenu>
        </UncontrolledDropdown>
    );

};

export default CartSummary;
