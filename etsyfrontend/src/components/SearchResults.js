import React from 'react'
import {
    getProducts,
    removeProductsState,
    updateProducts,
  } from "../features/productSlice";
  import { selectUser } from "../features/userSlice";
  
  import { Link, Navigate } from "react-router-dom";
  import Navigationbar from "./Navigationbar";
  import { useSelector, useDispatch } from "react-redux";
  import { useState } from 'react';
import { borderRight } from '@mui/system';

function SearchResults() {
  
    const user = useSelector(selectUser);

    const product = useSelector(getProducts);
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);
  const [filterByValue, setFilterByValue] = useState(false);
  const [checked, setChecked] = useState(false);

  let filteredProducts = null;
  const filterByPrice = () => {
    if (minPrice !== 0 && maxPrice !== 100) {
      setFilterByValue(true);
      filteredProducts = product.filter((prod) => {
        return Number(prod.price) > minPrice && Number(prod.price) < maxPrice;
      });
      // product = filteredProducts();
      dispatch(updateProducts(filteredProducts));
      console.log(filteredProducts);
    }
  };

  let searchPage = null;
  if (sortBy === "itemPrice") {
    product.sort(function(a, b) {
      return Number(a.price) - Number(b.price);
    });
  } else if (sortBy === "itemCount") {
    product.sort(function(a, b) {
      return Number(a.count) - Number(b.count);
    });
  }

  // console.log(product);
if(checked==false){
  if (user && product !== null ) {

    
    searchPage = product.map((pro) => {
        
      return (
        <div className="col-md-4 mb-4" style={{marginTop:"20px"}}>
          <div className="card">
            <Link to={`/ItemOverview/${pro.productid}`}><img
              src={require("../uploads/" + pro.image)}
              className="card-img-top"
              alt="..."
            /></Link>
            <div className="card-body">
              <h5 className="card-title">{pro.productname}</h5>
              <p>Price: ${pro.price}</p>
              {/* <p>{pro.itemCount}</p> */}
              
            </div>
          </div>
        </div>
      );
    });
  } else {
    dispatch(removeProductsState());
    searchPage = (
      <div>
        <h4> No Items</h4>
      </div>
    );
  }
}else{
    if (user && product !== null ) {

    
        searchPage = product.map((pro) => {
        if(pro.count>0){ 
          return (
            <div className="col-md-4 mb-4" style={{marginTop:"20px"}}>
              <div className="card" >
                <img
                  src={require("../uploads/" + pro.image)}
                  className="card-img-top"
                  alt="..."
                />
                <div className="card-body">
                  <h5 className="card-title">{pro.productname}</h5>
                  <p>Price: ${pro.price}</p>
                  {/* <p>{pro.itemCount}</p> */}
                  
                </div>
              </div>
            </div>
          );}
        });
      } else {
        dispatch(removeProductsState());
        searchPage = (
          <div>
            <h4> No Items</h4>
          </div>
        );
      }

}

//  let redirectVar = null;
//   if (!cookie.load("user")) {
//     redirectVar = <Navigate to="/Home" />;
//   }
  return (
    <>
      {/* {redirectVar} */}
      <Navigationbar/>
      
      <hr></hr>

      <div
        style={{
          width: "20%",
          position: "relative",
          top: "0",
          left: "78%",
        }}
      >
        <div className="card-body" style={{marginTop:"20px"}}>
          <form id="price-range-form">
            <label htmlFor="min-price" className="form-label">
              Min price:
            </label>
            <span id="min-price-txt">${minPrice}</span>
            <input
              type="range"
              className="form-range"
              min="0"
              max="99"
              id="min-price"
              step="1"
              defaultValue="0"
              onChange={(event) => {
                setMinPrice(event.target.value);
              }}
            />
            <label htmlFor="max-price" className="form-label">
              Max price:
            </label>
            <span id="max-price-txt">${maxPrice}</span>
            <input
              type="range"
              className="form-range"
              min="1"
              max="100"
              id="max-price"
              step="1"
              defaultValue="100"
              onChange={(event) => {
                setMaxPrice(event.target.value);
              }}
            />
            <button onClick={filterByPrice}>Filter</button>
          </form>
        </div>
      </div>

      <input
        type="checkbox"
        
        id="count"
        name="count"
        value="count"
        style={{marginLeft:"20px",marginRight:"10px"}}
        onChange={(e)=>setChecked(e.target.checked)}
      />
      <label htmlor="count">Out of stock</label>
      <br></br>

      <div style={{ marginLeft: "80%" }}>
        Sort by: &nbsp;
        <select
          onChange={(event) => {
            setSortBy(event.target.value);
          }}
          style={{
            width: "%",
            height: "40px",
            border: "1px solid black",
            borderRadius: "4px",
            border: "none",
          }}
        >
          <option value="itemPrice">Relavency</option>
          <option value="itemPrice">Price</option>
          <option value="itemCount">Quantity</option>
          <option value="salesCount">Sales Count</option>
        </select>
      </div>

      <div className="container-fluid mx-1">
        <div className="row mt-5 mx-1" style={{marginTop:"20px",backgroundColor:"rgb(243, 234, 223)"}}>
          <div className="col-md-15">
            <div className="row">{searchPage}</div>
          </div>
        </div>
      </div>
    </>
  );

}

export default SearchResults