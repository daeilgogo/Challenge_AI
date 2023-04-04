// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOIypxdVlfM7FHGa-ifoCSgub86Nmrfc8",
  authDomain: "ai-pro-636e7.firebaseapp.com",
  projectId: "ai-pro-636e7",
  storageBucket: "ai-pro-636e7.appspot.com",
  messagingSenderId: "514363380786",
  appId: "1:514363380786:web:7de9cb6cabc004f396d82b",
  measurementId: "G-FDP8NEDXC1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
