//CommentForm.js

import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { makeRequest } from "./Api.js";
import { getCookie } from "./Cookie.js";

const CommentForm = ({
  postId,
  commentId = null,
  onAddComment,
  onUpdateComment,
  onCancelEdit,
  initialContent,
}) => {
  const userId = getCookie("user_forum");
  const [content, setContent] = useState(initialContent || "");

  const handleEditorChange = (value) => {
    setContent(value);
  };

  const handleAddComment = async () => {
    try {
      const result = await makeRequest("POST", "/comments", {
        content,
        authorId: userId,
        postId,
      });
      onAddComment(result);
      setContent("");
      window.location.reload();
    } catch (error) {
      console.error("Error adding comment:", error.message);
    }
  };

  const handleUpdateComment = async () => {
    try {
      const result = await makeRequest("PUT", `/comments/${commentId}`, {
        content,
      });
      onUpdateComment(result);
      setContent("");
      window.location.reload();
    } catch (error) {
      console.error("Error updating comment:", error.message);
    }
  };

  const handleCancelEdit = () => {
    onCancelEdit();
    setContent("");
  };

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={handleEditorChange}
        placeholder="Write your comment here..."
      />
      {userId ? (
        <>
          {initialContent ? (
            <button onClick={handleUpdateComment}>Update Comment</button>
          ) : (
            <button onClick={handleAddComment}>Add Comment</button>
          )}
          <button onClick={handleCancelEdit}>Cancel</button>
        </>
      ) : (
        <p>Please log in to leave a comment.</p>
      )}
    </div>
  );
};

export default CommentForm;
