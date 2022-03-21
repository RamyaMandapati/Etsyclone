import React, { useState, useEffect } from "react";
import profilepicture from "../uploads/profilepicture.png"
import EditProduct from "./EditProduct"
import "../App.css"
import Popup from "./Popup";
import Axios from "axios";
import { Col, Card, Row } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {useNavigate} from 'react-router';
import Navigationbar from "./Navigationbar";
import { useParams } from "react-router-dom";


import userSlice, { selectUser, selectShop } from "../features/userSlice";
import { orange } from "@material-ui/core/colors";

function ShopHomecustomer(props) {
    const navigate=useNavigate();
    
    const shop= useSelector(selectShop);
    
      
    const {id}=useParams();
    const user_id=Number(id);
    const [owner,setOwner]=useState([])
    const [products, setProducts] = useState([]);
    useEffect(() => {
       
        viewItems();
        viewOwners();
    
      },[]);
      const viewOwners = () => {
       
        console.log("---------------in view owners-------------------");

        Axios.get(
          `http://54.219.66.85:5000/getOwner/${user_id}`
        ).then((response) => {
          console.log(response);
          if (response.data.success) {

              setOwner([...owner, ...response.data.result]);
              console.log("owner"+owner);
           } 
         
            
           else {
            console.log("Failed in ");
          }
        });
      };

      const viewItems = () => {
       
        console.log("---------------in view Items-------------------");

        Axios.post(
          `http://54.219.66.85:5000/getAllProductstoCustomer/${user_id}`
        ).then((response) => {
          console.log(response);
          if (response.data.success) {
           
              setProducts([...products, ...response.data.result]);
              console.log("details"+products);
           } 
         
            
           else {
            console.log("Failed in ");
          }
        });
      };
      const renderCards = products.map((product) => {
    return (
      <div className="col-md-4 mb-4">
        <div className="card" style={{height:"300px",width:"300px"}}>
          
             
              <img style={{width:"200px",height:"158px"}} src={require("../uploads/"+product.image)} alt="" />
              <div className="card-body">
                <h5 className="card-title">{product.productname}</h5>
                <p>Price: ${product.price}</p>
                
            </div>
          </div>
        </div>
    );
      });

  return (
    <div>
      
    <Navigationbar/>
    <hr></hr>
    <div>
    {owner.length === 0 ? (
            <div
              style={{
                display: "flex",
                height: "300px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h2>No post yet...</h2>
            </div>
          ) :(
    <div className="shophome_header">
      <div className="shop_details">
        
        <img
          className="shop_img"
           src={require("../uploads/"+owner[0].shopImage)} alt={profilepicture}
        ></img>
        <div className="shop_info">
          <h3 className="shop_name">{owner[0].shopname}</h3>
          <p>0 sales </p>
          <div className="htmlForm-group">
          {/* <Link to={`EditShopImage/${user_id}`} className="btn btn-success btn-sm" style={{borderRadius:"10px"}}>edit shop image</Link> */}
          
          
          </div>
        </div>
      </div>
    
      <div className="owner_details">
        <h6 style={{ fontSize: "18px" }}>SHOP OWNER</h6>
        <img
          style={{ width: "30%", borderRadius: "50%", height: "100px" }}
          src={require("../uploads/"+owner[0].profileimage)}
        ></img>
        
         <h5>{owner[0].name}</h5>
      </div>
    </div> 
          )}
    </div>
          
    <div className="shop_items" style={{backgroundColor:"rgb(243, 234, 223)"}}>
      
      <div style={{backgroundColor:"rgb(243, 234, 223)"}}>
        <div style={{ width: "75%", margin: "3rem auto" }}>
          <div style={{ textAlign: "center" }}></div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "1rem auto",
            }}
          ></div>
          {products.length === 0 ? (
            <div
              style={{
                display: "flex",
                height: "300px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h2>No post yet...</h2>
            </div>
          ) : (
           
            <div className="container-fluid mx-1">
              <div className="row mt-5 mx-1">
                <div className="col-md-15">
                  <div className="row">{renderCards}</div>
                </div>
              </div>
            </div>
           
          )}

          <br />
          <br />
          
        </div>
      </div>
    </div>

   
    
  </div>
  )
}

export default ShopHomecustomer