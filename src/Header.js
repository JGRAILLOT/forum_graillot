// Header.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCookie } from "./Cookie";
import { makeRequest } from "./Api";
import LogoutButton from "./LogOut";

const Header = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const userId = getCookie("user_forum");

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        if (userId) {
          const user = await makeRequest("GET", `/users/${userId}`);
          const isAdmin = user.user.isAdmin;
          setIsAdmin(isAdmin);
        }
      } catch (error) {
        console.error("Error fetching admin status:", error.message);
      }
    };

    fetchAdminStatus();
  }, [userId]);

  const renderAuthOptions = () => {
    if (!userId) {
      return (
        <>
          <p id="header">
            <Link to="/signup">Signup</Link>
          </p>
          <p id="header">
            <Link to="/login">Login</Link>
          </p>
        </>
      );
    } else {
      return (
        <>
          <p id="header">
            <Link to="/create">Create Page</Link>
          </p>
          <LogoutButton />
          <p id="header">
            <Link to="/profilepage">Profile Page</Link>
          </p>
          {isAdmin && (
            <p id="header">
              <Link to="/userTable">User Table</Link>
            </p>
          )}
        </>
      );
    }
  };

  return (
    <div>
      <h1>
        <Link to="/">FORUM</Link>
      </h1>
      <nav>
        <Link to="/search">Search Page</Link>
        {renderAuthOptions()}
      </nav>
    </div>
  );
};

export default Header;
