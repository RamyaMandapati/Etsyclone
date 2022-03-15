
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

import userSlice, { selectUser, selectShop } from "../features/userSlice";
function ShopHome() {

  const navigate=useNavigate();
  const user = useSelector(selectUser);
  const shop= useSelector(selectShop);
  const user_id=user.id;
  const [products, setProducts] = useState([]);
  const [showProds, setShowProds] = useState(false);
  const [Skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(8);
  const [showProductsAddPage, setShowProductsAddPage] = useState(false);
  const [editProductPage, setEditProductPage] = useState(false);
  const [postSize, setPostSize] = useState();
  const [shopimage,setShopImage]=useState("");

  const addItems = () => {
    setShowProductsAddPage(true);
  };

  useEffect(() => {
    const variables = {
      skip: Skip,
      limit: limit,
    };
    viewItems(variables);
    Axios.get(`http://localhost:5000/updateshopImage/${user_id}`)
    .then((res)=>{
      if(res.data.success){
        console.log(res);
        if(res.data.result[0].shopImage){
          
          setShopImage(res.data.result[0].shopImage);
          console.log("shopimage  "+shopimage)
          
        }
        else{
          setShopImage(profilepicture);
        }
      }else{
        console.log("image retrieve failed");
      }
    })
  }, []);

  const onLoadMore = () => {

    let skip = Skip + limit;
    console.log(skip + " in load more");
    const variables = {
      skip: skip,
      limit: limit,
      loadMore: true,
    };
    viewItems(variables);
    setSkip(skip);
  };

  const viewItems = (variables) => {
    setShowProds(true);
    console.log("---------------in view Items-------------------");
    console.log(variables.skip + " in get all products");
    Axios.post(
      "http://localhost:5000/getAllProducts" ,
      variables
    ).then((response) => {
      console.log(response);
      if (response.data.success) {
        if (variables.loadMore) {
          setProducts([...products, ...response.data.result]);
          console.log(products);
        } else {
          setProducts(response.data.result);
        }
        setPostSize(response.data.postSize);
        console.log(response.data.postSize + "Postsize in getallProducts");
      } else {
        console.log("Failed in ");
      }
    });
  };
  
 

  const renderCards = products.map((product) => {
    return (
      <div className="col-md-4 mb-4">
        <div className="card">
          
             
              <img style={{width:"200px",height:"200px"}} src={require("../uploads/"+product.image)} alt="" />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p>Price: ${product.price}</p>
                <Link to={`EditProduct/${product.productid}`} className="btn btn-success btn-sm">edit product</Link>
                <Link to={`EditImage/${product.productid}`} className="btn btn-success btn-sm">edit image</Link>
            </div>
          </div>
        </div>

          
          
        
          
    );
  });

  return (
    <div>
      
      <Navigationbar/>
      <hr></hr>
      <div className="shophome_header">
        <div className="shop_details">
          <img
            className="shop_img"
            src={profilepicture} 
          ></img>
          <div className="shop_info">
            <h3 className="shop_name">{user.shopName}</h3>
            <p>0 sales </p>
            <div className="htmlForm-group">
            <Link to={`EditShopImage/${user_id}`} className="btn btn-success btn-sm">edit shop image</Link>
            
            
            </div>
          </div>
        </div>
        <div className="owner_details">
          <h6 style={{ fontSize: "18px" }}>SHOP OWNER</h6>
          <img
            style={{ width: "30%", borderRadius: "50%", height: "100px" }}
            //src={require("../uploads/"+shopimage[0].shopImage)}
          ></img>
          
          <h5>{user.name}</h5>
        </div>
      </div>
      <div className="shop_items">
        <div>
          <button
            style={{
              marginLeft: "7.5%",
              padding: "10px",
              width: "25%",
              backgroundColor: "gray",
              border: "none",
              color: "white",
            }}
            onClick={addItems}
          >
            Add More Items..!
          </button>
        </div>
        <div>
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
            {postSize >= limit && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button onClick={onLoadMore}>Load More</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showProductsAddPage && (
        <Popup setShowProductsAddPage={setShowProductsAddPage} />
      )}
      
    </div>
  );
}

export default ShopHome;