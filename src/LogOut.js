// LogoutButton.js
import React from "react";
import { deleteCookie } from "./Cookie";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    deleteCookie("user_forum");

    navigate("/");

    console.log("Logout successful!");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
