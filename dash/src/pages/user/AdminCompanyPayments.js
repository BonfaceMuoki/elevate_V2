import React, { useEffect, useState } from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { findUpper } from "../../utils/Utils";
import {
    BlockHead,
    BlockHeadContent,
    PreviewCard,
    Block,
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
} from "../../components/Component";
import UserAvatar from "./UserAvatar";
import { toast } from "react-toastify";
import { Badge, DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useGetUsersQuery, useDeactivateUserMutation, useGetTierEarningsQuery, usePayMemberMutation, useGetBonusPaymentsQuery, useGetCompanyPaymentsQuery } from "../../api/admin/adminActionsApi";
import { Link, useNavigate } from "react-router-dom";
import { setActiveUserDetails } from "../../featuers/authSlice";
const CloseButton = () => {
    return (
        <span className="btn-trigger toast-close-button" role="button">
            <Icon name="cross"></Icon>
        </span>
    );
};
function AdminCompanyPayments() {
    const navigateto = useNavigate();
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
    const [activateDeactivateUser, { isLoading: submittingactivation }] = useDeactivateUserMutation();
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const { data: users, isLoading: loadingusers, refetch: refetchUsers } = useGetUsersQuery();

    const { data: tierEarnings, isLoading: loadingTierEarnings, refetch: refetchTierEarnings } = useGetTierEarningsQuery();
    const { data: bonusPayments, isLoading: loadingBonusPayment, refetch: refetchBonusPayments0 } = useGetCompanyPaymentsQuery();


    const [currentItems, setcurrentItems] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (bonusPayments != null) {
            setTableData(bonusPayments?.data);
        } else {
            setTableData([{}]);
        }
    }, [users]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage, setItemPerPage] = useState(10);
    useEffect(() => {
        if (tableData != null) {
            const indexOfLastItem = currentPage * itemPerPage;
            const indexOfFirstItem = indexOfLastItem - itemPerPage;
            setcurrentItems(tableData?.slice(indexOfFirstItem, indexOfLastItem));
        }
    }, [tableData]);
    const activateDeactivate = async (user, action) => {
        const forData = new FormData();
        forData.append("action", action);
        forData.append("user", user.id);
        const result = await activateDeactivateUser(forData);

        if ("error" in result) {
            toastMessage(result.error.data.message, "error");

        } else {

            toastMessage(result.data.message, "success");
            refetchUsers();

            // resetInvestmenrForm();
        }


    };
    const [payMember, { isLoading: payingMember }] = usePayMemberMutation();
    const sendPayment = async (earning, action) => {
        if (earning.user.user_account === null) {
            toastMessage("The are no associated payment details", "error");
            return;
        }

        const formData = new FormData();
        formData.append("earning", earning.id);
        formData.append("mathod", earning.user.user_account.payment_method);
        formData.append("wallet_id", earning.user.user_account.wallet_id);
        const result = await payMember(formData);

        if ("error" in result) {
            toastMessage(result.error.data.message, "error");
        } else {

            toastMessage(result.data.message, "success");
            refetchTierEarnings();
        }

    };
    return (
        <>
            <Head title="Member Payments" />
            <Content page="">
                <Block size="">
                    <BlockHead>
                        <BlockHeadContent>
                            <BlockTitle tag="h4">Company Payments</BlockTitle>
                        </BlockHeadContent>
                    </BlockHead>
                    <PreviewCard>
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
                                        <span className="sub-text">User Name</span>
                                    </DataTableRow>
                                    <DataTableRow>
                                        <span className="sub-text">Description</span>
                                    </DataTableRow>
                                    <DataTableRow size="mb">
                                        <span className="sub-text">Amount To Pay </span>
                                    </DataTableRow>
                                    <DataTableRow size="mb">
                                        <span className="sub-text">Status </span>
                                    </DataTableRow>
                                    <DataTableRow size="mb">
                                        <span className="sub-text">Action </span>
                                    </DataTableRow>
                                </DataTableHead>
                                {bonusPayments?.data != undefined &&
                                    bonusPayments?.data != null &&
                                    bonusPayments?.data.map((bonusPayment) => {
                                        return (
                                            <DataTableItem key={bonusPayment.id}>
                                                <DataTableRow>

                                                    <div className="user-card">
                                                        <UserAvatar
                                                            theme="default"
                                                            text={findUpper(
                                                                bonusPayment.payer.full_name != null && bonusPayment.payer.full_name != undefined ? bonusPayment.payer.full_name : ""
                                                            )}
                                                            image=""
                                                        ></UserAvatar>
                                                        <div className="user-info">
                                                            <span className="tb-lead">
                                                                {bonusPayment.payer.full_name}{" "}
                                                                <span
                                                                    className={`dot dot-${bonusPayment.payer.status === "Active"
                                                                        ? "success"
                                                                        : bonusPayment.payer.status === "Pending"
                                                                            ? "warning"
                                                                            : "danger"
                                                                        } d-md-none ms-1`}
                                                                ></span>
                                                            </span>
                                                            <span>{bonusPayment.payer.email}</span><br></br>
                                                            {/* <span></span><br></br> */}
                                                            {/* <span>{bonusPayment.recipient?.wallet_id} - {bonusPayment.recipient?.user_account?.payment_method}</span><br></br> */}
                                                            {/* user_account */}
                                                        </div>
                                                    </div>
                                                </DataTableRow>
                                                <DataTableRow size="mb">
                                                    {bonusPayment.paid_as}
                                                </DataTableRow>
                                                <DataTableRow size="mb">
                                                    {bonusPayment.amount_paid}
                                                </DataTableRow>
                                                <DataTableRow size="mb">
                                                    {
                                                        (bonusPayment.payment_status == 1) && <Badge color="success">Paid</Badge>
                                                    }
                                                    {
                                                        (bonusPayment.payment_status == 0) && <Badge color="warning">Panding</Badge>
                                                    }
                                                </DataTableRow>
                                                <DataTableRow>
                                                    <ul className="nk-tb-actions gx-1">
                                                        <li>
                                                            <UncontrolledDropdown>
                                                                <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                                                                    <Icon name="more-h"></Icon>
                                                                </DropdownToggle>
                                                                <DropdownMenu end>
                                                                    <ul className="link-list-opt no-bdr">
                                                                        {bonusPayment.payment_status === 1 && (
                                                                            <React.Fragment>
                                                                                <li onClick={() => sendPayment(bonusPayment, 'pay')}>
                                                                                    <DropdownItem
                                                                                        tag="a"
                                                                                        href="#edit"
                                                                                        onClick={(ev) => {
                                                                                            ev.preventDefault();
                                                                                        }}
                                                                                    >
                                                                                        <Icon name="cross"></Icon>
                                                                                        <span>Cancel Payment</span>
                                                                                    </DropdownItem>
                                                                                </li>
                                                                                <li className="divider"></li>
                                                                                <li onClick={() => sendPayment(bonusPayment.id)}>
                                                                                    <DropdownItem
                                                                                        tag="a"
                                                                                        href="#suspend"
                                                                                        onClick={(ev) => {
                                                                                            ev.preventDefault();
                                                                                        }}
                                                                                    >
                                                                                        <Icon name="eye"></Icon>
                                                                                        <span>Send Payment</span>
                                                                                    </DropdownItem>
                                                                                </li>

                                                                            </React.Fragment>
                                                                        )}
                                                                        {bonusPayment?.payment_status === 0 && (
                                                                            <React.Fragment>
                                                                                <li onClick={() => sendPayment(bonusPayment, 'cpay')}>
                                                                                    <DropdownItem
                                                                                        tag="a"
                                                                                        href="#suspend"
                                                                                        onClick={(ev) => {
                                                                                            ev.preventDefault();
                                                                                        }}
                                                                                    >
                                                                                        <Icon name="eye"></Icon>
                                                                                        <span>Send Payment</span>
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
                                {users != null && users != undefined ? (
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

export default AdminCompanyPayments;
