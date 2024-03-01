import React, { useState } from "react";
import Content from "../layout/content/Content";
import Head from "../layout/head/Head";
import {
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  CardTitle,
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
import { DepositBarChart, WithdrawBarChart } from "../components/partials/charts/invest/InvestChart";
import { Modal, ModalBody, ModalHeader, ModalFooter,DropdownMenu, DropdownToggle, UncontrolledDropdown, DropdownItem  } from "reactstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetMyInvitesQuery, useSendUserInviteMutation } from "../api/auth/authApiSlice";
import { useSendInvestmentMutation,useGetMyInvestmentsQuery } from "../api/contributor/investmentEndPoints";
import { toast } from "react-toastify";
import { Badge } from "reactstrap";
import { useSelector,useDispatch } from "react-redux";
import { selectCurrentUser,selectHasInvested,setActiveGlobalTier } from "../featuers/authSlice";
import { useNavigate } from "react-router";
const CloseButton = () => {
  return (
    <span className="btn-trigger toast-close-button" role="button">
      <Icon name="cross"></Icon>
    </span>
  );
};

const TierListView = () => {
  const dispatch = useDispatch();
  const navigateto = useNavigate();
  const toastMessage=(message,type)=>{
    if(type=="success"){
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
    }else if(type=="error"){
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
    }
    else if(type=="warning"){
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

  }

  const logged=useSelector(selectCurrentUser);
  const hasinvested = useSelector(selectHasInvested);
  console.log("hasinvested"+hasinvested);
  const { data: alltiers, isLoading: loadingtiers } = useGetAllTiersQuery();
  console.log(alltiers);
  const { data: allinvites, isLoading: loadingInvites,refetch:refetchInvites } = useGetMyInvitesQuery();
  console.log(allinvites);
  const [sm, updateSm] = useState(false);
  const toggleForm = () => setModalForm(!modalForm);
  const [modalForm, setModalForm] = useState(false);

  const toggleInvestmentForm = () => setModalInvestmentForm(!modalInvestmentForm);
  const [modalInvestmentForm, setModalInvestmentForm] = useState(false);

  

  const paymentoptions = [
    { value: "SDT ERC2", label: "SDT ERC2" },
    { value: "USDT TRC20", label: "USDT TRC20" },
    { value: "USDT BEP20", label: "USDT BEP20" },
    { value: "USDC", label: "USDC" },
    { value: "DAI", label: "DAI" },
  ];
//invite form
const schemaInvite = yup.object().shape({
  full_name: yup.string().required(" Provide his/her name"),
  invite_email: yup.string().required("Please provide  email through which the user will be notified"),
  invite_phone: yup.string().required("Please provide the user phone number")
});

const {
  register: inviteUserForm,
  handleSubmit: handleSubmitUserInvite,
  setValue: setInviteValue,
  isLoading: loadingInviteDetails,
  formState: { errors: inviteUserErrors },
  reset:resetInviteUserForm
} = useForm({
  resolver: yupResolver(schemaInvite),
});
 const [sendUserInvive, { isLoading: loadingInvite }] = useSendUserInviteMutation();
 const submitInvite = async(data) => {
   console.log(data);
   const formData = new FormData();
   formData.append("invite_name",data.full_name);
   formData.append("invite_email",data.invite_email);
   formData.append("invite_phone",data.invite_phone);
   formData.append("registration_link",process.env.REACT_APP_FRONTEND_BASE_URL+"/accepting-invite");
   const result = await sendUserInvive(formData);
   console.log(result);
   if ("error" in result) {
    toastMessage(result.error.data.message,"error");
     if ("backendvalerrors" in result.error.data) {
     }
   } else {
    toggleForm();
    toastMessage(result.data.message,"success");
    resetInviteUserForm();
    refetchInvites();

   }
 };
//invite form
//investment form
const schemaInvest = yup.object().shape({
  amount: yup.string().required("Amount is required"),
  paymentProof: yup
  .mixed()
  .required('Please upload a file')
  .nullable()
  .test('fileSize', 'Payment Proof size is too large', (value) => {
    if (value[0]) {
      return value[0].size <= 1024 * 1024 * 2;
    }
    return true;

  })
  .test('fileType', 'Only PDF files are allowed', (value) => {
    if (value[0]) {
      console.log(value[0].type);
      return ['application/pdf', 'pdf','jpg','jpeg','png','PNG','JPEG','JPG','image/jpg','image/jpeg','image/png','image/PNG','image/JPEG','image/JPG'].includes(value[0].type);
    }
    return true;
  }),
  tier: yup.string().required("Tier Is required")
});

const {
  register: investmentForm,
  handleSubmit: handleSubmitUserInvestment,
  setValue: setInvestValue,
  isLoading: loadingInvestmentDetails,
  formState: { errors: investmentErrors },
  reset:resetInvestmenrForm
} = useForm({
  resolver: yupResolver(schemaInvest),
});
 const [sendInvestment, { isLoading: loadingInvestmestment}] = useSendInvestmentMutation();
 const submitInvestment = async (data) => {
  console.log("data");
   console.log(data);
   const formData = new FormData();
   formData.append("amount",data.amount);
   formData.append("paymentProof",data.paymentProof[0]);
   formData.append("club",data.club);
   formData.append("tier",data.tier);
   const result = await sendInvestment(formData);
   console.log(result);
   if ("error" in result) {
    toastMessage(result.error.data.message,"error");
     if ("backendvalerrors" in result.error.data) {
     }
   } else {
    toggleInvestmentForm();
    toastMessage(result.data.message,"success");
    // resetInvestmenrForm();
   }
 };
 const seeTierDetails = (tier)=>{
  dispatch(setActiveGlobalTier(tier));
  navigateto("/admin/tier-details");

 }
//investment form
  return (
    <>
      <Head title="Invest Dashboard" />
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>System Elevate Tiers</BlockTitle>
              <BlockDes className="text-soft">
                <p>Logged in as Admin !!!!</p>
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
                  {/* <ul className="nk-block-tools g-3">
                    <li>
                      <Button color="primary" outline className="btn-dim btn-white">
                        <Icon name="user-add-fill"></Icon>
                        <span>Invite </span>
                      </Button>
                    </li>
                  </ul> */}
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
        
          <Row className="g-gs mt-3">
            <Col md="12">
            <Modal isOpen={modalInvestmentForm} toggle={toggleInvestmentForm}>
                <ModalHeader
                  toggle={toggleInvestmentForm}
                  close={
                    <button className="close" onClick={toggleInvestmentForm}>
                      <Icon name="cross" />
                    </button>
                  }
                >
                  Investment Details
                </ModalHeader>
                <ModalBody>
                  
                </ModalBody>
                <ModalFooter className="bg-light">
                  <span className="sub-text"></span>
                </ModalFooter>
              </Modal>
              <Card className="card-bordered" style={{ height: "100%" }}>
                <CardHeader className="border-bottom">
                  <div className="card-title-group">
                    <CardTitle>
                      <h6 className="title">Investment Tiers</h6>
                    </CardTitle>
                    <div className="card-tools">
                      
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="card-inner">
                  <div className="table-responsive">
                    <table className="table table-bordered table-responsive ">
                      <thead>
                        <tr>
                          <th scope="col">Club</th>
                          <th scope="col">Tier</th>
                          <th scope="col">Contribution</th>
                          <th scope="col">Possible Earnings</th>
                          <th scope="col">Reinvestment</th>
                          <th scope="col">Withdrawal</th>
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
                                <td>{tier.payback_amount}</td>
                                <td>{tier.reinvestment}</td>
                                <td>{tier.withdrawal}</td>
                                <td>
                                <ul className="nk-tb-actions gx-1">
                                        <li>
                                          <UncontrolledDropdown>
                                            <DropdownToggle
                                              tag="a"
                                              className="dropdown-toggle btn btn-icon btn-trigger"
                                            >
                                              <Icon name="more-h"></Icon>
                                            </DropdownToggle>
                                            <DropdownMenu end>
                                              <ul className="link-list-opt no-bdr">
                                                <React.Fragment>
                                                  <li onClick={() => seeTierDetails(tier, "deactivate")}>
                                                    <DropdownItem
                                                      tag="a"
                                                      href="#edit"
                                                      onClick={(ev) => {
                                                        ev.preventDefault();
                                                      }}
                                                    >
                                                      <Icon name="list"></Icon>
                                                      <span>View Subscriptions / Elevate</span>
                                                    </DropdownItem>
                                                  </li>
                                                </React.Fragment>
                                              </ul>
                                            </DropdownMenu>
                                          </UncontrolledDropdown>
                                        </li>
                                      </ul>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
                <CardFooter className="border-top"></CardFooter>
              </Card>
            </Col>

          
          </Row>
        </Block>
      </Content>
    </>
  );
};

export default TierListView;
