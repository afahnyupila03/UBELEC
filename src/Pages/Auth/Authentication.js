import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { AppState } from "../../Store";
import { useLocation, useNavigate } from "react-router-dom";
import { SchoolPrograms } from "./Components/Constants";
import supabase from "../../Configs/supabase";

const signUpErrorMessage = ({ error }) => {
  return (
    <>
      {alert(error.message)}
      <p>{error.message}</p>
      <p>Please try again</p>
    </>
  );
};

const SignInErrorMessage = ({ error }) => {
  return (
    <>
      {alert(error.message)}
      <p>Error signing into account</p>
      <p>Please try again</p>
    </>
  );
};

export default function AuthenticationPage() {
  const { createUserHandler, signInUser, user } = AppState();
  const [newUser, setNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const facultyToDepartments = SchoolPrograms.reduce((acc, school) => {
    acc[school.faculty] = school.departments;
    return acc;
  }, {});

  console.log("view faculty: ", selectedFaculty);
  console.log("view auth user: ", user);

  const navigate = useNavigate();
  const location = useLocation();

  const role =
    location.pathname === "/admin/create-account-&-log-in"
      ? "admin"
      : "student";
  const redirectTo =
    role === "admin" ? "/admin/dashboard" : "/student/dashboard";

  const createAccount = async (values, actions) => {
    try {
      // Create user via createUserHandler
      const { user, error: createUserError } = await createUserHandler(
        values.email,
        values.password,
        values.firstName,
        values.lastName,
        role,
        redirectTo,
        values.phone
      );

      if (createUserError || !user) {
        throw new Error(createUserError?.message || "User creation failed");
      }

      const { id: userId } = user;

      // Insert into FACULTY_TABLE and retrieve the inserted faculty_id
      const { data: faculty, error: facultyError } = await supabase
        .from("FACULTY_TABLE")
        .insert({ faculty_name: values.faculty })
        .select("faculty_id")
        .single();

      if (facultyError) {
        throw new Error(
          `Error writing to FACULTY_TABLE: ${facultyError.message}`
        );
      }

      const faculty_id = faculty?.faculty_id;

      // Define data to be inserted into DEPARTMENT_TABLE using the retrieved faculty_id
      const departmentData = {
        department_name: values.department,
        faculty_id,
      };

      // Insert into DEPARTMENT_TABLE
      const { data: department, error: departmentError } = await supabase
        .from("DEPARTMENT_TABLE")
        .insert([departmentData])
        .select("department_id")
        .single();

      const department_id = department?.department_id;

      if (departmentError) {
        throw new Error(
          `Error writing to DEPARTMENT_TABLE: ${departmentError.message}`
        );
      }

      // Define data to be inserted into USER_TABLE
      const studentData = {
        user_id: userId,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone: values.phone,
        faculty_id,
        department_id,
      };

      // Insert into USER_TABLE
      const { error: userError } = await supabase
        .from("USER_TABLE")
        .insert([studentData]);

      if (userError) {
        throw new Error(`Error writing to USER_TABLE: ${userError.message}`);
      }

      // Reset form values
      actions.resetForm({
        values: {
          email: "",
          firstName: "",
          lastName: "",
          password: "",
          department: "",
          faculty: "",
          phone: "",
        },
      });

      alert("Account created successfully and data inserted into the database");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error("Error in createAccount:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const loginAccount = async (values, actions) => {
    try {
      await signInUser(values.email, values.password);
      actions.resetForm({
        values: {
          email: "",
          password: "",
        },
      });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <div>
      <div>
        <h1>{newUser ? "Create Account" : "Login"}</h1>
        <Formik
          initialValues={
            newUser
              ? {
                  email: "",
                  password: "",
                  firstName: "",
                  lastName: "",
                  department: "",
                  faculty: selectedFaculty,
                  phone: "",
                }
              : {
                  email: "",
                  password: "",
                }
          }
          onSubmit={newUser ? createAccount : loginAccount}
        >
          {({ values, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <Field
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder="Enter Email"
                label="Enter Email"
              />
              {newUser && (
                <>
                  <Field
                    type="text"
                    id="firstName"
                    name="firstName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.firstName}
                    placeholder="Enter First Name"
                    label="Enter First Name"
                  />
                  <Field
                    type="text"
                    id="lastName"
                    name="lastName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lastName}
                    placeholder="Enter Last Name"
                    label="Enter Last Name"
                  />
                  <Field
                    type="tel"
                    id="phone"
                    name="phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                    placeholder="Enter Phone Number"
                    label="Enter Phone Number"
                  />
                  <Field
                    type="text"
                    id="faculty"
                    name="faculty"
                    as="select"
                    onChange={(e) => {
                      const selected = e.target.value;
                      handleChange(e); // This updates Formik's state
                      setSelectedFaculty(selected); // This updates the local state for departments
                    }}
                    onBlur={handleBlur}
                    value={values.faculty}
                  >
                    <option value="select">Select Faculty</option>
                    {SchoolPrograms.map((school, index) => (
                      <option value={school.faculty} key={index}>
                        {school.faculty}
                      </option>
                    ))}
                  </Field>
                  <Field
                    type="text"
                    id="department"
                    name="department"
                    as="select"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.department}
                  >
                    <option value="select">Select Department</option>
                    {selectedFaculty &&
                      facultyToDepartments[selectedFaculty].map(
                        (department, index) => (
                          <option value={department} key={index}>
                            {department}
                          </option>
                        )
                      )}
                  </Field>
                </>
              )}

              <div style={{ position: "relative", width: "100%" }}>
                <Field
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder="Enter Password"
                  label="Enter Password"
                />
                {values.password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prevValue) => !prevValue)}
                    className="absolute inset-y-0 right-0 
                    pr-3 flex items-center text-sm leading-5"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                )}
              </div>

              <div className="flex">
                <button
                  type="button"
                  onClick={() => {
                    setNewUser((prevAuth) => !prevAuth);
                  }}
                >
                  {newUser ? "Already have an account ?" : "New User ?"}

                  <span className="ml-4">
                    {newUser ? "Login" : "Create Account"}
                  </span>
                </button>
              </div>
              <div>
                <button disabled={isSubmitting} type="submit">
                  {newUser ? "Create Account" : "Login"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
