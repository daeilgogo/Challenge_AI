import { useContext, createContext, useEffect, useState } from "react";
import { auth } from '../firebase'
import {
  GoogleAuthProvider, signInWithPopup,
  signInWithRedirect, signOut, onAuthStateChanged
} from "firebase/auth";
import { firebase } from "../firebase";

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({})
  
  const googleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.log(error)
    }};

  /////////////////////////////////
  const [score, setScore] = useState(0);


  useEffect(() => {
    if (user) {
      const db = firebase.firestore();
      // Récupérer le score de l'utilisateur depuis Firestore
      const unsubscribe = db.collection('users').doc(user.uid)
        .onSnapshot(doc => {
          if (doc.exists) {
            setScore(doc.data().score);
          } else {
            // Initialiser le score à 0 pour un nouvel utilisateur
            db.collection('users').doc(user.uid).set({
              Name: user.displayName,
              Email: user.email,
              Photo: user.photoURL,
              Coins: 500,
              Tutorial:false,
              Level_1:0, 
              Level_2:0, 
              Level_3:0,
              
            }, { merge: true })
              .then(() => {
                console.log("Score initialized!");
                setScore(0);
              })
              .catch((error) => {
                console.error("Error initializing score: ", error);
              });
          }
        });

      return () => unsubscribe();
    }
  }, [user]);
  //////////////////////////

  const logOut = () => {
    signOut(auth)
  }

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      console.log('User', currentUser)
    });
    return () => {
      unsubcribe();
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const UserAuth = () => {
  return useContext(AuthContext)
}