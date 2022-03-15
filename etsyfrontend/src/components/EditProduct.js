import React,{useEffect, useState} from 'react'
import Axios from 'axios';
import "../index.css"
import axios from 'axios';
import {Link, useParams} from 'react-router-dom'
function EditProduct(props) {
  const [products, setProducts] = useState(""); 
  const [itemName, setItemName] = useState("");
 
  const [itemPrice, setItemPrice] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemCount, setItemCount] = useState(0);
  
  const {id}=useParams();
  const product_id=Number(id);
  useEffect(() => {
     
     console.log("Product id"+product_id);
     Axios.get(`http://localhost:5000/editProduct/${product_id}`)
     .then(response =>{
       if(response.data.success){
         console.log(response.data.result[0])
        setProducts(response.data.result[0])
        
       }

     }).catch(err => console.log(err));
  },[product_id])

  const editItem = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    formData.append("itemName", itemName);
    formData.append("itemDescription", itemDescription);
    formData.append("itemPrice", itemPrice);
    formData.append("itemCount", itemCount);
    formData.append("itemCategory", itemCategory);
    
    
    Axios.post(`http://localhost:5000/editProduct/${product_id}`,formData ,{
      headers: { "content-Type": "multipart/form-data" },
    }).then((response) => {
      console.warn(response);
      if (response.data.message === "success") {
        console.log("details updated successfully");
      }
    });


  };
  

  return (
    <div className="bg-modal">
      <div className="modal-content">
        
        <h2 className="addProd_title">Edit product</h2>
        <form
          className="items_form "
          method="post"
          encType="multipart/form-data"
        >
          <div className="htmlForm-group">
            <label htmlFor="item_name">Item Name</label>
            <br />
            <input
              type="text"
              className="item_name"
              id="item_name"
              value={products.productname}
              onChange={(event) => {
                setItemName(event.target.value);
              }}
              required
            />
          </div>
 
          <div className="htmlForm-group">
            <label htmlFor="category">Category</label>
            <br />
            <select
              onChange={(event) => {
                setItemCategory(event.target.value);
              }}
              style={{
                width: "90%",
                height: "40px",
                border: "1px solid black",
                borderRadius: "4px",
              }}
            >
              <option value="jewellery">Jewellery</option>
              <option value="clothing">Clothing</option>
              <option value="entertainment">Entertainment</option>
              <option value="homeDecor">Home Decor</option>
              <option value="others">Others</option>
            </select>
          </div>

         
          <div className="htmlForm-group">
            <label htmlFor="item_price">
              Item Price <sub>In dollars</sub>
            </label>
            <br />
            <input
              type="number"
              className="item_price"
              id="item_price"
              value={products.price}
              min="1"
              onChange={(event) => {
                setItemPrice(event.target.value);
              }}
              
            />
          </div>

          <div className="htmlForm-group">
            <label htmlFor="item_des">Item Description</label>
            <br />
            <input
              type="text"
              className="item_des"
              id="item_des"
              value={products.description}
              onChange={(event) => {
                setItemDescription(event.target.value);
              }}
              
            />
          </div>

          <div className="htmlForm-group">
            <label htmlFor="item_count">Item Count</label>
            <br />
            <input
              type="number"
              className="item_count"
              id="item_count"
              value={products.count}
              min="1"
              onChange={(event) => {
                setItemCount(event.target.value);
              }}
              
            />
          </div>
          <div>
            <button
              style={{
                marginTop: "5%",
                width: "90%",
                borderRadius: "4px",
                padding: "5px",
                backgroundColor: "gray",
                border: "none",
                color: "white",
              }}
              onClick={editItem}
            >
              Edit Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




export default EditProduct