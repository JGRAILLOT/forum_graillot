// LoginForm.js
import React, { useState } from "react";
import makeRequest from "./Api";
import { setCookie } from "./Cookie";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your authentication endpoint
      const response = await makeRequest("POST", "/login", {
        username,
        password,
      });

      // Assuming your backend returns a user object on successful login
      const user = response.user;

      // Check if the user is disabled
      if (user.disabled) {
        console.log("User is disabled.");
        // You may want to display an error message or perform other actions
        return;
      }

      // Save user information in a cookie or state if needed
      setCookie("user_forum", user._id);

      // Call the onLogin callback provided by the parent component, if needed
      onLogin(user);
    } catch (error) {
      console.error("Error during login:", error.message);
      // Handle login error (e.g., display an error message)
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
