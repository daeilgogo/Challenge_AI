// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBOIypxdVlfM7FHGa-ifoCSgub86Nmrfc8",
  authDomain: "ai-pro-636e7.firebaseapp.com",
  projectId: "ai-pro-636e7",
  storageBucket: "ai-pro-636e7.appspot.com",
  messagingSenderId: "514363380786",
  appId: "1:514363380786:web:7de9cb6cabc004f396d82b",
  measurementId: "G-FDP8NEDXC1"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyBw8EiVCTOSAZKU_CN60fC3-OwBQujCSl8",
//   authDomain: "randa-pro.firebaseapp.com",
//   projectId: "randa-pro",
//   storageBucket: "randa-pro.appspot.com",
//   messagingSenderId: "219626451280",
//   appId: "1:219626451280:web:5e7ffe267a26ff3afc3c55",
//   measurementId: "G-L6SSH4SERX"
// };


// Initialize Firebase
const app = initializeApp(firebaseConfig);


if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}

export {firebase};
export const auth = getAuth(app);

