import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Header from "./Header";
import Home from "./Home";
import Cart from "./Cart";
import SearchBox from "./SearchBox";
import Animination from "./Animination";
import Nav from "./Nav";
import Account from "./Account";
import Login from "./Login";
import SignUp from "./SignUp";
import Support from "./Support";
import Store from "./Store";
import ProductDetails from "./ProductDetails";
import CheckoutPage from "./CheckoutPage";
import OrderOnline from "./OrderOnline";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WishList from "./WishList";


const App = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Fixed / Sticky UI (Header, Nav, Animination) */}
        <div className="fixed-ui">
          <Animination className="animination" />
          <Header className="header" />
          <Nav className="nav" />
        </div>

        {/* Page content */}
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/searchBox" element={<SearchBox />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/support" element={<Support />} />
            <Route path="/store" element={<Store />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order" element={<OrderOnline />} />
            <Route path="/order/:id" element={<OrderOnline />} />
            <Route path="/store/:slug" element={<Store />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/wishlist" element={<WishList />} />
          </Routes>
        </main>
        <Navbar/>
        {/* Footer always at bottom */}
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;