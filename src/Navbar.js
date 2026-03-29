import React from 'react'
import { useAuth } from './AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';


const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const {clearCart} = useCart();
    const navigate = useNavigate();

    const handleLogout = () =>{
        clearCart();
        logout(); // call the logout function from AuthContext
        navigate('/');
    };
  return (
    <nav>
        <Link to='/'>Home</Link>
        {isAuthenticated ? (
            <>
                <Link to="/store">Store</Link>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </>
        ) :(
            <>
                <Link to="/account">Account</Link>
                
            </>
        )}
    </nav>
  );
};

export default Navbar;