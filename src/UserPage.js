import React, { useEffect, useState } from "react";
import UserTable from "./UsersTable";
import { getCookie } from "./Cookie";
import makeRequest from "./Api";

const UserPage = () => {
  const userId = getCookie("user_forum");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId) {
          const user = await makeRequest("GET", `/users/${userId}`);
          setIsAdmin(user.user.isAdmin || false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div>
      <h2>User Page</h2>
      {isAdmin ? (
        <UserTable />
      ) : (
        <p>You do not have permission to view this page.</p>
      )}
    </div>
  );
};

export default UserPage;
