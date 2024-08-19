import React, { Fragment, useState } from "react";
import { AppState } from "../../Store";
import { useQuery } from "react-query";
import {
  AdminVotesServices,
  StudentVotesServices,
} from "../../Services/VoteServices";
import AdminVoteCard from "./Components/AdminVoteCard";
import { Positions, SchoolPrograms } from "../../Constants";
import StudentVoteCard from "./Components/StudentVoteCard";
import { fetchUserProfile } from "../../Services/UserService";

import { Blockquote, Select, Label, Spinner, Button } from "flowbite-react";

export const AdminRenderOfVotes = (props) => {
  return (
    <Fragment>
      <div className="my-4 py-2">
        <Blockquote>View Votes by Positions</Blockquote>
      </div>
      <div className="flex space-x-4">
        <div className="max-w-sm">
          <div className="mb-2-block">
            <Label
              htmlFor="faculty"
              className="text-lg"
              value="Filter faculty"
            />
          </div>
          <Select value={props.filteredFaculty} onChange={props.facultyChange}>
            <option value="">All Faculties</option>
            {Object.keys(props.facultyToDepartments).map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
          </Select>
        </div>

        <div className="max-w-sm">
          <div className="mb-2-block">
            <Label
              htmlFor="department"
              className="text-lg"
              value="Filter department"
            />
          </div>
          <Select
            value={props.filteredDepartment}
            onChange={props.changeFilteredDepartment}
            disabled={!props.filteredFaculty} // Disable if no faculty is selected
          >
            <option value="">All Departments</option>
            {props.filteredFaculty &&
              props.facultyToDepartments[props.filteredFaculty].map(
                (department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                )
              )}
          </Select>
        </div>
      </div>

      {props.Positions.map((position) => {
        const votePositions = props.adminVotes?.filter(
          (candidate) =>
            candidate.candidatePosition === position &&
            (props.filteredFaculty === "" ||
              candidate.candidateFaculty === props.filteredFaculty) &&
            (props.filteredDepartment === "" ||
              candidate.candidateDepartment === props.filteredDepartment)
        );

        return (
          <div key={position}>
            <Blockquote className="text-2xl my-4 py-2">{position}</Blockquote>
            {votePositions?.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {votePositions.map((vote) => (
                  <AdminVoteCard key={vote.voteId} voteData={vote} />
                ))}
              </div>
            ) : (
              <Blockquote className="text-lg">
                No votes found for {position}
              </Blockquote>
            )}
          </div>
        );
      })}
    </Fragment>
  );
};

export default function VotesPage() {
  const { user } = AppState();

  const userId = user?.user.id;
  const userRole = user?.user.user_metadata.role;

  const [filteredFaculty, setFilteredFaculty] = useState("");
  const [filteredDepartment, setFilteredDepartment] = useState("");

  const facultyToDepartments = SchoolPrograms.reduce((acc, school) => {
    acc[school.faculty] = school.departments;
    return acc;
  }, {});

  const {
    data: votes,
    error,
    refetch,
    isLoading,
  } = useQuery(
    ["votes", userId, userRole],
    () => {
      if (userRole === "student") {
        return StudentVotesServices(userId);
      }
      return AdminVotesServices();
    },
    { enabled: !!userId }
  );

  const { data: studentProfile } = useQuery(
    ["student_profile", userId, userRole],
    () => {
      if (userRole === "student") {
        return fetchUserProfile(userId);
      }
      return null;
    },
    { enabled: !!userRole }
  );
  const studentFaculty = studentProfile?.faculty;
  const studentDepartment = studentProfile?.department;

  if (isLoading)
    return (
      <Spinner
        className="mx-auto py-10 my-10 px-10 container flex justify-center"
        aria-label={`Loading vote information`}
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

  const renderStudentVoteBySchoolProgram = () => {
    return Positions.map((position) => {
      const votePositions = votes?.filter(
        (candidate) =>
          candidate.candidatePosition === position &&
          candidate.candidateFaculty === studentFaculty &&
          candidate.candidateDepartment === studentDepartment
      );

      return (
        <div key={position}>
          <Blockquote className="text-2xl my-4 py-2">{position}</Blockquote>
          {votePositions?.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {votePositions.map((vote) => (
                <StudentVoteCard key={vote.voteId} voteData={vote} />
              ))}
            </div>
          ) : (
            <Blockquote className="text-xl font-sans">
              No candidates found for the position of {position}
            </Blockquote>
          )}
        </div>
      );
    });
  };

  const renderVoteContent = () => {
    if (userRole === "student") {
      return <div>{renderStudentVoteBySchoolProgram()}</div>;
    } else if (userRole === "admin") {
      return (
        <AdminRenderOfVotes
          filterFacultyValue={filteredFaculty}
          facultyChange={(e) => {
            setFilteredFaculty(e.target.value);
            setFilteredDepartment("");
          }}
          facultyToDepartments={facultyToDepartments}
          filteredDepartment={filteredDepartment}
          changeFilteredDepartment={(e) =>
            setFilteredDepartment(e.target.value)
          }
          
          disabled={!filteredFaculty}
          filteredFaculty={filteredFaculty}
          Positions={Positions}
          adminVotes={votes}
        />
      );
    }
  };

  return (
    <div className="mx-auto my-10 px-10 container">{renderVoteContent()}</div>
  );
}
