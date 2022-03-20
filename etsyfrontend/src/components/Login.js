import React, { useEffect, useState } from 'react';
import "../css/Login.css";
import Register from "./Register"
import Home from "./Home"
import { Link } from "react-router-dom";
import Axios  from 'axios';
import { useStateValue } from '../StateProvider';
import { red } from '@material-ui/core/colors';
import {useNavigate} from 'react-router'
import { useDispatch } from "react-redux";
import { login, activeUser, activeShop } from "../features/userSlice";

function Login() {
    let navigate=useNavigate();
    const [emailid,setEmailid] = useState(" ");
    const [password,setPassword] = useState(" ");
    const [loginStatus,setLoginStatus] = useState(" ");
    const dispatch=useDispatch();
    Axios.defaults.withCredentials=true;
    const login_api=()=>{
        Axios.post('http://localhost:5000/login',{
            emailid:emailid,
            password: password
        }).then((response)=>{
            
            
            console.log(response);
            if(response.data.message){
                setLoginStatus(response.data.message)
                navigate('/Login')
            }else{
                dispatch(
                    login({
                      id: response.data.result[0].id,
                      email: response.data.result[0].emailid,
                      name: response.data.result[0].name,
                      shopName: response.data.result[0].shopname,
                       gender: response.data.result[0].gender,
                       country: response.data.result[0].country,
                       dob:response.data.result[0].dob,
                       about:response.data.result[0].about,
                        shopImage:response.data.result[0].shopImage,
                        profilepicture:response.data.result[0].profileimage,
                        phone:response.data.result[0].phone,
                        address:response.data.result[0].address,
                      loggedIn: true,
                    })
                  );
                
                localStorage.setItem('token',response.data.token)
                navigate('/Home')
            }
        })
        .catch((error)=>{
            console.log(error)
        });
    };
    const handleSubmit=(e)=>{
        e.preventDefault();
    }
   
  return (
    <div className='login'>
        <div className='login_container'>
        
        <h1 className='signin_header'>Sign in</h1>
        <span style={{color : red}}>{loginStatus}</span>
        <form onSubmit={handleSubmit}>
            <h5 className='email_label'>E-mail</h5>
            <input className="email_text" type="text" onChange={(e) =>
             { setEmailid(e.target.value)
            }}/>
            <h5 className='password_label'>Password</h5>
            <input className="password_text" type="password" onChange={(e) =>
             { setPassword(e.target.value)
            }}></input>
            
            <div className='button'>
           
           
            <button type="submit" className='signin_button' onClick={login_api}>Sign in</button>
            
            <p className='or'>or</p>
            <Link to="/Register">
                <button type="submit" className='register_button' >Register</button>
            </Link>
            </div>
        </form>
        
        </div>
        
    </div>
  )
}

export default Login