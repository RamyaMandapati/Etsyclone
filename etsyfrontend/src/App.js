import Logo from "./Images/etsylogo.png";
import './App.css';
import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, renderMatches, Route, Routes} from "react-router-dom";
import Navigationbar from './components/Navigationbar';
import Home from "./components/Home";
import "./css/Navigationbar.css";
import ItemOverview from "./components/ItemOverview";
import Login from "./components/Login";
import Register from "./components/Register"
import SellOnEtsy from "./components/SellOnEtsy";
import ShopHome from "./components/ShopHome";
import EditProduct from "./components/EditProduct";
import EditImage from "./components/EditImage";
import EditShopImage from "./components/EditShopImage";
//import SearchIcon from "@material-ui/icons/Search";
import { Nav, Tab, Col, Row } from 'react-bootstrap';
import { useSelector } from "react-redux";
import SearchResults from "./components/SearchResults"
import userSlice, { selectUser } from "./features/userSlice";
function App() {
  
 
    console.log("rendering");
    const user = useSelector(selectUser);
    return (
      
     <Router>
       
        <div>
          
           <Routes>
             
             <Route path="/" element={<Login/>}/>
             <Route path="/Login" element={<Login/>}/>
             <Route path="/Home" element={<Home/>}/>
             <Route path="/ItemOverview" element={<ItemOverview/>}/>
             <Route path="/ShopHome" element={<ShopHome/>}/>
             <Route path="/Register" element={<Register/>}/>
             <Route path="/SellOnEtsy" element={<SellOnEtsy/>}/>
             <Route path="/ShopHome/EditProduct/:id" element={<EditProduct/>}/>
             <Route path="/ShopHome/EditImage/:id" element={<EditImage/>}/>
             <Route path="/ShopHome/EditShopImage/:id" element={<EditShopImage/>}/>
             <Route path="/SearchResults" element={<SearchResults/>}/>
           </Routes>  
        </div>
    </Router>
    
  );

}

export default App;
