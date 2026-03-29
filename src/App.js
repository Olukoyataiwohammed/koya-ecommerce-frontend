import React from 'react'
import Link from "./Link";
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Link />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
