
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStateValue } from '../StateProvider'
import Navigationbar from './Navigationbar'
import ShopHome from './ShopHome'

function ShopName() {
    let navigate=useNavigate();
    const [shopname,setshopname] =useState("");
    const [shopNameStatus,setShopNameStatus]=useState("")
    
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
            
            
            Axios.post('http://localhost:5000/addShop',{shopname})
            .then((response)=>{
                console.log(response);
                return(
                    <ShopHome shopname={shopname}/>
                    ) 
                navigate("/ShopHome")
            }).catch((err)=>{
                console.log(err);
            });
            
            
            
        }
    }
  return (
    <div>
        <Navigationbar/>
        <div>
            <h1>Name your shop</h1>
            <h3>Choose a memorable name that reflects your style</h3>
            <div>
                <input type="text" className="checkshopname" onChange={(e) =>
                { setshopname(e.target.value)}}/>
                <span>{shopNameStatus}</span>
                <button type="submit" className="checkavailability" onClick={handleShopName}>CheckAvailability</button>
                <button type="submit" className="redirect" onClick={redirectHandler}>Confirm</button>
            </div>
        </div>
    </div>
  )
}

export default ShopName