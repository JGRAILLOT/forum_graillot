// CommentEditor.js

import React, { useState, useEffect } from "react";
import { makeRequest } from "./Api.js";
import { getCookie } from "./Cookie.js";
import ImageViewer from "./Image.js";
import CommentForm from "./CommentForm.js";

const CommentEditor = ({ comment, onEdit, onDelete }) => {
  const userId = getCookie("user_forum");
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        if (userId) {
          const user = await makeRequest("GET", `/users/${userId}`);
          console.log();
          const isAdmin = user.user.isAdmin;
          setIsAdmin(isAdmin);
        }
      } catch (error) {
        console.error("Error fetching admin status:", error.message);
      }
    };

    const commentername = async () => {
      try {
        const user = await makeRequest("GET", `/users/${comment.authorId}`);
        const username = user.user.username;
        setUsername(username);
      } catch (error) {
        console.error("Error fetching commenter username", error.message);
      }
    };

    const commenterimage = async () => {
      try {
        const user = await makeRequest("GET", `/users/${comment.authorId}`);
        const avatar = user.user.avatar;
        if (avatar) {
          const image = await makeRequest("GET", `image/${avatar}`);
          setImage(image);
        }
      } catch (error) {
        console.error("Error fetching commenter avatar", error.message);
      }
    };

    fetchAdminStatus();
    commentername();
    commenterimage();
  }, [userId, username, comment.authorId]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent("");
  };

  return (
    <div>
      {isEditing ? (
        <CommentForm
          postId={comment.postId}
          commentId={comment._id}
          onUpdateComment={(updatedContent) => {
            onEdit(comment._id, updatedContent);
            handleCancelEdit();
          }}
          onCancel={handleCancelEdit}
          initialContent={editContent}
        />
      ) : (
        <>
          <p>
            <ImageViewer imageData={image} id={"comment_image"} /> {username} on{" "}
            {new Date(comment.createdAt).toLocaleString()}
          </p>
          <div
            id="comment_content"
            dangerouslySetInnerHTML={{ __html: comment.content }}
          />
          {userId && userId === comment.authorId && (
            <button onClick={handleEdit} id="comment_button">
              Edit
            </button>
          )}
          {userId && (userId === comment.authorId || isAdmin) && (
            <button onClick={() => onDelete(comment._id)} id="comment_button">
              Delete
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CommentEditor;
