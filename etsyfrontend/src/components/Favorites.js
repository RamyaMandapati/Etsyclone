import React from 'react'
import profilepicture from "../uploads/profilepicture.png"
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { useState,useEffect } from 'react';
import Axios from 'axios';
import Navigationbar from './Navigationbar';

function Favorites() {
    const navigate=useNavigate();
    const user=useSelector(selectUser);
    const userid=user.id;
    console.log(userid);
    const [products, setProducts] = useState([]);
    useEffect(() => {
    
    Axios.get(`http://localhost:5000/getFav/${userid}` ).
        then((response) => {
        console.log(response);
        if (response.data.success) {
        
            setProducts([...products, ...response.data.result]);
            console.log(products);
          } 
         
         
         else {
          console.log("Failed in ");
        }
      });
    
  }, []);


  
 

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

    const editProfileHandler=()=>{
        navigate("/Profile");

    }
  return (
    <div>
      
      <Navigationbar/>
      <hr></hr>
      
      <div style={{display:"flex"}}>
        <img
             style={{height:"150px",width:"150px"}}
              src={profilepicture} alt=""
          ></img>
          
            <h3 style={{margin:"10px"}}>{user.name}</h3>
            <ModeEditIcon style={{marginLeft:"3px",marginTop:"12px"}} onClick={editProfileHandler}></ModeEditIcon>
            
         
        </div>
        
        <h2 style={{color:"hsl(18, 85%, 55%)", marginTop:"20px"}}>Your Favorites</h2>
     
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

      
      
    
  )
}

export default Favorites