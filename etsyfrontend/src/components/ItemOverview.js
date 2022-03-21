import React, {useLayoutEffect, useState} from "react";
import { Link, useParams } from 'react-router-dom';
import FavoriteTwoToneIcon  from '@material-ui/icons//FavoriteBorderOutlined';
import Navigationbar from './Navigationbar';
import Favorites from "./Favorites";
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { selectUser} from '../features/userSlice';
import "../App.css";
import { useDispatch } from "react-redux";
import { createCartItem } from "../features/cartItemsSlice";
import { getCartItems } from "../features/cartItemsSlice";

// import {
//   addProductToCart,
//   addQtyToCart,
//   getAllCartProducts,
//   getFinalCartProducts,
// } from "../features/cartSlice";
//import { updatecartProducts } from "../features/cartSlice";


import Axios from 'axios';
import ShopHomecustomer from "./ShopHomecustomer";

function ItemOverview(props) {
    const user=useSelector(selectUser);
    //const productView = useSelector(getAllCartProducts);
    const dispatch=useDispatch() 
    const userid=user.id;
    console.log(userid);
    const navigate=useNavigate();
    const {id}=useParams();
    const productid=Number(id);
    const [Products, setProducts]=useState("");
    const [quantity,setQuantity]=useState(1);
    
    useLayoutEffect(()=>{
        Axios.get(`http://3.19.143.233:5000/getProducts/${productid}`)
      .then((response) =>{
        console.log(response);
        if(response.data.success){
         
            setProducts(response.data.result[0]);
            
        } 
        
          
        else{
          alert("failed to fetch products")
        }
    })
    },[])
    const handlefavclick=()=>{
        Axios.post(`http://3.19.143.233:5000/addFav/${productid}/${userid}`)
        .then((response)=>{
          if(response.data.success){
          console.log(response.data.success)
          }
          else{
            console.log("error")
          }

        }).catch((err)=>{
          console.log(err);
        })
        
    }
    const addToCartHandler = () => {
      console.log("add to cart handler");
  
      // cartItems.map((ele) => console.log(ele));
      // if (cartItems) {
      dispatch(
        createCartItem({
          itemId: Products.productid,
          itemName: Products.productname,
          itemDescription: Products.description,
          itemImage: Products.image,
          itemPrice: Products.price,
          itemCount: Products.count,
          
          qty: Number(quantity),
          subtotal:Number(Products.price)*Number(quantity)
        })
      );
      }
      const shopCustomerHandler=()=>{
        console.log("shopcustomerhandler");
        navigate(`/ShopHomecustomer/${Products.id}`)
      }
      
  
  return (
    <div>
        <Navigationbar/>
        <hr></hr>
        {Products.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  height: "300px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h2>Loading..</h2>
              </div>
            ) : (
             
              <div style={{height:"500px", width:"500px",borderRadius:"20px",margin:"40px",display:"row"}}>
                <img style={{width:"400px",height:"400px",marginLeft:"100px"}}  src={require("../uploads/"+Products.image)} alt="" />
                
                <span  className="fav_icons">
                <FavoriteTwoToneIcon  onClick={handlefavclick} style={{marginLeft:"20px"}}></FavoriteTwoToneIcon>
                </span>
                
                  <div style={{marginLeft:"50px",height:"400px",width:"400px",border:"1px"}}>
                  <label style={{color:"rgb(235 78 11)", marginLeft:"50px"}} onClick={shopCustomerHandler}>{Products.shopname}</label>
                    <br></br>
                    <span style={{marginLeft:"50px"}}>sales</span>
                    <h2 style={{marginLeft:"50px",width:"200px",marginTop:"50px"}}>{Products.description}</h2>
                    <h3 style={{marginLeft:"50px"}}>${Products.price}</h3>
                    <p style={{marginLeft:"50px"}}>quantity</p>
                    <select style={{marginLeft:"50px"}} onChange={(e)=>setQuantity(e.target.value)}>
                    { /*Array.from(Array(Products.count)).map((e,value) => <option key={value} value={value}>{value+1}</option>) */}
                    {Array.apply(1, {length: Products.count}).map((e,value) => <option key={value+1} value={value+1}>{value+1}</option>)}
                    </select><br></br>  
                    <button style={{width:"200px",borderRadius:"10px",marginLeft:"50px",marginTop:"10px",color:"white",backgroundColor:"black"}} onClick={addToCartHandler}>Add to cart</button>
                  </div>
                    

              </div>
             
            )}
          
       
       
      
    </div>
  )
}

export default ItemOverview