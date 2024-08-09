import React from "react";
import UserCard from "../../Components/UserCard";

const dummyVoted = [
  { userName: "Peter", campaignPosition: "President" },
  { userName: "Peter", campaignPosition: "President" },
  { userName: "Peter", campaignPosition: "President" },
  { userName: "Peter", campaignPosition: "President" },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="underline">
        <h1>Candidates You Voted For</h1>
      </div>
      <div className="flex">
        {dummyVoted.map((candidate, index) => (
          <UserCard key={index} candidateInformation={candidate} />
        ))}
      </div>
    </div>
  );
}
