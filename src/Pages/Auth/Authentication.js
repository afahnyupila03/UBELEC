import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { AppState } from "../../Store";
import { useLocation, useNavigate } from "react-router-dom";
import { SchoolPrograms } from "../../Constants/index";
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

      // Define data to be inserted into USER_TABLE
      const studentData = {
        user_id: userId,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone: values.phone,
        faculty_name: values.faculty,
        department_name: values.department,
      };

      const adminData = {
        admin_id: userId,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone: values.phone,
        faculty_name: values.faculty,
        department_name: values.department,
      };

      if (role === "admin") {
        const { error: adminError } = await supabase
          .from("ADMIN_TABLE")
          .insert([adminData]);
        if (adminError) {
          throw new Error(
            `Error writing to ADMIN_TABLE: ${adminError.message}`
          );
        }
      } else {
        // Insert into USER_TABLE
        const { error: userError } = await supabase
          .from("USER_TABLE")
          .insert([studentData]);

        if (userError) {
          throw new Error(`Error writing to USER_TABLE: ${userError.message}`);
        }
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
                      handleChange(e);
                      setSelectedFaculty(selected);
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
