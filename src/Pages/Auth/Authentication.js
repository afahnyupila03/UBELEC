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
      const { user } = await createUserHandler(
        values.email,
        values.password,
        values.firstName,
        values.lastName,
        role,
        redirectTo,
        values.phone
      );
      actions.resetForm({
        values: {
          email: "",
          firstName: "",
          lastName: "",
          password: "",
        },
      });

      const { id } = user;
      console.log("Authentication page user: ", user);

      try {
        const studentData = {
          user_id: id,
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
        };
        const facultyInfor = {
          faculty_name: values.faculty,
        };
        const departmentInfor = {
          department_name: values.department,
        };

        if (role === "admin") {
          const { error } = await supabase.from().insert();
          if (error) {
            console.error("Error writing to admin tables: ", error.message);
            throw error.message;
          } else {
            const { error: userError } = await supabase
              .from("USER_TABLE")
              .insert(studentData);
            const { error: facultyError } = await supabase
              .from("FACULTY_TABLE")
              .insert(facultyInfor);
            const { error: departmentError } = await supabase
              .from("DEPARTMENT_TABLE")
              .insert(departmentInfor);
            if (userError) {
              console.error("Error writing to USER_TABLE: ", userError.message);
            } else if (facultyError) {
              console.error("Error writing to FACULTY_TABLE: ", facultyError);
            } else if (departmentError) {
              console.error(
                "Error writing to DEPARTMENT_TABLE: ",
                departmentError
              );
            }
          }
        }

        alert(
          "Success writing to USER_TABLE, FACULTY_TABLE and DEPARTMENT_TABLE "
        );
      } catch (error) {
        console.error("Error adding to user table: ", error.message);
        alert(error.message);
        throw error;
      }
      console.log("submitted values: ", values);
      alert("Success creating account");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error(error.message);
      alert(error.message);
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
                  phone: ""
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
