// PostForm.js

import React, { useState, useEffect } from "react";
import { makeRequest } from "./Api";
import { getCookie } from "./Cookie";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function PostForm({ initialData }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [mode, setMode] = useState("create");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setImage(initialData.picture || null);
      setMode("update");
    }
  }, [initialData]);

  const handleEditorChange = (value) => {
    setContent(value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // If in create mode and an image is provided, upload the new image
      if (mode === "create" && image) {
        const formData = new FormData();
        formData.append("image", image);

        const uploadResponse = await makeRequest(
          "POST",
          "/image/upload",
          formData
        );
        console.log("Image", uploadResponse);

        const picture = uploadResponse._id;
        const authorId = getCookie("user_forum");
        await makeRequest("POST", "/posts", {
          title,
          content,
          authorId,
          picture,
        });
      } else {
        // If in update mode or no image provided during creation, update the post without changing the image
        const authorId = getCookie("user_forum");
        await makeRequest(
          "PUT",
          mode === "create" ? "/posts" : `/posts/${initialData._id}`,
          { title, content, authorId }
        );
      }

      window.location.reload();
    } catch (error) {
      console.error(`Error post creation:`, error.message);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Post Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Post Content:</label>
        <div>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={handleEditorChange}
          />
        </div>
      </div>
      {mode === "create" && (
        <div>
          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
      )}
      <button type="submit">
        {mode === "create" ? "Create Post" : "Update Post"}
      </button>
    </form>
  );
}

export default PostForm;
