// PostPage.js
import React from "react";
import { useParams } from "react-router-dom"; // Assuming you are using react-router-dom

import VoteButton from "./VoteButton";
import PostEditor from "./PostEditor";
import CommentPage from "./CommentPage";

const PostPage = () => {
  const { postId } = useParams();

  return (
    <div>
      <PostEditor postId={postId} />
      <VoteButton postId={postId} />
      <CommentPage postId={postId} />
    </div>
  );
};

export default PostPage;
