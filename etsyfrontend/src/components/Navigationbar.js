import React,{Component, useState} from 'react'
import Logo from "../Images/etsylogo.png";
import { BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import ReatDom  from 'react-dom';
import SearchIcon from "@material-ui/icons/Search";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import {Col, Row} from 'react-bootstrap';
import "../css/Navigationbar.css";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { useStateValue } from '../StateProvider';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {useNavigate} from 'react-router';
import { useDispatch } from "react-redux";
import { logout } from '../features/userSlice';
import Axios from 'axios';
import Login from './Login';
import "../App.css"
import { useSelector } from 'react-redux';
import {
  getProducts,
  productsList,
  updateProducts,
} from "../features/productSlice";

import { updateUser } from "../features/userSlice";
function Navigationbar() {
  let navigate=useNavigate();
  const dispatch=useDispatch();
  const prod=useSelector(getProducts);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [SearchTerms,setSearchTerms] = useState("");

  const handleSearch=(e) =>{
    e.preventDefault();
    // setSearchTerms(e.currentTarget.value)
    console.log(SearchTerms)
    if (SearchTerms !== "") {
      Axios.get("http://localhost:5000/getSearchItems/" + SearchTerms).then(
        (response) => {
          if (response.data.success === true) {
            console.log(response.data.result);
            console.log("Helllo.....................");
            console.log(prod);
            if (prod === null || prod.length === 0) {
              console.log(" products is null");
              dispatch(productsList(response.data.result));
            } else {
              dispatch(updateProducts(response.data.result));
            }
          }
           window.location.pathname = "/SearchResults";
        }
      );
    } else {
       window.location.pathname = "/";
    };
  }
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);}
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout=(e)=>{
    e.preventDefault();
    
    dispatch(logout());
    navigate('/Login')
  }
  
  return (
    <div>
        <nav className="header">
           <Link to="/Home">

           
              <img className="header_logo" src={Logo} alt="logo"/>
            </Link>
            
            <div  className='header-search'>
              <form className="search_form">
                <input
                type="text"
        // id="searchBar"
        className="searchBar"
        placeholder="Search for anything..."
        onChange={(event) => {
          setSearchTerms(event.target.value);
        }}
      ></input>

      {/* <span onClick={handleSearchResult}>
        <SearchIcon />
      </span> */}
      <button type="submit" onClick={handleSearch} className="searchBtn">
        <SearchIcon className="searchIcon" />
      </button>
    </form>
            </div>
            
            <Link to="/Favorites">
                <FavoriteBorderIcon className="fav_icon"></FavoriteBorderIcon>
              
            </Link>
            <div>
              <PermIdentityIcon
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}> 
          
              </PermIdentityIcon>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            >
              <MenuItem onClick="/Profile">Profile</MenuItem>
              <MenuItem onClick="/Orders">Orders</MenuItem>
              <Link to="/SellOnEtsy">
              <MenuItem >Sell on Etsy </MenuItem></Link>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>

            </Menu>
          </div>

            
            <Link to="/cart">
              <ShoppingCartIcon className="shopping_icon"></ShoppingCartIcon>
              
            </Link>

            


            

           
         
        </nav>
      </div>
   
  )
}


export default Navigationbar;