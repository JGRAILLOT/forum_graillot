// UserTable.js

import React, { useState, useEffect } from "react";
import { makeRequest } from "./Api.js";

const UserTable = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await makeRequest("get", "/users");
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handlePromote = async (userId) => {
    try {
      await makeRequest("put", `/users/${userId}/promote`);
      window.location.reload();
    } catch (error) {
      console.error("Error promoting user:", error);
    }
  };

  const handleBan = async (userId) => {
    console.log("Attempting to ban user with id:", userId);
    try {
      await makeRequest("delete", `/users/${userId}`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const handleToggleDisable = async (userId) => {
    try {
      const user = await makeRequest("GET", `/users/${userId}`);
      const disable = user.user.disabled;
      await makeRequest("put", `/users/${userId}/disable`, !disable);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, disabled: !user.disabled } : user
        )
      );
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Admin</th>
          <th>Disable</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.isAdmin ? "Yes" : "No"}</td>
            <td>{user.disabled ? "Yes" : "No"}</td>
            <td>
              <button onClick={() => handleBan(user._id)}>Ban</button>
              <button onClick={() => handlePromote(user._id)}>Promote</button>
              <button onClick={() => handleToggleDisable(user._id)}>
                {user.disabled ? "Enable" : "Disable"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
