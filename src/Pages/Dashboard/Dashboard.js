import React from "react";
import { useQuery } from "react-query";
import { AppState } from "../../Store";
import {
  fetchAdminProfiles,
  fetchUserProfile,
} from "../../Services/UserService";

const DashboardPage = () => {
  const { user } = AppState();
  const userId = user?.user.id;

  const userRole = user?.user.user_metadata?.role;

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery(
    ["profile", userId, userRole],
    () => {
      if (userRole === "student") {
        return fetchUserProfile(userId);
      } else if (userRole === "admin") {
        return fetchAdminProfiles(userId);
      } else {
        return Promise.reject(new Error("Unknown role"));
      }
    },
    {
      enabled: !!userId && !!userRole, // Ensure query is enabled only if userId and userRole are available
    }
  );

  const name = profile?.name;
  const email = profile?.email;
  const phone = profile?.phone;
  const faculty = profile?.faculty;
  const department = profile?.department;
  const created_at = profile?.created_at;

  console.log("test user id: ", userId);
  console.log("Test fetch profile details: ", profile);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile: {error.message}</p>;

  const renderDashboardContent = () => {
    if (userRole === "student") {
      return (
        <>
          <div>
            <h3>Student Information</h3>
            <div>
              <p>Account created on: {created_at}</p>
              <p>Name: {name}</p>
              <p>Email: {email}</p>
              <p>Phone number: {phone}</p>
            </div>
          </div>
          <div>
            <h3>School Program</h3>
            <div>
              <p>Faculty: {faculty}</p>
              <p>Department: {department}</p>
            </div>
          </div>
        </>
      );
    } else if (userRole === "admin") {
      return (
        <>
          <div>
            <h3>Admin Information</h3>
            <div>
              <p>Account created on: {created_at}</p>
              <p>Name: {name}</p>
              <p>Email: {email}</p>
              <p>Phone number: {phone}</p>
            </div>
          </div>
          <div>
            <h3>School Program</h3>
            <div>
              <p>Faculty: {faculty}</p>
              <p>Department: {department}</p>
            </div>
          </div>

          <div>
            <h1>Modal section to add candidates to system</h1>
          </div>
        </>
      );
    } else {
      return <p>Invalid role or profile data not available</p>;
    }
  };

  return (
    <div>
      <div>
        <p>MODAL NOTICE</p>
        <div>
          <h2>PLEASE NOTE.</h2>
        </div>
        <div>
          <p>
            You are allowed to vote only once for a candidate in each position.
            Once your vote is submitted, it cannot be changed, canceled, or
            revoked. Make sure to review your choices carefully before
            submitting.
          </p>
        </div>
        <div>
          <button type="button">Close</button>
        </div>
      </div>

      {renderDashboardContent()}
    </div>
  );
};

export default DashboardPage;
