import React from 'react'
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db, app } from '../firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

//JATTY
//FOR TESTING CREAUSER ONLY
export const createUser = () => {
  const auth = getAuth(app);

  //we can get email and password from The form.
  createUserWithEmailAndPassword(auth, "test15@gmail.com", "123456ABC").then((userCredential) => {
    const user = userCredential.user;

    const docRef = doc(db, "users", user.email);

    const data = {
      //we can put more detail to store in the database.
      id: user.uid,
      email: user.email,
    }

    setDoc(docRef, data
    ).then(data => {
      console.log("DOC HAS BEEN ADDED");
    }).catch((e) => {
      console.log(e);
    })

  }).catch((e) => {
    const errorCode = e.code;
    const errorMessage = e.message;
    console.log(errorCode);
    console.log(errorMessage);
  })


}



