import React,{useEffect, useState} from 'react'
import Axios from 'axios';
import "../index.css";
import "../App.css"
import {Link, Navigate, useParams} from 'react-router-dom'
import {useNavigate} from 'react-router'
import { padding } from '@mui/system';
import { useDispatch } from "react-redux";


function EditImage() {
    const dispatch=useDispatch();
    let navigate=useNavigate();
    const [itemImage, setItemImage] = useState("");
    const {id}=useParams();
    const product_id=Number(id);
    const updateImage=(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("itemImage", itemImage);
        console.log("image"+itemImage);
        Axios.post(`http://localhost:5000/updateImage/${product_id}`,formData,{
            headers: { "content-Type": "multipart/form-data" },
          })
        .then(response=>{
          console.log(response);
            if(response.data.success)
            {
                console.log("Image update successfully");
                navigate('/ShopHome');
            }
            else{
                console.log("Image upload failed");
            }
        }).catch(err => { console.log(err);})
    }


  return (
    <div className="bg-modal">
      <div className="modal-content">
            <h4 style={{margin:"10px"}}>Update Product Image</h4>
            <br />
            <input
              style={{ border: "none" }}
              type="file"
              name="itemImage"
              className="item_image"
              id="item_image"
              style={{marginLeft:"10px"}}
              onChange={(event) => {
                setItemImage(event.target.files[0]);
              }}
              required
            />
            <button type="submit" onClick={updateImage} style={{width:"150px", margin:"20px"}}>confirm</button>
    </div>
    </div>
  )
}

export default EditImage