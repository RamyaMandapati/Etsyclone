import Axios from 'axios'
import React, { useState } from 'react'

import { useStateValue } from '../StateProvider'
import Navigationbar from './Navigationbar'
import ShopHome from './ShopHome'
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectShop, selectUser } from "../features/userSlice";

function SellOnEtsy() {

  const user = useSelector(selectUser);
  const shop = useSelector(selectShop);

  let redirectVar = null;
  if (!user) {
    console.log("cookie is found " + user);
    redirectVar = <Navigate to="/Home" />;
  }

  let gotoSellPage = null;
  if (user.shopName === null) {
    if (shop === null) {
      gotoSellPage = <div>{<Navigate to="/ShopName" />}</div>;
    } else {
      gotoSellPage = (
        <div>
          <Navigate to="/ShopHome" />
        </div>
      );
    }
  } else {
    gotoSellPage = (
      <div>
        <Navigate to="/ShopHome" />
      </div>
    );
  }

  return (
    <div>
      {redirectVar}
      <Navigationbar />
     
      <hr></hr>
      {/* {user.shopName} */}
      {gotoSellPage}
    </div>
  );
}

export default SellOnEtsy