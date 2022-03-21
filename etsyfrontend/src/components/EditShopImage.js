import React, { useState, useEffect } from "react";

import EditProduct from "./EditProduct"
import "../App.css"
import Popup from "./Popup";
import Axios from "axios";
import { Col, Card, Row } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import userSlice, { login, selectUser,updateshopImage } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

function EditShopImage() {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const user = useSelector(selectUser);
    const [shopProfileImage,setShopProfileImage]=useState("")
  const user_id=user.id;
  const updateImage=(e)=>{
    e.preventDefault();
  
    console.log(shopProfileImage);
    const formData = new FormData();
    formData.append("itemImage", shopProfileImage);
   console.log("image shop"+shopProfileImage);
    Axios.post(`http://3.19.143.233:5000/updateshopImage/${user_id}`,formData,{
        headers: { "content-Type": "multipart/form-data" },
      })
    .then(response=>{
        console.log(response);
        if(response.data.success)
        {
            console.log("Image update successfully");
            dispatch(updateshopImage({shopImage:response.data.shopimage})
              
            );
            navigate("/ShopHome")
            
        }
        else{
            console.log("Image upload failed");
        }
    }).catch(err => { console.log(err);})
}
  return (
    <div className="bg-modal">
      <div className="modal-content">
      <h4 style={{margin:"10px"}}>Update shop Image</h4>
         <input
              style={{ border: "none" }}
              type="file"
              name="itemImage"
              className="item_image"
              style={{marginLeft:"10px",marginTop:"20px"}}
              id="item_image"
              onChange={(e)=>{setShopProfileImage(e.target.files[0])}}
              
            />
        
            <button type="submit" onClick={updateImage} style={{width:"150px", margin:"20px"}}>update</button>
        </div>
    </div>
  )
}

export default EditShopImage