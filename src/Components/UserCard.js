import React from "react";

export default function UserCard({ candidateInformation }) {

    const {userImage, userName, campaignPosition} = candidateInformation;

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
        <p>Voted</p>
      </div>
    </div>
  );
}
