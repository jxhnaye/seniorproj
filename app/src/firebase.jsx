// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGBji_05mURbRHHabif-CLac-ooFm25EM",
  authDomain: "seniorproj-34f38.firebaseapp.com",
  projectId: "seniorproj-34f38",
  storageBucket: "seniorproj-34f38.firebasestorage.app",
  messagingSenderId: "197006047329",
  appId: "1:197006047329:web:74a4da73d8f6fb4f9d1220",
  measurementId: "G-GXW04HTD2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
