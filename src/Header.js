import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const [query, setQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const accountRef = useRef(null);
  const supportRef = useRef(null);

  const navigate = useNavigate();

  const NavDisplay = ({ isActive }) => ({
    borderBottom: isActive ? "solid 1px black" : "",
    textDecoration: "none",
    color: "white",
    marginTop: "5px",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/searchBox?q=${query}`);
  };

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
      if (supportRef.current && !supportRef.current.contains(e.target)) {
        setSupportOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="headers bg-purple">
      <nav
        id="header_row"
        className="container containers d-flex justify-content-around bg-dark border border-light p-3"
      >
        <NavLink style={NavDisplay} to="/">
          <i>KOYA</i>
        </NavLink>

        <form onSubmit={handleSearch} className="d-flex rounded mt-1">
          <input 
            
            className="searchBox p-1 rounded-pill"
            type="text"
            placeholder="🔎"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="roundeds  text-white">
            <i>Search</i>
           </button>
        </form>

        {/* 🔥 ACCOUNT DROPDOWN (REACT CONTROLLED) */}
        <div className="position-relative" ref={accountRef}>
          <button
            className="btn dropdown btn-secondary bg-dark"
            onClick={() => {
              setAccountOpen((v) => !v);
              setSupportOpen(false);
            }}
          >
            ACCOUNT
          </button>

          {accountOpen && (
            <ul className="dropdown-menu show bg-dark">
              <li>
                <NavLink
                  className="dropdown-item text-info"
                  to="account"
                  onClick={() => setAccountOpen(false)}
                >
                  LOGIN OR SIGN UP
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="dropdown-item text-info"
                  to="order"
                  onClick={() => setAccountOpen(false)}
                >
                  ORDER
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="dropdown-item text-info"
                  to="wishlist"
                  onClick={() => setAccountOpen(false)}
                >
                  WISHLIST
                </NavLink>
              </li>
            </ul>
          )}
        </div>

        {/* 🔥 SUPPORT DROPDOWN */}
        <div className="position-relative" ref={supportRef}>
          <button
            className="btn dropdown btn-secondary bg-dark"
            onClick={() => {
              setSupportOpen((v) => !v);
              setAccountOpen(false);
            }}
          >
            SUPPORT
          </button>

          {supportOpen && (
            <ul className="dropdown-menu show bg-dark">
              <li>
                <NavLink
                  className="dropdown-item text-info"
                  to="support"
                  onClick={() => setSupportOpen(false)}
                >
                  Support Center
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="dropdown-item text-info"
                  to="cancel_order"
                  onClick={() => setSupportOpen(false)}
                >
                  CANCEL ORDER
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="dropdown-item text-info"
                  to="order_tracking"
                  onClick={() => setSupportOpen(false)}
                >
                  TRACK ORDER
                </NavLink>
              </li>
            </ul>
          )}
        </div>

        <NavLink style={NavDisplay} to="/cart">
          🛒 CART
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;