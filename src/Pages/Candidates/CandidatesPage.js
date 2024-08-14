import { Field, Form, Formik } from "formik";
import { AppState } from "../../Store";
import supabase from "../../Configs/supabase";
import { useState } from "react";
import { Positions, SchoolPrograms } from "../../Constants";
import { useQuery } from "react-query";
import { fetchCandidateProfiles } from "../../Services/CandidateService";

export default function CandidatePage() {
  const { user } = AppState();

  const { data: candidateProfiles, refetch } = useQuery(
    "candidate_profiles",
    fetchCandidateProfiles
  );

  const userRole = user?.user.user_metadata.role;

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [filteredFaculty, setFilteredFaculty] = useState("");
  const [filteredDepartment, setFilteredDepartment] = useState("");

  const facultyToDepartments = SchoolPrograms.reduce((acc, school) => {
    acc[school.faculty] = school.departments;
    return acc;
  }, {});

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

  const deleteCandidateHandler = async (candidateId) => {
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

  const renderCandidateContent = () => {
    if (userRole === "student") {
      return (
        <div>
          <div>
            <h1>Vote Candidate by Position</h1>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      );
    } else if (userRole === "admin") {
      return (
        <div>
          {/* CHANGE THIS TO MODAL COMPONENT TO ADD USER FOR ADMIN */}
          <div>
            <h2>Add user to voting based on faculty and department</h2>
          </div>
          <div>
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
                  <Field
                    id="candidateName"
                    name="candidateName"
                    value={values.candidateName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="false"
                    label="Candidate Name"
                    placeholder="Candidate Name"
                  />

                  <Field
                    type="text"
                    id="candidateFaculty"
                    name="candidateFaculty"
                    as="select"
                    onChange={(e) => {
                      const selected = e.target.value;
                      handleChange(e); // This updates Formik's state
                      setSelectedFaculty(selected); // This updates the local state for departments
                    }}
                    onBlur={handleBlur}
                    value={values.candidateFaculty}
                  >
                    <option value="select">Select Candidate Faculty</option>
                    {SchoolPrograms.map((school, index) => (
                      <option value={school.faculty} key={index}>
                        {school.faculty}
                      </option>
                    ))}
                  </Field>

                  <Field
                    type="text"
                    id="candidateDepartment"
                    name="candidateDepartment"
                    as="select"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.candidateDepartment}
                  >
                    <option value="select">Select Candidate Department</option>
                    {selectedFaculty &&
                      facultyToDepartments[selectedFaculty].map(
                        (department, index) => (
                          <option value={department} key={index}>
                            {department}
                          </option>
                        )
                      )}
                  </Field>

                  <Field
                    type="text"
                    id="candidatePosition"
                    name="candidatePosition"
                    as="select"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.candidatePosition}
                  >
                    <option value="select">Select Candidate Position</option>
                    {Positions.map((position, index) => (
                      <option value={position} key={index}>
                        {position}
                      </option>
                    ))}
                  </Field>

                  <div>
                    <button type="submit">Add Candidate</button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div>
            <div>
              <h1>View Candidates by Positions</h1>
            </div>
            <div>
              {/* Faculty Filter Dropdown */}
              <select
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
              </select>

              {/* Department Filter Dropdown */}
              <select
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
              </select>
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
                <h1>{position}</h1>

                {/* Display Candidates */}
                {candidatePositions?.length > 0 ? (
                  candidatePositions.map((candidate) => (
                    <div key={candidate.candidateId}>
                      <p>Candidate Name: {candidate.candidateName}</p>
                      <p>Candidate Faculty: {candidate.candidateFaculty}</p>
                      <p>
                        Candidate Department: {candidate.candidateDepartment}
                      </p>
                      <p>Campaign Position: {candidate.candidatePosition}</p>
                      <button
                        type="button"
                        onClick={() =>
                          deleteCandidateHandler(candidate.candidateId)
                        }
                      >
                        Delete Candidate
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No candidates found for {position}</p>
                )}
              </div>
            );
          })}
        </div>
      );
    }
  };

  return <div>{renderCandidateContent()}</div>;
}
