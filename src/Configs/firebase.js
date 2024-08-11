// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaPU9x3qlEetDcSsAf4dmRYgwB99ZgWUw",
  authDomain: "ub-voting-system.firebaseapp.com",
  projectId: "ub-voting-system",
  storageBucket: "ub-voting-system.appspot.com",
  messagingSenderId: "192448344465",
  appId: "1:192448344465:web:d72dcd942a3334b617aa30",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
