// ProfilePage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import makeRequest from "./Api.js";
import { getCookie, deleteCookie } from "./Cookie.js";
import ImageViewer from "./Image.js";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [showChangeUsernameForm, setShowChangeUsernameForm] = useState(false);
  const [showChangeEmailForm, setShowChangeEmailForm] = useState(false);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [passwordForVerification, setPasswordForVerification] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = getCookie("user_forum");

        if (userId) {
          // Fetch user data
          const userDataResponse = await makeRequest("GET", `/users/${userId}`);

          // Update state with user data
          setUser(userDataResponse);

          // Fetch user image
          const imageResponse = await makeRequest(
            "GET",
            `/image/${userDataResponse.user.avatar}`
          );

          // Update state with user image
          setImage(imageResponse);
        }
      } catch (error) {
        console.error("Error fetching user data or image:", error);
      }
    };

    fetchData();
  }, []);

  const handleModifyAvatar = async () => {
    if (!newAvatar) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", newAvatar);

      const uploadImageResponse = await makeRequest("POST", "/image", formData);

      await makeRequest("PUT", `/users/${user.avatar}/avatar`, {
        avatar: uploadImageResponse._id,
      });

      await makeRequest("DELETE", `/image/${user.avatar}`);
    } catch (error) {
      console.error("Error modifying avatar:", error);

      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  const handleModifyPassword = () => {
    // Check if oldPassword is correct before modifying the password
    makeRequest("POST", `/users/${user._id}/checkPassword`, {
      password: oldPassword,
    })
      .then((response) => {
        const { isCorrect } = response;
        if (isCorrect) {
          // Password is correct, proceed with modification
          makeRequest("PUT", `/users/${user._id}/password`, {
            newPassword,
          });

          // Optionally, update the user state or UI here
          setShowChangePasswordForm(false);
        } else {
          console.error("Incorrect old password");
        }
      })
      .catch((error) => {
        console.error("Error checking old password:", error);
      });
  };

  const handleModifyUsername = () => {
    makeRequest("GET", `/users/username/${newUsername}`)
      .then((response) => {
        const { exists } = response;
        if (exists) {
          console.error("Username already exists");
        } else {
          makeRequest("PUT", `/users/${user._id}/username`, {
            newUsername,
          });
          setShowChangeUsernameForm(false);
        }
      })
      .catch((error) => {
        console.error("Error checking username:", error);
      });
  };

  const handleModifyEmail = () => {
    if (newEmail && newEmail !== user.email) {
      makeRequest("GET", `/users/email/${newEmail}`)
        .then((response) => {
          const { exists } = response;
          if (exists) {
            console.error("Email already exists");
          } else {
            makeRequest("PUT", `/users/${user._id}/email`, {
              newEmail,
            });
            setShowChangeEmailForm(false);
          }
        })
        .catch((error) => {
          console.error("Error checking email:", error);
        });
    } else {
      // Email is unchanged or empty
      setShowChangeEmailForm(false);
    }
  };

  const navigate = useNavigate();

  const handleDeleteUser = async () => {
    try {
      const response = await makeRequest(
        "POST",
        `/users/${user.id}/checkPassword`,
        {
          password: passwordForVerification,
        }
      );

      const { isCorrect } = response;

      if (isCorrect) {
        await makeRequest("DELETE", `/users/${user.id}`);
        deleteCookie("user_forum");
        navigate("/");
      } else {
        console.error("Incorrect password for account deletion");
      }

      setDeleteConfirmation(false);
    } catch (error) {
      console.error("Error during account deletion:", error);
    }
  };

  if (!user) {
    return <div>User Not Found</div>;
  }

  return (
    <div className="profile-page-container">
      <h2>Welcome, {user.username}!</h2>

      {/* Profile Picture */}
      <div>
        <ImageViewer imageData={image} id={"profil_image"} />
        <form>
          <input
            type="file"
            onChange={(e) => setNewAvatar(e.target.files[0])}
          />
          <button type="button" onClick={handleModifyAvatar}>
            Change Profile Picture
          </button>
        </form>
      </div>

      {/* Change Username */}
      <div>
        <p>Username: {user.username}</p>
        {showChangeUsernameForm ? (
          <form>
            <input
              type="text"
              placeholder="New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <button type="button" onClick={handleModifyUsername}>
              Change Username
            </button>
          </form>
        ) : (
          <button type="button" onClick={() => setShowChangeUsernameForm(true)}>
            Change Username
          </button>
        )}
      </div>

      {/* Change Email */}
      <div>
        <p>Email: {user.email}</p>
        {showChangeEmailForm ? (
          <form>
            <input
              type="email"
              placeholder="New Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <button type="button" onClick={handleModifyEmail}>
              Change Email
            </button>
          </form>
        ) : (
          <button type="button" onClick={() => setShowChangeEmailForm(true)}>
            Change Email
          </button>
        )}
      </div>

      {/* Change Password */}
      <div>
        <p>Password:</p>
        {showChangePasswordForm ? (
          <form>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button type="button" onClick={handleModifyPassword}>
              Change Password
            </button>
          </form>
        ) : (
          <button type="button" onClick={() => setShowChangePasswordForm(true)}>
            Change Password
          </button>
        )}
      </div>

      {/* Delete Account */}
      <div>
        <p>Delete Account:</p>
        {deleteConfirmation ? (
          <div>
            <p>Enter your password to confirm account deletion:</p>
            <input
              type="password"
              placeholder="Password"
              value={passwordForVerification}
              onChange={(e) => setPasswordForVerification(e.target.value)}
            />
          </div>
        ) : null}

        <button onClick={handleDeleteUser}>Delete Account</button>
      </div>
    </div>
  );
};

export default ProfilePage;
