import React, { useState } from 'react'

const SignUp = (props) => {
    const {onSubmitSuccess} = props;
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassWord] = useState('');
    const [message,setMessage] = useState('');



    const handleSubmitSuccess = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("https://azeezolabode.pythonanywhere.com/auth/signup/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
            setMessage("Signup successful!");

            setUserName("");
            setEmail("");
            setPassWord("");

            
            onSubmitSuccess();

            } else {
            setMessage(`Signup failed: ${JSON.stringify(data)}`);
            }

        } catch (error) {
            setMessage(`Error during signup: ${error.message}`);
        }
    };



   





  return (
    <div className="loginDetails">
        <form className="formLogin" onSubmit={handleSubmitSuccess}>
        
        
        

        <div className='firstDiv'>
            <label>
                userName:
                <input type='text' className="userName inpt" value={username} onChange={(e)=> setUserName(e.target.value)} name='username' required/>
            </label>
        </div>
        
        <div className='firstDiv'>
            <label>
                Email:
                <input type='email' className="email inps" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder='@gmail.com' name='email' required/>
            </label>
        </div>
        
        
        <div className='firstDiv'>
            <label>
                Password:
                <input type='password' className="inpt" value={password} onChange={(e)=> setPassWord(e.target.value)} name='password' required/>
            </label>
        </div>
        
        <button type='submit' className="w-50">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default SignUp;



