// PostEditor.js
import React, { useState, useEffect } from "react";
import makeRequest from "./Api.js";
import { getCookie } from "./Cookie.js";
import PostForm from "./PostForm";
import ImageViewer from "./Image.js";

function PostEditor({ postId }) {
  const [authorId, setAuthorId] = useState(null);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);
  const [picture, setPicture] = useState(null);
  const [image, setImage] = useState(null);
  const [authorUsername, setAuthorUsername] = useState(null);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const userId = getCookie("user_forum");

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await makeRequest("GET", `/posts/${postId}`);
        setContent(response.content);
        setTitle(response.title);
        setPicture(response.picture);
        setCreatedAt(response.createdAt);
        setAuthorId(response.authorId);

        const authorResponse = await makeRequest(
          "GET",
          `/users/${response.authorId}`
        );
        setAuthorUsername(authorResponse.user.username);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };
    const isAdminResponse = async () => {
      try {
        await makeRequest("GET", `/users/${userId}/`);
        setUserIsAdmin(isAdminResponse.isAdmin);
      } catch (error) {
        console.error("Error fetching is Admin", error);
      }
    };

    const registerVisit = async () => {
      try {
        await makeRequest("POST", "/visit/register-visit", { postId, userId });
      } catch (error) {
        console.error("Error registering visit:", error);
      }
    };
    const fetchImage = async () => {
      if (picture) {
        try {
          const image = await makeRequest("GET", `/image/${picture}`);
          setImage(image);
        } catch (error) {
          console.error("Error getting image", error);
        }
      }
    };

    fetchPostDetails();
    isAdminResponse();
    registerVisit();
    fetchImage();
  }, [picture, postId, userId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    try {
      if (userIsAdmin || userId === authorId) {
        await makeRequest("DELETE", `/posts/${postId}`);
      } else {
        console.error("User is not authorized to delete this post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      {!isEditing ? (
        <>
          <h2>{title}</h2>
          <p>
            By {authorUsername || "Unknown"} on{" "}
            {new Date(createdAt).toLocaleString()}
          </p>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          {image && <ImageViewer imageData={image} id={"post"} />}
          <div>
            {userId && userId === authorId && (
              <button onClick={handleEdit}>Edit</button>
            )}
            {userId && (userId === authorId || userIsAdmin) && (
              <button onClick={handleDelete}>Delete</button>
            )}
          </div>
        </>
      ) : (
        <PostForm
          initialData={{
            _id: postId,
            title: title,
            content: content,
            picture: picture,
          }}
        />
      )}
    </div>
  );
}

export default PostEditor;
