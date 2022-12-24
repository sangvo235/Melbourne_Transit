import React from 'react'
import { addDoc, setDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db, app } from '../firebase';


//Use all create functions in Arrival Update with appropriate Button.

export const createStop = () => {


    const docRef = doc(db, "Stop", "Glenferrie Station"); //put name here.

    const data = {

        geopoint: ""//figure out how to add geopoint, but not now.
    }

    setDoc(docRef, data
    ).then(() => {
        console.log("DOC HAS BEEN ADDED");
    }).catch((e) => {
        console.log(e);
    })


}



