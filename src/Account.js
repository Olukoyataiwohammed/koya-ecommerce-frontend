import React, { useState } from 'react'
import Login from './Login'
import SignUp from './SignUp'






const Account = () => {
  const [showSignUp,setShowSignUp] = useState(false);

  const handleSubmit =()=>{
    setShowSignUp(false);
  }
  
  return (
    <div className='mainApp text-secondary
     ' >

      <div className='account_restaurant_logo'>
        <h1 style={{color: "green",marginTop: "10px"}}><b><i>KO<span style={{color:"red"}}>Y</span>A_<span style={{color:"red"}}>STORES</span></i></b></h1>
        <img src="#" alt='phs' style={{width: '50px',height: "auto",border: "double thin white",borderRadius: "50px" }}/>
      </div>
      
      
      
      {showSignUp ? (<SignUp onSubmitSuccess={handleSubmit} /> )
      : ( <Login onPressed={()=>setShowSignUp(true)}  />)
    }
   
    </div>
  
  
  )
}

export default Account;