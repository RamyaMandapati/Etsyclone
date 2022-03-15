import React, {useEffect, useState} from "react";
import Logo from "../Images/etsylogo.png"
import "../css/Home.css";
import Product from "./Product";

import Navigationbar from "./Navigationbar";
import Axios  from 'axios';
import { Col, Card, Row} from 'antd'
const {Meta}=Card



function Home(){
   
    const [Products, setProducts]=useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState()
    const [SearchTerms, setSearchTerms] = useState("")

  
    useEffect(() => {
      const variables ={
        skip:Skip,
        limit:Limit,
      }
      getProducts(variables)
    },[])
    const getProducts=(variables) =>{
      Axios.post('http://localhost:5000/getProducts',variables)
      .then((response) =>{
        if(response.data.success){
          if (variables.loadMore) {
            setProducts([...Products, ...response.data.result])
            console.log(Products);
        } else {
            setProducts(response.data.result)
        }
        setPostSize(response.data.postSize)     
        }else{
          alert("failed to fetch products")
        }
      })
    }
   
    const renderCards = Products.map((product, index) => {
      
      return (<div className="col-md-4 mb-4">
                <div className="card">
                  <img
                    src={require("../uploads/" + product.image)}
                    className="card-img-top"
                    alt="..."
                  />
                <div className="card-body">
                  <h5 className="card-title">{product.productname}</h5>
                    <p>Price: ${product.price}</p>
                    </div>
            </div>
      </div>
         )
  })
  const onLoadMore = () => {
    let skip = Skip + Limit;

    const variables = {
        skip: skip,
        limit: Limit,
        loadMore: true,
       
        searchTerm: SearchTerms
    }
    getProducts(variables)
    setSkip(skip)
  }
    const updateSearchTerms = (newSearchTerm) => {

      const variables = {
          skip: 0,
          limit: Limit,
          
          searchTerm: newSearchTerm
      }

      setSkip(0)
      setSearchTerms(newSearchTerm)

      getProducts(variables)
  }
   
    return (
      <div>
        <Navigationbar/>
      <div style={{ width: '75%', margin: '3rem auto' }}>
            
                
            
            {Products.length === 0 ?
                <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>No post yet...</h2>
                </div> :
                <div className="container-fluid mx-1">
                <div className="row mt-5 mx-1">
                  <div className="col-md-15">
                    <div className="row">{renderCards}</div>
                  </div>
                </div>
              </div>
              } 
              <br /><br />
              {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={onLoadMore}>Load More</button>
                </div>
            }


      </div>
      </div>
    );
}

export default Home