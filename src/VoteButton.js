// VoteButton.js
import React, { useState, useEffect } from "react";
import { getCookie } from "./Cookie.js";
import { makeRequest } from "./Api.js";

const VoteButton = ({ postId }) => {
  const userId = getCookie("user_forum");
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    const getVoteCount = async () => {
      try {
        const response = await makeRequest("get", `/votes/count/${postId}`);
        setVoteCount(response.voteCount);
      } catch (error) {
        console.error("Error getting vote count:", error);
      }
    };
    getVoteCount();
  }, [postId]);

  const handleVote = async (value) => {
    try {
      const existingVoteResponse = await makeRequest(
        "GET",
        `/votes/${postId}/${userId}`
      );

      if (existingVoteResponse.existingVote) {
        await makeRequest("DELETE", `/votes/${postId}/${userId}`);
        if (existingVoteResponse.existingVote.value !== value) {
          await makeRequest("POST", "/votes", { postId, userId, value });
        }
      } else {
        await makeRequest("POST", "/votes", { postId, userId, value });
      }
    } catch (error) {
      console.error("Error handling vote:", error);
    }
  };

  return (
    <div>
      <p>Vote Count: {voteCount}</p>
      <button onClick={() => handleVote(1)} disabled={!userId} id="upvote">
        Upvote
      </button>
      <button onClick={() => handleVote(2)} disabled={!userId} id="downvote">
        Downvote
      </button>
    </div>
  );
};

export default VoteButton;
