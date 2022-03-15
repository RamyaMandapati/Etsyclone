import React,{Component, useState} from 'react'
import "../css/ItemOverview.css";
import Product from "./Product";
import {Row,Col} from "react-bootstrap";
import { useStateValue } from '../StateProvider';
import { render } from 'react-dom';
import { BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import StarRatings from 'react-star-ratings';
function ItemOverview({id,name,price,ratings,image}){
    const [{},dispatch] = useStateValue();
    const addToCart=()=>{
        dispatchEvent({
            type: 'ADD_TO_CART',
            item:{
                id : id,
                name:name,
                image:image,
                price:price,
                ratings:ratings,
            },

        });
    }
    
    return(

       
        <div>
            <Product/>
          <button type="submit" className='addtocart_button' onClick={addToCart}> Add to cart </button>
        </div>
     
    );
    }


export default ItemOverview