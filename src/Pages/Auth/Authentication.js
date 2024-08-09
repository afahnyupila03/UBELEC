import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { AppState } from "../../Store";

export default function AuthenticationPage() {
  const { createUserHandler, signInUser } = AppState();
  const [newUser, setNewUser] = useState(false);

  const createAccount = async (values, actions) => {
    try {
      await createUserHandler(
        values.email,
        values.password,
        values.firstName,
        values.lastName
      );
      actions.resetForm({
        values: {
          email: "",
          firstName: "",
          lastName: "",
          password: "",
        },
      });
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
                }
              : {
                  email: "",
                  password: "",
                }
          }
          onSubmit={newUser ? createAccount : loginAccount}
        >
          {({ values, handleChange, handleBlur, submitting }) => (
            <Form>
              <Field
                type="email"
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
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.firstName}
                    placeholder="Enter First Name"
                    label="Enter First Name"
                  />
                  <Field
                    type="text"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.lastName}
                    placeholder="Enter Last Name"
                    label="Enter Last Name"
                  />
                </>
              )}
              <Field
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                placeholder="Enter Password"
                label="Enter Password"
              />

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
                <button type="submit">
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
