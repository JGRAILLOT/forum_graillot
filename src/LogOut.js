// LogoutButton.js
import React from "react";
import { deleteCookie } from "./Cookie";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    deleteCookie("user_forum");
    navigate("/");
    window.location.reload();
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
