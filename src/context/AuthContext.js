import { useContext, createContext, useEffect, useState } from "react";
import { auth } from '../firebase'
import {
    GoogleAuthProvider, signInWithPopup,
    signInWithRedirect, signOut, onAuthStateChanged
} from "firebase/auth";
import { firebase } from "../firebase";
import { doc } from "@firebase/firestore";



const AuthContext = createContext()
export const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState({})

    const googleSignIn = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const result = await firebase.auth().signInWithPopup(provider);
            const { user } = result
            const db = firebase.firestore();
            const userRef = db.collection('users').doc(user.uid);

            //이미 존재하는 유저인지 확인
            const docSnapshot = await userRef.get();
            console.log('User exist: ' + docSnapshot.exists)

            //존재하지 않는 유저일 때만 유저 정보 추가
            if (!docSnapshot.exists) {
                await userRef.set({
                    Name: user.displayName,
                    Email: user.email,
                    Photo: user.photoURL,
                    Score: '0'
                }, { merge: true });

                console.log('User added')
            };

        } catch (error) {
            console.log(error)
        }
    };

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
        <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}