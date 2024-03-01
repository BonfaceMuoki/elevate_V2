import React, { useState } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import RecentInvest from "../components/partials/invest/recent-investment/RecentInvest";
import Notifications from "../components/partials/default/notification/Notification";
import { DropdownToggle, DropdownMenu, Card, UncontrolledDropdown, DropdownItem } from "reactstrap";

import {
  useGetAccesorRequestsQuery,
  useApproveAccesorRequestMutation,
  useRejectAccesorRequestMutation,
} from "../api/admin/accesorRequestsSlliceApi";
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
import { BalanceBarChart, DepositBarChart, WithdrawBarChart } from "../components/partials/charts/invest/InvestChart";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import Select from "react-select";
import { CardTitle } from "reactstrap";

const ContributorDashboard = () => {
  useGetAllTiersQuery;
  const { data: alltiers, isLoading: loadingtiers } = useGetAllTiersQuery();
  console.log(alltiers);
  const [sm, updateSm] = useState(false);
  const toggleForm = () => setModalForm(!modalForm);
  const [modalForm, setModalForm] = useState(true);
  const makeTierPayment = (tier) => {
    setModalForm(true);
  };

  const paymentoptions = [
    { value: "SDT ERC2", label: "SDT ERC2" },
    { value: "USDT TRC20", label: "USDT TRC20" },
    { value: "USDT BEP20", label: "USDT BEP20" },
    { value: "USDC", label: "USDC" },
    { value: "DAI", label: "DAI" },
  ];
  const inviteUser = () => {
    setModalForm(true);
  }
  return (
    <>
      <Head title="Invest Dashboard" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Home Dashboard</BlockTitle>
              <BlockDes className="text-soft">
                <p>Logged in as Contributor !!!!</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="more-v"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <Button color="primary" outline className="btn-dim btn-white">
                        <Icon name="user-add-fill"></Icon>
                        <span>Invite </span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <Row className="g-gs">

            <Col md="6">
              <PreviewAltCard className="card-full">
                <div className="card-title-group align-start mb-0">
                  <div className="card-title">
                    <h6 className="subtitle">My Contributions</h6>
                  </div>
                  <div className="card-tools">
                    <TooltipComponent
                      iconClass="card-hint"
                      icon="help-fill"
                      direction="left"
                      id="invest-deposit"
                      text="Total Deposited"
                    ></TooltipComponent>
                  </div>
                </div>
                <div className="card-amount">
                  <span className="amount">4</span>
                  <span className="change up text-success">{/* <Icon name="arrow-long-up"></Icon>1.93% */}</span>
                </div>
                <div className="invest-data">
                  <div className="invest-data-amount g-2">
                    <div className="invest-data-history">
                      <div className="title">This Month</div>
                      <span className="amount">
                        2 <span className="currency currency-usd"> </span>
                      </span>
                    </div>
                    <div className="invest-data-history">
                      <div className="title">This Week</div>
                      <span className="amount">
                        2 <span className="currency currency-usd"> </span>
                      </span>
                    </div>
                  </div>
                  <div className="invest-data-ck">
                    <DepositBarChart />
                  </div>
                </div>
              </PreviewAltCard>
            </Col>

            <Col md="6">
              <PreviewAltCard className="card-full">
                <div className="card-title-group align-start mb-0">
                  <div className="card-title">
                    <h6 className="subtitle">My Earnings</h6>
                  </div>
                  <div className="card-tools">
                    <TooltipComponent
                      iconClass="card-hint"
                      icon="help-fill"
                      direction="left"
                      id="invest-withdraw"
                      text="Total Withdrawn"
                    ></TooltipComponent>
                  </div>
                </div>
                <div className="card-amount">
                  <span className="amount">
                    5<span className="currency currency-usd"></span>
                  </span>
                  <span className="change down text-danger">{/* <Icon name="arrow-long-down"></Icon>1.93% */}</span>
                </div>
                <div className="invest-data">
                  <div className="invest-data-amount g-2">
                    <div className="invest-data-history">
                      <div className="title">Invite Bonus</div>
                      <div className="amount">
                        3<span className="currency currency-usd"> </span>
                      </div>
                    </div>
                    <div className="invest-data-history">
                      <div className="title">Other Earnings</div>
                      <div className="amount">
                        2<span className="currency currency-usd"> </span>
                      </div>
                    </div>
                  </div>
                  <div className="invest-data-ck">
                    <WithdrawBarChart />
                  </div>
                </div>
              </PreviewAltCard>
            </Col>


            <Col xl="6" lg="6" style={{ overflow: "scroll" }}>
              <PreviewAltCard>

                <React.Fragment style={{ overflow: "scroll" }}>
                  <div className="card-inner border-bottom">
                    <div className="card-title-group">
                      <CardTitle>
                        <h6 className="title">Membership Tiers</h6>
                      </CardTitle>
                      <div className="card-tools">
                        <Button color="primary" outline className="btn">Invest</Button>
                      </div>
                    </div>
                  </div>
                  <table className="table table-bordered table-responsive m-1 mt-3">
                    <thead>
                      <tr>
                        <th scope="col">Club</th>
                        <th scope="col">Tier</th>
                        <th scope="col">Contribution</th>
                        <th scope="col">Earnings</th>
                        <th scope="col">Reinvestment</th>
                        <th scope="col">Withdrawal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alltiers != undefined &&
                        alltiers.length > 0 &&
                        alltiers.map((tier, key) => {
                          return (
                            <tr key={key}>
                              <td>{tier.club_name}</td>
                              <td>{tier.tier_name}</td>
                              <td>{tier.contribution_amount}</td>
                              <td>{tier.payback_amount}</td>
                              <td>{tier.reinvestment}</td>
                              <td>{tier.withdrawal}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </React.Fragment>

              </PreviewAltCard>
            </Col>
            <Col xl="6" lg="6" style={{ overflow: "scroll" }} >
              <PreviewAltCard>
                <Modal isOpen={modalForm} toggle={toggleForm}>
                  <ModalHeader
                    toggle={toggleForm}
                    close={
                      <button className="close" onClick={toggleForm}>
                        <Icon name="cross" />
                      </button>
                    }
                  >
                    Customer Info
                  </ModalHeader>
                  <ModalBody>
                    <form>
                      <div className="form-group">
                        <label className="form-label" htmlFor="full-name">
                          Full Name
                        </label>
                        <div className="form-control-wrap">
                          <input type="text" className="form-control" id="full-name" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="email">
                          Email
                        </label>
                        <div className="form-control-wrap">
                          <input type="text" className="form-control" id="email" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="phone-no">
                          Phone No
                        </label>
                        <div className="form-control-wrap">
                          <input type="number" className="form-control" id="phone-no" defaultValue="0880" />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Communication</label>
                        <ul className="custom-control-group g-3 align-center">
                          <li>
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="form-control custom-control-input"
                                id="fv-com-email"
                                name="com"
                                value="email"
                              />
                              <label className="custom-control-label" htmlFor="fv-com-email">
                                Email
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="form-control custom-control-input"
                                id="fv-com-sms"
                                name="com"
                                value="sms"
                              />
                              <label className="custom-control-label" htmlFor="fv-com-sms">
                                SMS
                              </label>
                            </div>
                          </li>
                          <li>
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="fv-com-phone"
                                name="com"
                                value="phone"
                              />
                              <label className="custom-control-label" htmlFor="fv-com-phone">
                                {" "}
                                Phone{" "}
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="amount">
                          Amount
                        </label>
                        <div className="form-control-wrap">
                          <input type="text" className="form-control" id="amount" />
                        </div>
                      </div>
                      <div className="form-group">
                        <Button color="primary" type="submit" onClick={(ev) => ev.preventDefault()} size="lg">
                          Save Information
                        </Button>
                      </div>
                    </form>
                  </ModalBody>
                  <ModalFooter className="bg-light">
                    <span className="sub-text">Modal Footer Text</span>
                  </ModalFooter>
                </Modal>
                <React.Fragment>
                  <div className="card-inner border-bottom">
                    <div className="card-title-group">
                      <CardTitle>
                        <h6 className="title">My Invites</h6>
                      </CardTitle>
                      <div className="card-tools">
                        <Button color="primary" outline className="btn-dim btn-white" onClick={inviteUser()}>  <Icon name="user-add-fill"></Icon> Invite</Button>
                      </div>
                    </div>
                  </div>
                  <table className="table table-bordered m-1 mt-3">
                    <thead>
                      <tr>
                        <th scope="col">Invite Email</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alltiers != undefined &&
                        alltiers.length > 0 &&
                        alltiers.map((tier, key) => {
                          return (
                            <tr key={key}>
                              <td>{tier.club_name}</td>
                              <td>{tier.tier_name}</td>
                              <td>{tier.contribution_amount}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </React.Fragment>

              </PreviewAltCard>
            </Col>
          </Row>
        </Block>
      </Content>
    </>
  );
};



export default ContributorDashboard;
