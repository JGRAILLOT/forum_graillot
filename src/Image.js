//Image.js
import React from "react";

const ImageViewer = ({ imageData, id }) => {
  if (!imageData) {
    return null;
  }

  const imageUrl = "http://localhost:3000/uploads/" + imageData.filename;

  return <img src={imageUrl} alt="Uploaded" id={id} />;
};

export default ImageViewer;
