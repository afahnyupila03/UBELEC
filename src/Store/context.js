import React, { useEffect, useState, useReducer } from "react";
import supabase, { auth } from "../Configs/supabase";

const CONSTANTS = {
  SIGN_UP: "SIGN_UP",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
  SET_USER: "SET_USER",
  ERROR: "ERROR",
};

export const Context = React.createContext();

export const defaultAppState = {
  user: null,
  error: null,
};

export const Reducer = (state, action) => {
  switch (action.type) {
    case CONSTANTS.SIGN_UP:
    case CONSTANTS.SIGN_IN:
      return {
        ...state,
        user: action.payload.user,
        error: null,
      };
    case CONSTANTS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
      };
    case CONSTANTS.SIGN_OUT:
      return {
        ...state,
        user: null,
        error: null,
      };
    case CONSTANTS.ERROR:
      return {
        ...state,
        error: action.payload.error,
      };

    default:
      return state;
  }
};

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, defaultAppState);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("App Event: ", event);
      console.log("App session: ", session);
      if (
        event === CONSTANTS.SIGN_IN ||
        event === CONSTANTS.SIGN_UP ||
        session
      ) {
        setSession(session);
        dispatch({
          type: CONSTANTS.SET_USER,
          payload: { user: session },
        });
      } else if (event === CONSTANTS.SIGN_OUT) {
        setSession(null);
        dispatch({ type: CONSTANTS.SIGN_OUT });
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const createUserHandler = async (
    email,
    password,
    firstName,
    lastName,
    role,
    redirectLink,
    phone
  ) => {
    try {
      const { data, error } = await auth.signUp({
        email,
        password,
        role,
        options: {
          data: {
            user: {
              role,
              phone,
            },
            phone,
            identities: [{ identity_data: { email_verified: true } }],
            firstName,
            lastName,
            role,
            email_verified: true,
            user_metadata: {
              role,
              email_verified: true,
              phone_verified: true,
              phone,
            },
            redirectTo: redirectLink,
          },
        },
      });

      if (error) {
        console.error("error creating user account: ", error);
        throw error;
      }

      dispatch({
        type: CONSTANTS.SIGN_UP,
        payload: { user: data.user },
      });
      return { user: data.user };
    } catch (error) {
      console.error(error.message);
      dispatch({
        type: CONSTANTS.ERROR,
        payload: { error },
      });
      throw error;
    }
  };

  const signInUser = async (email, password, redirectLink) => {
    try {
      const { data, error } = await auth.signInWithPassword({
        email,
        password,
        options: {
          data: {
            redirectTo: redirectLink,
          },
        },
      });

      if (error) {
        console.error("Error logging in to account: ", error);
        throw error;
      }

      dispatch({
        type: CONSTANTS.SIGN_IN,
        payload: { user: data.user },
      });
      return { user: data.user };
    } catch (error) {
      console.error(error.message);
      dispatch({
        type: CONSTANTS.ERROR,
        payload: { error },
      });
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      const { error } = await auth.signOut();

      if (error) {
        console.error("Error logging out of account: ", error);
        throw error;
      }

      dispatch({
        type: CONSTANTS.SIGN_OUT,
      });
    } catch (error) {
      console.error(error.message);
      dispatch({
        type: CONSTANTS.ERROR,
        payload: { error },
      });
      throw error;
    }
  };

  const value = {
    user: session,
    error: state.error,
    signInUser,
    signOutUser,
    createUserHandler,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
