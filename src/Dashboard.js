// Dashboard.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import makeRequest from "./Api";

const Dashboard = () => {
  const [lastPost, setLastPost] = useState(null);
  const [commentCount, setCommentCount] = useState(null);
  const [visitCount, setVisitCount] = useState(null);
  const [voteCount, setVoteCount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch last post
        const lastPostData = await makeRequest("GET", "/posts/last");
        setLastPost(lastPostData);

        // Fetch comment count
        const commentCountData = await makeRequest(
          "GET",
          `/comments/${lastPostData._id}/comment-count`
        );
        setCommentCount(commentCountData.count);

        // Fetch visit count
        const visitCountData = await makeRequest(
          "GET",
          `/visit/${lastPostData._id}/visit-count`
        );
        setVisitCount(visitCountData.count);

        // Fetch vote count
        const voteCountData = await makeRequest(
          "GET",
          `/votes/count/${lastPostData._id}`
        );
        setVoteCount(voteCountData.voteCount);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <h1>Dashboard</h1>
      {lastPost && (
        <>
          <p>
            Last Post:{" "}
            <Link to={`/post/${lastPost._id}`}>{lastPost.title}</Link>
          </p>
          <p>Comment Count: {commentCount}</p>
          <p>Visit Count: {visitCount}</p>
          <p>Vote Count: {voteCount}</p>
        </>
      )}
    </div>
  );
};

export default Dashboard;
