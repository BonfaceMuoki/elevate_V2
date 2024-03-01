import React, { useEffect, useState } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import { findUpper } from "../utils/Utils";
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
} from "reactstrap";
import { useGetAllTiersQuery } from "../api/commonEndPointsAPI";
import {
    Block,
    BlockDes,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    Button,
    Row,
    Col,
    PreviewAltCard,
    TooltipComponent,
} from "../components/Component";
import { selectCurrentToken, selectMainRole } from "../featuers/authSlice";
import AdminDashboard from "./AdminDashboard";
import ContributorDashboard from "./ContributorDashboard";

import { useSelector } from "react-redux";
const CloseButton = () => {
    return (
        <span className="btn-trigger toast-close-button" role="button">
            <Icon name="cross"></Icon>
        </span>
    );
};

const Dashboard = () => {
    let currentToe = useSelector(selectCurrentToken);
    let currentrole = useSelector(selectMainRole);
    if (currentrole.name === "Super Admin") {
        return (
            <AdminDashboard />
        );
    } else if (currentrole.name === "Contributor") {
        return (
            <ContributorDashboard />
        );
    } else if (currentrole.name === "Supplier") {
        return (
            <>


            </>
        );
    }

};

export default Dashboard;
