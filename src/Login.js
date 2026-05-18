import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Login = ({ onPressed }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [password, setPassWord] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://azeezolabode.pythonanywhere.com/auth/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Invalid username or password");
        setLoading(false);
        return;
      }

      
      if (!data.access || !data.refresh) {
        setError("Invalid server response (missing tokens)");
        setLoading(false);
        return;
      }

      login({
        access: data.access,
        refresh: data.refresh,
      });

      navigate("/store");
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginDetails">
      <form className="formLogin" onSubmit={handleSubmit}>
        <div className="userName">
          <label className="labelOne mt-2">
            Username:
            <input
              className="inpt"
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="passWord">
          <label className="labelOne mt-2">
            Password:
            <input
              className="inp ml-2"
              type="password"
              value={password}
              onChange={(e) => setPassWord(e.target.value)}
              required
            />
          </label>
        </div>

        <button className="w-50" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <div className="display">
        <p className="displays" onClick={onPressed}>Sign Up</p>
        <p className="displays">Forgot Password</p>
      </div>
    </div>
  );
};

export default Login;