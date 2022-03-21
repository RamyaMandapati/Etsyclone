import React, { useState } from 'react';
import Axios from'axios';
import "../css/Login.css";
import { BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import { useStateValue } from '../StateProvider';
import {connect} from "react-redux"
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate=useNavigate();
    const[usernameReg, setUsernameReg] = useState(' ');
    const[passwordReg, setPasswordReg] = useState(' ');
    const[emailidReg, setEmailidReg] = useState(' ');
    Axios.defaults.withCredentials=true;
    const register=(e) =>{
        e.preventDefault();

        Axios.post('http://3.19.143.233:5000/register',{
            username:usernameReg,password:passwordReg,emailid:emailidReg
        }).then((response)=>{
            console.log(response);
            navigate("/Login")

        })
        .catch((error)=>{
            console.log(error)
        });
    };
  return (
    
        <div className='login'>
            <div className='login_container'>
            
            <h1 className='signin_header'>Register</h1>
            <form noValidate>
                <h5 className='name_label'>Name</h5>
                <input className='name_text' type="text" 
                onChange={(e)=>{setUsernameReg(e.target.value)}} required></input>
                <h5 className='email_label'>E-mail</h5>
                <input className="email_text" type="text"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                onChange={(e)=>{setEmailidReg(e.target.value)}} required></input>
                <h5 className='password_label'>Password</h5>
                <input className="password_text" type="password"
                onChange={(e)=>{setPasswordReg(e.target.value)}}
                required></input>
                <div className='button'>
                    <button type="submit" onClick={register} className='register_button'>Register</button>
                
                </div>
            </form>
            </div>
        </div>
      )
  
}

// const registerUser = (dispatch) => ({
//     Register: (isRegister) => dispatch(Register(isRegister)),
//   });
  
  export default Register;
  