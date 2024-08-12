import { Field, Form, Formik } from "formik";
import { AppState } from "../../Store";
import supabase from "../../Configs/supabase";
import { useState } from "react";
import { Positions, SchoolPrograms } from "../../Constants";

export default function CandidatePage() {
  const { user } = AppState();

  const userRole = user?.user.user_metadata.role;

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const facultyToDepartments = SchoolPrograms.reduce((acc, school) => {
    acc[school.faculty] = school.departments;
    return acc;
  }, {});

  const addCandidateHandler = async (values, actions) => {
    try {
      const candidateData = {
        candidate_name: values.candidateName,
        candidate_faculty: values.candidateFaculty,
        candidate_department: values.candidateDepartment,
        candidate_position: values.candidatePosition,
      };
      const { error } = await supabase
        .from("CANDIDATE_TABLE")
        .insert([candidateData]);
      if (error) throw new Error(`Error writing to CANDIDATE_TABLE: ${error}`);
    } catch (error) {
      console.log("Error adding candidate to system: ", error);
      throw new Error(`Error adding candidate to database: ${error.message}`);
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
              <h1>Candidate By Position</h1>
            </div>

            <div>
              <h1>President</h1>
              <div>
                <p>Render Presidential Candidates</p>
              </div>
            </div>

            <div>
              <h1>Vice President</h1>
              <div>
                <p>Render Vice President Candidates</p>
              </div>
            </div>

            <div>
              <h1>Secretary</h1>
              <div>
                <p>Render Secretarial Candidates</p>
              </div>
            </div>

            <div>
              <h1>Vice Secretary</h1>
              <div>
                <p>Render Vice Secretarial Candidates</p>
              </div>
            </div>

            <div>
              <h1>Public Relations Officer</h1>
              <div>
                <p>Render Public Relations Officer Candidates</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return <div>{renderCandidateContent()}</div>;
}
