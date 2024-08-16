/* eslint-disable no-lone-blocks */
import { Form, Formik } from "formik";
import { AppState } from "../../Store";
import supabase from "../../Configs/supabase";
import { Fragment, useState } from "react";
import { Positions, SchoolPrograms } from "../../Constants/index";
import { useQuery } from "react-query";
import { fetchCandidateProfiles } from "../../Services/CandidateService";
import { fetchUserProfile } from "../../Services/UserService";
import StudentCandidateCard from "./Components/StudentCandidateCard";
import AdminCandidateCard from "./Components/AdminCandidateCard";
import FormField from "../../Components/TextInput";

import {
  Label,
  Select,
  Blockquote,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "flowbite-react";

export default function CandidatePage() {
  const { user } = AppState();

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [filteredFaculty, setFilteredFaculty] = useState("");
  const [filteredDepartment, setFilteredDepartment] = useState("");
  const [votedPositions, setVotedPositions] = useState({});

  const [openModal, setOpenModal] = useState(false);

  function onCloseModal() {
    setOpenModal(false);
  }

  const userRole = user?.user.user_metadata.role;
  const userId = user?.user.id;

  const { data: candidateProfiles, refetch } = useQuery(
    "candidate_profiles",
    fetchCandidateProfiles
  );
  const { data: studentProfile } = useQuery(
    ["student_profile", userId, userRole],
    () => {
      if (userRole === "student") {
        return fetchUserProfile(userId);
      }
      return null;
    },
    { enabled: !!userId }
  );

  const facultyToDepartments = SchoolPrograms.reduce((acc, school) => {
    acc[school.faculty] = school.departments;
    return acc;
  }, {});

  const studentFaculty = studentProfile?.faculty;
  const studentDepartment = studentProfile?.department;

  const addCandidateHandler = async (values, actions) => {
    const candidateData = {
      candidate_name: values.candidateName,
      candidate_faculty: values.candidateFaculty,
      candidate_department: values.candidateDepartment,
      candidate_position: values.candidatePosition,
    };

    try {
      const { data, error } = await supabase
        .from("CANDIDATE_TABLE")
        .select("*")
        .eq("candidate_name", candidateData.candidate_name);

      if (error) {
        console.error("Error fetching candidates:", error);
        alert(`Error fetching candidates: ${error.message}`);
        return;
      }

      // Check if the candidate name already exists
      const existingCandidate = data.find(
        (candidate) => candidate.candidate_name === candidateData.candidate_name
      );

      if (existingCandidate) {
        // Check for faculty conflict
        if (
          existingCandidate.candidate_faculty !==
          candidateData.candidate_faculty
        ) {
          alert(
            `Conflict: ${candidateData.candidate_name} already exists in ${existingCandidate.candidate_faculty}. Cannot add to ${candidateData.candidate_faculty}.`
          );
          return;
        }

        // Check for department conflict
        if (
          existingCandidate.candidate_department !==
          candidateData.candidate_department
        ) {
          alert(
            `Conflict: ${candidateData.candidate_name} already exists in ${existingCandidate.candidate_department}. Cannot add to ${candidateData.candidate_department}.`
          );
          return;
        }

        // Check if position matches
        if (
          existingCandidate.candidate_position ===
          candidateData.candidate_position
        ) {
          alert(
            `Error: ${candidateData.candidate_name} already exists for the position of ${candidateData.candidate_position}.`
          );
          return;
        }
      }

      // Insert the new candidate if all checks pass
      const { error: insertError } = await supabase
        .from("CANDIDATE_TABLE")
        .insert([candidateData]);

      if (insertError) {
        console.error(
          `Error writing to CANDIDATE_TABLE: ${insertError.message}`
        );
        alert(`Error adding candidate: ${insertError.message}`);
        return;
      }

      console.log("Success adding candidate to system");
      alert(`Candidate ${values.candidateName} successfully added.`);

      refetch();
    } catch (error) {
      console.error("Error adding candidate to system:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const removeCandidateHandler = async (candidateId) => {
    try {
      await supabase
        .from("CANDIDATE_TABLE")
        .delete()
        .eq("candidate_id", candidateId);

      alert(`Success deleting candidate from system`);
      refetch();
    } catch (error) {
      console.error(`Error deleting candidate from system: ${error}`);
      throw new Error(`Error deleting candidate from system: ${error}`);
    }
  };

  const voteCandidateHandler = async (candidateId, candidatePosition) => {
    try {
      // Check if the user has already voted for this position
      const { data: existingVote, error: fetchError } = await supabase
        .from("VOTE_TABLE")
        .select("*")
        .eq("user_id", userId)
        .eq("vote_type", candidatePosition);

      if (fetchError) {
        alert(`Error checking existing votes: ${fetchError.message}`);
        throw new Error(`Error checking existing votes: ${fetchError.message}`);
      }

      if (existingVote?.length > 0) {
        alert(
          `You have already voted for the position of ${candidatePosition}.`
        );
        return;
      }

      // Insert the new vote
      const voteData = {
        user_id: userId,
        vote_type: candidatePosition,
        vote_date: new Date().toISOString().split("T")[0], // Get the current date
        candidate_id: candidateId,
      };

      const { error: insertError } = await supabase
        .from("VOTE_TABLE")
        .insert([voteData]);

      if (insertError) {
        alert(`Error adding vote to system: ${insertError.message}`);
        throw new Error(`Error adding vote to system: ${insertError.message}`);
      }

      alert(
        `You have successfully voted for the position of ${candidatePosition}.`
      );
      // Set the voted position in the state
      setVotedPositions((prev) => ({
        ...prev,
        [candidatePosition]: candidateId,
      }));
    } catch (error) {
      console.error(`Error adding vote to system: ${error.message}`);
    }
  };

  // Function to render candidates based on the student's Faculty and Department
  const renderStudentCandidateBySchoolProgram = () => {
    return Positions.map((position) => {
      const candidatePositions = candidateProfiles?.filter(
        (candidate) =>
          candidate.candidatePosition === position &&
          candidate.candidateFaculty === studentFaculty &&
          candidate.candidateDepartment === studentDepartment
      );

      return (
        <div key={position}>
          <Blockquote className="text-xl font-sans">{position}</Blockquote>
          {candidatePositions?.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {candidatePositions.map((candidate) => (
                <StudentCandidateCard
                  key={candidate.candidateId}
                  voteHandler={() =>
                    voteCandidateHandler(candidate.candidateId, position)
                  }
                  isVoted={votedPositions[position] === candidate.candidateId}
                  isDisabled={votedPositions[position] !== undefined}
                  candidateData={candidate}
                />
              ))}
            </div>
          ) : (
            <Blockquote className="text-xl font-sans py-2">
              No candidates found for the position of {position}
            </Blockquote>
          )}
        </div>
      );
    });
  };

  const renderCandidateModalForm = () => {
    return (
      <Modal show={openModal} size="md" onClose={onCloseModal} popup>
        <ModalHeader className="flex justify-center">
          <Blockquote
            style={{ marginLeft: "7.5rem", marginRight: "6.5rem" }}
            className="font-sans text-center"
          >
            Add Candidate
          </Blockquote>
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={{
              candidateName: "",
              candidateFaculty: selectedFaculty,
              candidateDepartment: "",
              candidatePosition: "",
            }}
            onSubmit={addCandidateHandler}
          >
            {({ values, handleChange, handleBlur, isSubmitting }) => (
              <Form>
                <FormField
                  id="candidateName"
                  name="candidateName"
                  value={values.candidateName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Candidate Name"
                />

                <FormField
                  id="candidateFaculty"
                  name="candidateFaculty"
                  as="select"
                  value={values.candidateFaculty}
                  onChange={(e) => {
                    const selected = e.target.value;
                    handleChange(e);
                    setSelectedFaculty(selected);
                  }}
                  onBlur={handleBlur}
                  placeholder="Select Candidate Faculty"
                  options={SchoolPrograms.map((school) => school.faculty)}
                />

                <FormField
                  id="candidateDepartment"
                  name="candidateDepartment"
                  as="select"
                  value={values.candidateDepartment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Select Candidate Department"
                  options={
                    selectedFaculty ? facultyToDepartments[selectedFaculty] : []
                  }
                />

                <FormField
                  id="candidatePosition"
                  name="candidatePosition"
                  as="select"
                  value={values.candidatePosition}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Select Candidate Position"
                  options={Positions}
                />

                <div className="text-right">
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="mt-4"
                    color="success"
                  >
                    {isSubmitting ? "Adding Candidate" : "Add Candidate"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </Modal>
    );
  };

  /* Render admin candidate view */
  const renderCandidatesForAdminView = () => {
    return (
      <Fragment>
        <div>
          <div className="my-4 py-2">
            <Blockquote className="text-xl font-sans">
              View Candidates by Positions
            </Blockquote>
          </div>

          <div className="flex space-x-4">
            {/* Faculty Filter Dropdown */}
            <div className="max-w-sm">
              <div className="mb-2 block">
                <Label
                  htmlFor="faculty"
                  className="text-lg"
                  value="Filter faculty"
                />
              </div>
              <Select
                value={filteredFaculty}
                onChange={(e) => {
                  setFilteredFaculty(e.target.value);
                  setFilteredDepartment(""); // Reset department when faculty changes
                }}
              >
                <option value="">All Faculties</option>
                {Object.keys(facultyToDepartments).map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </Select>
            </div>

            {/* Department Filter Dropdown */}
            <div className="max-w-sm">
              <div className="mb-2 block">
                <Label
                  htmlFor="department"
                  className="text-lg"
                  value="Filter department"
                />
              </div>
              <Select
                value={filteredDepartment}
                onChange={(e) => setFilteredDepartment(e.target.value)}
                disabled={!filteredFaculty} // Disable if no faculty is selected
              >
                <option value="">All Departments</option>
                {filteredFaculty &&
                  facultyToDepartments[filteredFaculty].map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
              </Select>
            </div>
          </div>
        </div>

        {Positions.map((position) => {
          const candidatePositions = candidateProfiles?.filter(
            (candidate) =>
              candidate.candidatePosition === position &&
              (filteredFaculty === "" ||
                candidate.candidateFaculty === filteredFaculty) &&
              (filteredDepartment === "" ||
                candidate.candidateDepartment === filteredDepartment)
          );

          return (
            <div key={position}>
              <Blockquote className="text-xl font-sans my-4 py-2">
                {position}
              </Blockquote>

              {/* Display Candidates */}
              {candidatePositions?.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {candidatePositions.map((candidate) => (
                    <AdminCandidateCard
                      key={candidate.candidateId}
                      candidateData={candidate}
                      removeCandidate={() =>
                        removeCandidateHandler(candidate.candidateId)
                      }
                    />
                  ))}
                </div>
              ) : (
                <Blockquote className="text-xl font-sans py-2">
                  No candidates found for the position of {position}
                </Blockquote>
              )}
            </div>
          );
        })}
      </Fragment>
    );
  };

  const renderCandidateContent = () => {
    if (userRole === "student") {
      return (
        <div>
          <Blockquote className="font-sans my-4 py-2 text-2xl">
            Vote Candidate by Position
          </Blockquote>
          {renderStudentCandidateBySchoolProgram()}
        </div>
      );
    } else if (userRole === "admin") {
      return (
        <div>
          {openModal && renderCandidateModalForm()}

          <Button onClick={() => setOpenModal(true)} color="success">
            <Blockquote className="text-white font-sans">
              Add Candidate
            </Blockquote>
          </Button>

          {renderCandidatesForAdminView()}
        </div>
      );
    }
  };

  return (
    <div className="mx-auto my-10 px-10 container">
      {renderCandidateContent()}
    </div>
  );
}
