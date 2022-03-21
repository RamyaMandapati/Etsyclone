import React from 'react'
import profilepicture from "../uploads/profilepicture.png"
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser} from '../features/userSlice';
import { getCartItems ,createFinalCart,getFinalCart,removeCartItem} from '../features/cartItemsSlice';
import { useState,useEffect } from 'react';
import Axios from 'axios';
import Navigationbar from './Navigationbar';
import { Link } from 'react-router-dom';
import "../css/Cart.css"
import { useDispatch } from 'react-redux';

function Carts() {
    const navigate=useNavigate();
    const user=useSelector(selectUser);
    const products=useSelector(getCartItems);
    const userid=user.id;
    const [quantity,setQuantity]=useState(0)
    const dispatch=useDispatch();
    const finalCartProducts = useSelector(getCartItems);
   
    //const [products, setProducts] = useState([]);
    useEffect(() => {
    getCartProducts();
   
    
    
  }, []);
  const getCartProducts=()=>{
    Axios.get(`http://3.19.143.233:5000/getFinalCartProducts/${userid}` ).
    then((response) => {
    console.log(response);
    if (response.data.success) {
    
        //setProducts([...products, ...response.data.result]);
        console.log(products);
      } 
     
     
     else {
      console.log("Failed in ");
    }
  });
  }
  const getQtyFromCart = (productid) => {
    
    Axios.get(`http://3.19.143.233:3000/getQty/${userid}/${productid}`).then(
      (response) => {
        
        if (response.data.success) {
          console.log(response);
          var qty= response.data.result[0].quantity;
         return qty;
        } else {
          console.log("Failed in ");
        }
      }
    );
  };

  const qtyChangeHandler = (productcart, quantityupdate) => {
    console.log(productcart)
    dispatch(
      createFinalCart({
        itemId: productcart.itemId,
        itemName: productcart.itemName,
        itemDescription: productcart.itemDescription,
        itemImage: productcart.itemImage,
        itemPrice: productcart.itemPrice,
        itemCount: productcart.itemCount,
        // itemId: item.itemId,
        qty: Number(quantityupdate),
        subtotal:Number(productcart.itemPrice)*Number(quantityupdate)
      })
     
    );
    Axios.put("http://3.19.143.233:3000/updateCartQuantity/" + user.id, {
      itemId: productcart.itemId,
      qty: quantityupdate,
    }).then((response) => {
      if (response.data.success === true) {
        console.log("Cart quantity updated");
      }
    });
    window.location.reload(true);
  };
  const removeHandler=(id)=>{
    dispatch(removeCartItem(id));
    
  }
  
 

  const renderCards = products.map((product) => {
    
 
      
    return (

        <div className="cartitem">
            
        <div className="cartitem__image">
          
             
              <img style={{width:"200px",height:"158px"}} src={require("../uploads/"+product.itemImage)} alt="" />
            </div>
      <Link to={`/ItemOverview/${product.itemId}`} className="cartItem__name">
        <p>{product.itemName}</p>
      </Link>
      <p className="cartitem__price">${product.itemPrice}</p>
      
      <select
        defaultValue={product.qty}

        onChange={(e) => qtyChangeHandler(product, e.target.value)}
        className="cartItem__select"
      >
        {[...Array(Number(product.itemCount)).keys()].map((x) => (
          <option key={x + 1} value={x + 1}>
            {x + 1}
          </option>
        ))}
      </select>
      <DeleteIcon
        
        onClick={() => removeHandler(product.itemId)}
      >
        
      </DeleteIcon>
    </div>
  );
  });
  const OrderHandler=()=>{
    products.map((product) =>{
      Axios.post(`http://3.19.143.233:5000/editCount/${product.itemId}`,{quantity:product.qty})
      .then((response)=>{
        console.log(response);
      }).catch((err)=>{
        console.log(err);
      })
    })
    products.map((product)=>{
      Axios.post(`http://3.19.143.233:5000/updateOrders/${userid}`,{subtotal:getCartSubTotal()})
      .then((response)=>{
        console.log(response);

      })
    });
    navigate("/Orders")
  }
  const getCartSubTotal=()=>{
    

    
    return finalCartProducts
    .reduce((price, item) => price + item.subtotal, 0)
    .toFixed(2);
  }

   
  return (
    <div>
      
      <Navigationbar/>
      <hr></hr>
      
        <h2>Shopping Cart</h2>
       
     
        <div style={{backgroundColor:"rgb(243, 234, 223)"}}>
          <div style={{ width: "50%", margin: "3rem auto" }}>
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
             
              <div className="container-fluid mx-1" >
                <div className="row mt-5 mx-1">
                  <div className="col-md-15">
                    <div style={{float:'left',marginLeft:"-10px"}}>{renderCards}</div>
                  </div>
                   <div>
                     <p>Total : {getCartSubTotal()}</p>
                   </div>
                   <button style={{width:"200px",borderRadius:"20px",color:"white",backgroundColor:"black"}} onClick={OrderHandler}>Proceed to checkout</button>
                </div>
              </div>
             
            )}

            <br />
            <br />
            
         </div>
        </div>
    </div>
  );
}
export default Carts