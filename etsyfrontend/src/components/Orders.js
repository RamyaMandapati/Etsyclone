import React from 'react'
import profilepicture from "../uploads/profilepicture.png"
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import { getCartItems } from '../features/cartItemsSlice';
import { useState,useEffect } from 'react';
import Axios from 'axios';
import Navigationbar from './Navigationbar';
import { Link } from 'react-router-dom';
import "../css/Cart.css"

function Orders() {
    const navigate=useNavigate();
    const user=useSelector(selectUser);
    const userid=user.id;
    const orderedProducts=useSelector(getCartItems);
   
    //const [products, setProducts] = useState([]);
  //   useEffect(() => {
  //   getCartProducts();
   
    
    
  // }, []);
//   const getQtyFromCart = (productid) => {
//     Axios.get(`http://localhost:5000/getQty/${userid}/${productid}`).then(
//       (response) => {
        
//         if (response.data.success) {
//           setQuantity(response.data.result[0].quantity);
         
//         } else {
//           console.log("Failed in ");
//         }
//       }
//     );
//   };

    // const getCartProducts=()=>{
    //     Axios.get(`http://localhost:5000/getFinalCartProducts/${userid}` ).
    //     then((response) => {
    //     console.log(response);
    //     if (response.data.success) {
        
    //         setProducts([...products, ...response.data.result]);
    //         console.log(products);
    //       } 
         
         
    //      else {
    //       console.log("Failed in ");
    //     }
    //   });
    //   }
      const renderCards = orderedProducts.map((product) => {
      
        return (
    
            <div className="cartitem">
                
            <div className="cartitem__image">
              
                 
                  <img style={{width:"200px",height:"158px"}} src={require("../uploads/"+product.itemImage)} alt="" />
                </div>
          <Link to={`/ItemOverview/${product.itemId}`} className="cartItem__name">
            <p>{product.itemName}</p>
          </Link>
          <p className="cartitem__price">${product.itemPrice}</p>
          
          
          {/* <button
            className="cartItem__deleteBtn"
            onClick={() => removeHandler(item.product)}
          >
            <i className="fas fa-trash"></i>
          </button> */}
        </div>
      );
      });
    
       
      return (
        <div>
          
          <Navigationbar/>
          <hr></hr>
          
            <h2>Your Orders</h2>
           
         
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
                {orderedProducts.length === 0 ? (
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

export default Orders