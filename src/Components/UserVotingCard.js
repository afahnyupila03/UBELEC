import React from "react";

export default function VotingCard({
  userImage,
  userName,
  campaignPosition,
  handleUserVote,
}) {
  return (
    <div>
      <div>
        <img src={userImage} alt={userName} />
      </div>
      <div>
        <h3>Candidate Name: {userName}</h3>
        <p>Running For: {campaignPosition}</p>
      </div>
      <div>
        <button onClick={handleUserVote}>Voted</button>
      </div>
    </div>
  );
}