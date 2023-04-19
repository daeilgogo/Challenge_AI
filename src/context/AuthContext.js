import { useContext,createContext, useEffect, useState } from "react";
import {auth} from '../firebase'
import { GoogleAuthProvider, signInWithPopup,
signInWithRedirect,signOut,onAuthStateChanged } from "firebase/auth";
import { firebase } from "../firebase";



const AuthContext=createContext()
export const AuthContextProvider=({children})=>{

    const [user,setUser]=useState({})

    const googleSignIn=async()=>{
       const provider = new firebase.auth.GoogleAuthProvider();
       try {
        const result = await firebase.auth().signInWithPopup(provider);
        const {user} =result
        const db = firebase.firestore();
        const userRef = db.collection('users').doc(user.uid);
        await userRef.set({
         Name: user.displayName,
         Email: user.email,
         Photo: user.photoURL,
         Score:'0'
       }, { merge: true });
      
       } catch (error) {
        console.log(error)
       }
     
        
  
     
    };


    const logOut=()=>{
        signOut(auth)  
    }

    useEffect(()=>{
        const unsubcribe =onAuthStateChanged(auth,(currentUser)=>{
           setUser(currentUser)
           console.log('User',currentUser)
        });
        return()=>{
            unsubcribe();
        }
    },[])

    return(
        <AuthContext.Provider value={{googleSignIn,logOut,user}}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth=()=>{
    return useContext(AuthContext)
}