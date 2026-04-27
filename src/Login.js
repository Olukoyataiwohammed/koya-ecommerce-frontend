import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';



const Login = (props) => {
    const {onPressed} = props;  
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username,setUserName]= useState('');
    const [password,setPassWord] = useState('');
    const [error,setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
            setError(data.detail || "Invalid username or password");
            return;
            }

            login(data.access);
            navigate("/store");

        } catch (error) {
            setError("Network error. Please try again.");
        }
        };

    return (
    <div className="loginDetails">
      <form className='formLogin  '  onSubmit={handleSubmit}>
        <div className="userName">
            <label className="labelOne mt-2">
                Username:
                <input className="inpt" type='text' name='username' value={username} onChange={(event)=>setUserName(event.target.value)}  required/>
            </label>
        </div>
        <div className="passWord">
            <label className="labelOne mt-2">
                Password:
                <input className="inp ml-2" type='password' value={password} onChange={(event)=>setPassWord(event.target.value)} name='password'  required/>
            </label>
        </div>
        <button className="w-50" type='submit'>Log In </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <div className='display'>
        <p onClick={onPressed}>Sign Up</p>
        <p>Forgot Password</p>
      </div>
    </div>
  )
    
  
}



export default Login;