import React, { Fragment, useState, useEffect } from "react";
import { useQuery } from "react-query";
import { AppState } from "../../Store";
import {
  fetchAdminProfiles,
  fetchUserProfile,
} from "../../Services/UserService";

import { Blockquote, Spinner, Button, Card, Alert } from "flowbite-react";

const DashboardPage = () => {
  const { user } = AppState();

  const [showAlert, setShowAlert] = useState(true);

  const userId = user?.user.id;
  const role = user?.user.user_metadata.role;

  const userRole = user?.user.user_metadata?.role;

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowAlert(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  const {
    data: profile,
    isLoading,
    error,
    refetch,
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
      enabled: !!userId && !!userRole,
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

  if (isLoading)
    return (
      <Spinner
        className="mx-auto py-10 my-10 px-10 container flex justify-center"
        aria-label={`Loading ${role} information`}
      />
    );
  if (error)
    return (
      <Button
        type="button"
        onClick={() => refetch()}
        className="mx-auto py-10 
        my-10 px-10 container flex justify-center"
        color="failure"
      >
        Error loading profile: {error.message}
      </Button>
    );

  function formatCMRPhoneNumber(phoneNumber) {
    let cleanedNumber = String(phoneNumber).replace(/[\s-()]/g, "");

    if (cleanedNumber.startsWith("237") && !cleanedNumber.startsWith("+237")) {
      return `+${cleanedNumber}`;
    }

    if (!cleanedNumber.startsWith("+237")) {
      return `+237${cleanedNumber}`;
    }

    return cleanedNumber;
  }

  const renderDashboardContent = () => {
    if (userRole === "student") {
      return (
        <Fragment>
          <div className="my-4 py-2">
            <Blockquote className="text-2xl">Student Information</Blockquote>
            <div className="my-4 font-sans py-2">
              <Card className="max-w-md">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <span>Name: </span>
                  <span>{name}</span>
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <span>Email: </span>
                  <span>{email}</span>
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <span>Tel: </span>
                  <span>{formatCMRPhoneNumber(phone)}</span>
                </p>
              </Card>
            </div>
          </div>
          <div>
            <Blockquote className="text-2xl">School Program</Blockquote>
            <div className="my-4 font-sans py-2">
              <Card className="max-w-md">
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <span>Faculty: </span>
                  <span>{faculty}</span>
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <span>Department: </span>
                  <span>{department}</span>
                </p>
              </Card>
            </div>
          </div>
        </Fragment>
      );
    } else if (userRole === "admin") {
      return (
        <Fragment>
          <div>
            <Blockquote className="text-2xl">Admin Information</Blockquote>
            <div className="my-4 font-sans py-2">
              <Card className="max-w-md">
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <span>Name: </span>
                  <span>{name}</span>
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <span>Email: </span>
                  <span>{email}</span>
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <span>Tel: </span>
                  <span>{formatCMRPhoneNumber(phone)}</span>
                </p>
              </Card>
            </div>
          </div>
          <div>
            <Blockquote className="text-2xl">School Program</Blockquote>
            <div className="my-4 font-sans py-2">
              <Card className="max-w-md">
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <span>Faculty: </span>
                  <span>{faculty}</span>
                </p>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                  <span>Department: </span>
                  <span>{department}</span>
                </p>
              </Card>
            </div>
          </div>
        </Fragment>
      );
    } else {
      return <p>Invalid role or profile data not available</p>;
    }
  };

  const renderDashboardAlert = () => {
    return (
      <Alert color="failure" onDismiss={() => setShowAlert(false)}>
        <Blockquote className="text-2xl text-failure">PLEASE NOTE.</Blockquote>
        <p className="font-sans text-lg">
          You are allowed to vote only once for a candidate in each position.
          <br />
          Once your vote is submitted, it cannot be changed, canceled, or
          revoked.
          <br />
          Make sure to review your choices carefully before submitting.
        </p>
      </Alert>
    );
  };

  return (
    <div className="mx-auto my-10 px-10 container">
      {showAlert && renderDashboardAlert()}

      {renderDashboardContent()}
    </div>
  );
};

export default DashboardPage;
