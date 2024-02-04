// CommentForm.js

import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { makeRequest } from "./Api.js";
import { getCookie } from "./Cookie.js";

const CommentForm = ({ postId, onAddComment, onUpdateComment }) => {
  const userId = getCookie("user_forum");
  const [content, setContent] = useState("");

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
    } catch (error) {
      console.error("Error adding comment:", error.message);
    }
  };

  const handleUpdateComment = async () => {
    try {
      await onUpdateComment(content);
      setContent("");
    } catch (error) {
      console.error("Error updating comment:", error.message);
    }
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
          <button onClick={handleAddComment}>Add Comment</button>
          <button onClick={handleUpdateComment}>Update Comment</button>
        </>
      ) : (
        <p>Please log in to leave a comment.</p>
      )}
    </div>
  );
};

export default CommentForm;
