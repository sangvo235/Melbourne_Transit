import React from 'react'
import { addDoc, setDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db, app } from '../firebase';


//Use all create functions in Arrival Update with appropriate Button.

export const createRoute = () => {


    const docRef = doc(db, "Route", "Glenferrie Route"); //put name here.

    const data = {

        Stops: []//figure out how to add array of references, but not now.
    }

    setDoc(docRef, data
    ).then(() => {
        console.log("DOC HAS BEEN ADDED");
    }).catch((e) => {
        console.log(e);
    })


}



