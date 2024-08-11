import React from "react";
import UserCard from "../../Components/UserCard";
import { AppState } from "../../Store";

const dummyVoted = [
  { userName: "Peter", campaignPosition: "President" },
  { userName: "Peter", campaignPosition: "President" },
  { userName: "Peter", campaignPosition: "President" },
  { userName: "Peter", campaignPosition: "President" },
];

const DashboardContent = (role) => {
  if (role === "student") {
    return (
      <div>
        <div>
          <h3>Basic Information</h3>
          <div>
            <p>Name: </p>
            <p>Email: </p>
            <p>Phone number: </p>
          </div>
        </div>
        <div>
          <h3>School Program</h3>
          <div>
            <p>Faculty: </p>
            <p>Department: </p>
          </div>
        </div>
      </div>
    );
  }
};

export default function DashboardPage() {
  const { user } = AppState();
  console.log("user state in app: ", user);
  const userRole = user?.user.user_metadata.role;

  return <div>{DashboardContent(userRole)}</div>;
}
