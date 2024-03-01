import React, { useState } from "react";
import UserAvatar from "../../../../components/user/UserAvatar";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Icon } from "../../../../components/Component";
import { LinkList, LinkItem } from "../../../../components/links/Links";
import { useSelector, useDispatch } from "react-redux";
import { setMainRole, logOut, setSystemWallet, setUserWallet, setHasInvested, selectMainRole, selectCurrentUser, setCredentials } from "../../../../featuers/authSlice";
import { findUpper } from "../../../../utils/Utils";
import { Link, Navigate, useNavigate } from "react-router-dom";

const User = () => {
  const navigateto = useNavigate();
  const currentuser = useSelector(selectCurrentUser);
  const currentRole = useSelector(selectMainRole);

  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);

  const handleSignout = () => {
    dispatch(logOut(null));
    // dispatch(setCredentials(null));
    // dispatch(setHasInvested(null));
    // dispatch(setInviteToken(null));
    // dispatch(setMainRole(null));
    // dispatch(setSystemWallet(null));
    // dispatch(setUserWallet(null));
    // navigateto("/login");
  };
  const setTheCurrentMember = () => {

  }
  const dispatch = useDispatch();


  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <UserAvatar icon="user-alt" className="sm" />
          <div className="user-info d-none d-md-block">
            <div className="user-status">{currentuser?.role_name}</div>
            <div className="user-name dropdown-indicator">{currentuser?.full_name}</div>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
          <div className="user-card sm">
            <div className="user-avatar">
              <span></span>
            </div>
            <div className="user-info">
              <span className="lead-text">{currentuser?.full_name}</span>
              <span className="sub-text">{currentuser?.email}</span>
            </div>
          </div>
        </div>
        <div className="dropdown-inner">

        </div>
        <div className="dropdown-inner">
          {
            (currentRole?.role_name === "Contributor") &&
            <LinkList>
              <a href={`${process.env.PUBLIC_URL}/user-profile`} >
                <Icon name="signout"></Icon>
                <span>View Profile</span>
              </a>
            </LinkList>
          }
          {
            (currentRole?.role_name === "Super Admin") &&
            <LinkList>
              <a href={`${process.env.PUBLIC_URL}/admin-profile`} >
                <Icon name="signout"></Icon>
                <span>View Profile</span>
              </a>
            </LinkList>
          }

          <LinkList>
            <a href="#" onClick={handleSignout}>
              <Icon name="signout"></Icon>
              <span>Sign Out {currentRole?.role?.name}</span>
            </a>
          </LinkList>


        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
