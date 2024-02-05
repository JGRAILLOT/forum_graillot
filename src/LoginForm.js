// LoginForm.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import makeRequest from "./Api";
import { setCookie, getCookie } from "./Cookie";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const userId = getCookie("user_forum");
    if (userId) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await makeRequest("POST", "/login", {
        username,
        password,
      });
      console.log(response.userId);
      const data = await makeRequest("GET", `/users/${response.userId}`);

      if (data.user.disabled) {
        console.log("User is disabled.");
        return;
      }
      setCookie("user_forum", response.userId);
      window.location.reload();
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
