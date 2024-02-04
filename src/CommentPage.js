import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import CommentEditor from "./CommentEditor";
import makeRequest from "./Api.js";

const CommentPage = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const result = await makeRequest("GET", `/comments/post/${postId}`);
        setComments(result.comments);
      } catch (error) {
        console.error("Error fetching comments:", error.message);
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = (newComment) => {
    setComments([...comments, newComment]);
  };

  const handleUpdateComment = (updatedComment) => {
    const updatedComments = comments.map((comment) =>
      comment._id === updatedComment._id ? updatedComment : comment
    );
    setComments(updatedComments);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await makeRequest("DELETE", `/comments/${commentId}`);
      const filteredComments = comments.filter(
        (comment) => comment._id !== commentId
      );
      setComments(filteredComments);
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  return (
    <div>
      <CommentForm
        postId={postId}
        onAddComment={handleAddComment}
        onUpdateComment={handleUpdateComment}
      />

      <h2>Comments</h2>
      {comments.map((comment) => (
        <CommentEditor
          key={comment._id}
          comment={comment}
          onEdit={handleUpdateComment}
          onDelete={handleDeleteComment}
        />
      ))}
    </div>
  );
};

export default CommentPage;
