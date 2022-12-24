import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {getFirestore} from "firebase/firestore";

//JATTY WROTE
const firebaseConfig = {
    apiKey: "AIzaSyCkUU4dKAouKjncYk0CvN33Oo0P4rSzoL4",
    authDomain: "meltransit-fbf38.firebaseapp.com",
    projectId: "meltransit-fbf38",
    storageBucket: "meltransit-fbf38.appspot.com",
    messagingSenderId: "680422626476",
    appId: "1:680422626476:web:67fabc90b711800b1b7b09",
    measurementId: "G-88B2GLKVRN"
};

export const app = initializeApp(firebaseConfig);

//FOR REST OPERATION -> CONNECT TO THE DATABASE.
export const db = getFirestore(app);

export const auth = getAuth(app);