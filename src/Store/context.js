import React, { useEffect, useReducer } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateCurrentUser,
  signOut,
} from "firebase/auth";
import { auth } from "../Configs/firebase";

const CONSTANTS = {
  SIGN_UP: "SIGN_UP",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
  SET_USER: "SET_USER",
  ERROR: "ERROR",
};

export const Context = React.createContext();

export const defaultAppState = {};

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

  useEffect(() => {
    const onSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({
          type: CONSTANTS.SET_USER,
          payload: { user },
        });
      } else {
        dispatch({
          type: CONSTANTS.SIGN_OUT,
        });
      }
    });
    return () => onSubscribe;
  }, []);

  const createUserHandler = async (email, password, firstName, lastName) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
        
      );
      await updateCurrentUser(userCredentials.user, {
        displayName: `${firstName} ${lastName}`,
        
      });
      dispatch({
        type: CONSTANTS.SIGN_UP,
        payload: { user: userCredentials.user },
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

  const signInUser = async (email, password) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch({
        type: CONSTANTS.SIGN_IN,
        payload: { user: userCredentials.user },
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

  const signOutUser = async () => {
    try {
      await signOut();
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
    user: state.user,
    error: state.error,
    signInUser,
    signOutUser,
    createUserHandler,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
