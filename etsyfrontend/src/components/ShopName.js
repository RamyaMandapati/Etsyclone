
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStateValue } from '../StateProvider'
import Navigationbar from './Navigationbar'
import ShopHome from './ShopHome'
import  Axios  from 'axios'
import { useDispatch } from "react-redux";
import {activeShop,selectUser, updateUser} from "../features/userSlice"
import { useSelector } from 'react-redux'

function ShopName() {
    let navigate=useNavigate();
    const dispatch=useDispatch();
    const user=useSelector(selectUser);
    const [shopname,setshopname] =useState("");
    const [shopNameStatus,setShopNameStatus]=useState("")
    const [message,setMessage]=useState("")
    
    const handleShopName = ()=>{
        console.log(shopname)
        Axios.post('http://localhost:5000/getShopName',{shopname})
        .then((response) =>
        {
            console.log(response.data.message);
            setShopNameStatus(response.data.message);
        })
      
        

    }
    const redirectHandler=()=>{
        
        if(shopNameStatus=="Available"){
            
            
            Axios.post(`http://localhost:5000/addShop/${user.id}`,{shopname})
            .then((response)=>{
                console.log(response);
                dispatch(updateUser({ShopName:shopname}));
                dispatch(activeShop({shopName:shopname}));
                
                navigate("/ShopHome")
            }).catch((err)=>{
                console.log(err);
            });
            
            
            
        }
        else{
            setMessage("Try another shop name")
        }
    }
  return (
    <div>
        <Navigationbar/>
        <div style={{textAlign:"center",marginTop:"50px"}}>
            <h1 style={{color:"rgb(238, 101, 43)"}}>Name your shop</h1>
            <h3 style={{color:"rgb(238, 101, 43)"}}>Choose a memorable name that reflects your style</h3>
            <div>
                <input type="text" className="checkshopname" 
                style={{width:"400px",
                        height:"40px",
                        marginTop:"30px",
                        borderRadius:"20px"
                        }}
                onChange={(e) =>
                { setshopname(e.target.value)}}/>
                <span style={{color:"rgb(238, 101, 43)"}}>{shopNameStatus}</span>
                <button type="submit" className="checkavailability" 
                style={{color:"rgb(238, 101, 43)", borderRadius:"10px",marginLeft:"20px"}}
                onClick={handleShopName}>CheckAvailability</button>
                <br/>
                <button type="submit" className="redirect" 
                style={{color:"rgb(238, 101, 43)", borderRadius:"10px",marginTop:"20px", width:"150px"}}
                onClick={redirectHandler}>Confirm</button>
                <p>{message}</p>
            </div>
        </div>
    </div>
  )
}

export default ShopName