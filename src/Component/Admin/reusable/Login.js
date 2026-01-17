import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/Auth/AuthContext";
import axios from "axios"

const LoginForm = () => {
  const { login, token } = useAuth();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/Admin", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dummy credentials (replace with real auth API)
    // const validUser = "Admin";
    // const validPass = "Admin789";

    if (!userName || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {

      const body = new URLSearchParams();
      body.append("username", userName);
      body.append("password", password);

      const response = await axios.post(
        `${process.env.REACT_APP_NETWORK}/token`,
        body.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const data = response.data;
      // console.log(userName, "login response data");
      localStorage.setItem("user", userName);
      // Expecting backend to return access_token, refresh_token, and permissions
      login(data.access_token, data.refresh_token, data.permissions || [], userName) ;
      // Store login info
      // localStorage.setItem("authToken", "dummy_token_here");
      // localStorage.setItem("userName", userName);
      // localStorage.setItem("lastActive", Date.now().toString());

      // Redirect to admin dashboard
      navigate("/admin");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F3] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md font-poppins">
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-[#F48F0F] text-white py-2 rounded-md hover:bg-orange-500 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
