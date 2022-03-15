import React, { useState } from 'react'
import "../css/Product.css";
import StarRatings from 'react-star-ratings';
import { BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import ItemOverview from './ItemOverview';

function Product({id,name,price,ratings,image}) {
    
  return (
    <div className='product'>
      <div className="product__info">
        <p>{name}</p>
        <p className='product__'>
            <small>$</small>
            <strong>{price}</strong>
        </p>
        <div className='product_rating'>
        {
            <StarRatings
             rating={ratings}
             starDimension="15px"
             starSpacing='1px'
             />
        }
        </div>
      
      </div>
      
        <Link to="/ItemOverview">
            <img src={image} className="product_image" alt=""/>
        </Link>

    </div>
  );
}

export default Product