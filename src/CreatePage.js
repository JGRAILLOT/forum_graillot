// CreatePage.js

import React from "react";
import PostForm from "./PostForm";

function CreatePage() {
  return (
    <div>
      <h1>Create New Post</h1>
      <PostForm mode="create" />
    </div>
  );
}

export default CreatePage;
