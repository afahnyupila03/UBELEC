import React from "react";
import UserCard from "../../Components/UserCard";
import { AppState } from "../../Store";

const dummyVoted = [
  { userName: "Peter", campaignPosition: "President" },
  { userName: "Peter", campaignPosition: "President" },
  { userName: "Peter", campaignPosition: "President" },
  { userName: "Peter", campaignPosition: "President" },
];

export default function DashboardPage() {
  const { user } = AppState();
  console.log("user state in app: ", user);

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
