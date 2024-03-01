import React from "react";
import Icon from "../../components/icon/Icon";
import { useState } from "react";
import { selectInviteToken, selectSystemWallet } from "../../featuers/authSlice";
import { useSelector } from "react-redux";


const News = () => {
  const invitetoken = useSelector(selectInviteToken);
  const systemwallet = useSelector(selectSystemWallet);
  const [copySuccess, setCopySuccess] = useState('');
  const textToCopy = process.env.REACT_APP_FRONTEND_BASE_URL + "?oinvite_token=" + invitetoken;

  return (
    <div className="nk-news-list">
      <a className="nk-news-item" href="#news" onClick={(ev) => ev.preventDefault()}>
        <div className="nk-news-icon">
          <Icon name="card-view" />
        </div>
        <div className="nk-news-text">
          <p>
            <span>{systemwallet?.wallet_id}</span>

          </p>
          <Icon name="external" />
        </div>
      </a>
    </div>
  );
};

export default News;
