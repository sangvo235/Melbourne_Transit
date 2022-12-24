import React from 'react'
import { addDoc, setDoc, collection, doc, getDoc, } from 'firebase/firestore';
import { db, app } from '../firebase';


//Use all create functions in Arrival Update with appropriate Button.

export const createBus = () => {


    const docRef = doc(db, "Bus", "Bus006"); //put name here.

    const data = {

        isDeployed: true,
        capacity: 80,
        isExpress: true,
        passengers: 43,
        route: "something", //to solve but not for now.
        comments: "",
        currentStop: "something", //figure out how to add reference
        delayReason: "",
        departure: Date(),
        id: "Bus006",
        stopPointer: 0,
        timeToDestination: ""//change to number
    }

    setDoc(docRef, data
    ).then(() => {
        console.log("DOC HAS BEEN ADDED");
    }).catch((e) => {
        console.log(e);
    })


}



