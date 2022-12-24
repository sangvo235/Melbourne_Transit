import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { Component } from "react";
import { Card, Button } from "@rneui/themed"; //https://reactnativeelements.com/docs/installation - installing card from react native elements
import CountDown from 'react-native-countdown-component'; //import react countdown: https://www.npmjs.com/package/react-native-countdown-component
//installing axios to manage API Requests. npm install axios
import axios from "axios";
import { db, GeoPoint } from "../firebase";
import { doc, getDoc, snap, updateDoc, setDoc, collection } from "firebase/firestore";
import { createStop } from "../authorization/createStop";
import { createRoute } from "../authorization/createRoute";
import { createBus } from "../authorization/createBus";

var message = "";
var stop = "Sunshine";
var timeToStop = 5;
var reset = "1";
var running = true;


export default function ArrivalTimeUpdate(props) {

    const navigation = useNavigation();

    const [myText, setMyText] = React.useState(message); //creating a function to update text and dynamically update on button click.
    const [currentStop, setStop] = React.useState(stop); //creating a function to update text and dynamically update on button click.

    const [style, setStyle] = React.useState({ opacity: 100 }); //setting visibility of the counter component.
    const [countdown, setTime] = React.useState(timeToStop); //setting new time of the counter component.
    const [resetValue, setReset] = React.useState(reset); //resetting the counter component.
    const [runningValue, setRunning] = React.useState(running); //pausing the counter component.


    async function FirebaseWriteTimeDataTest(time) {

        var updateTime = "";

        if (isNaN(time)) {
            updateTime = time;
            // alert("Got update time string.")
        }
        else {
            updateTime = (time / 60).toString() + " minutes"
            // alert("Got update time then converted to string.")
        }

        // https://softauthor.com/firebase-firestore-update-document-data-updatedoc/

        // create reference to a bus doc

        const docRef = doc(db, "Bus", "Jayson Test");
        try {
            const data = {
                timeToNext: updateTime
            }
            updateDoc(docRef, data).then(docRef => {
                // alert("A New Document Field has been added to an existing document");
            })
        }
        catch (error) { alert(error) }

    }

    async function FirebaseWriteStopDataTest(stop) {


        // https://softauthor.com/firebase-firestore-update-document-data-updatedoc/

        // create reference to a bus doc

        const docRef = doc(db, "Bus", "Jayson Test");
        try {
            const data = {
                currentStop: stop
            }
            updateDoc(docRef, data).then(docRef => {
                // alert("A New Document Field has been added to an existing document");
            })
        }
        catch (error) { alert(error) }

    }



    async function FirebaseGetDataTestOld() {

        //https://firebase.google.com/docs/firestore/query-data/queries#node.js

        //https://softauthor.com/firebase-firestore-get-document-by-id/

        //create reference to a bus doc

        let returnedData = "";
        let output = ""

        const docRef = doc(db, "Bus", "iOipS6kW76iDQODCUOuN");
        try {
            const docSnap = await getDoc(docRef);
            // alert(docSnap.data().capasity); //get bus capcity data
            returnedData = docSnap.data().currentStop.id; //get bus stop REFERENCE data. https://firebase.google.com/docs/reference/js/v8/firebase.firestore.DocumentReference
            // alert(docSnap.data().id); //get bus id data

        }
        catch (error) { alert(error) }

        // alert(returnedData);
        const stopNameRef = doc(db, "Stop", returnedData); //use the stop ID to query the stop collection and get the stop name.
        try {
            const stopSnap = await getDoc(stopNameRef);
            const returnedStopData = stopSnap.data().name; //get bus stop REFERENCE data. https://firebase.google.com/docs/reference/js/v8/firebase.firestore.DocumentReference
            output = returnedStopData
        }
        catch (error) { alert(error) }

        return output;

    }
    async function FirebaseGetDataTest() {

        //https://firebase.google.com/docs/firestore/query-data/queries#node.js

        //https://softauthor.com/firebase-firestore-get-document-by-id/

        //create reference to a bus doc

        let returnedData = "";
        let output = ""

        const docRef = doc(db, "Bus", "Jayson Test");
        try {
            const docSnap = await getDoc(docRef);

            returnedData = docSnap.data().currentStop;
            output = returnedData

        }
        catch (error) { alert(error) }

        return output;

    }

    function TestAPI() {

        //https://developers.google.com/maps/documentation/distance-matrix/distance-matrix#maps_http_distancematrix_bicycling-js


        // https://www.latlong.net/convert-address-to-lat-long.html


        //Sunshine Lat and Long: (-37.788830, 144.834360)

        //Ardeer Lat and Long: (-37.773240, 144.799480)


        var config = {
            method: 'get',
            url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=-37.788830%2C144.834360&destinations=-37.773240%2C144.799480&key=AIzaSyCLzguH1NtS7s2O1EwpeuxTmsSl4Im5I3c',
            headers: {}
        };

        axios(config)
            .then(function (response) {

                var timeToNext = JSON.stringify(response.data.rows[0].elements[0].duration.value) //code to pull the time in seconds.
                timeToNext = parseInt(timeToNext);
                setTime(timeToNext);
                FirebaseWriteTimeDataTest(timeToNext)
                reset = reset + "1";
                setReset(reset);
                setRunning(false);
                returnNewCountdown();

            })
            .catch(function (error) {
                alert(error);
            });
    }

    function updateMessageCountdown() {


        if (message.localeCompare("") == 0) {

            message = "At Stop"
            FirebaseWriteStopDataTest(message)
            FirebaseWriteTimeDataTest(message)
        };
        reset = reset + "1";
        timeToStop = 8; //preload the time to the next countdown here.

        setTime(timeToStop);
        setReset(reset);
        setRunning(false); //pause until the bus departs.
        setMyText(message);
        setStyle({ opacity: 0 }) //make counter invisible until bus departs.
    }

    function returnNewCountdown() {

        message = "";
        setMyText(message);
        setStyle({ opacity: 100 }) //make counter visible again.
        setRunning(true); //unpause.
    }


    // function updateMessageDepart() {

    //     if (message.localeCompare("At Stop") == 0) {
    //         message = "Departed"
    //     };

    //     setMyText(message);
    // }

    async function updateStop() {

        stop = "Ardeer"; //input next stop here.
        FirebaseWriteStopDataTest(stop)//write the stop to the database--to be replaced by getting next stop from list.


        var readStop = await FirebaseGetDataTest() //read the stop from the database

        setStop(readStop); //set the stop from the database.
    }

    return (
        <View
            style={[
                styles.container,
                {
                    // Try setting `flexDirection` to `"row"`.
                    flexDirection: "column",
                },
            ]}
        >

            <View View style={{ flex: 2, backgroundColor: "darkorange", }
            }>
                <View style={styles.button}>
                    {/* <Button title="Depart Bus" size="lg" radius="md" raised="false" onPress={() => {
                        
                        // TestAPI();
                        // updateStop();

                        // // returnNewCountdown();


                    }} /> */}
                    <Button title="Create Bus" size="lg" radius="md" onPress={() => {
                        createBus()
                    }} />
                    <Button title="Create Route" size="lg" radius="md" onPress={() => {
                        createRoute()
                    }} />
                    <Button title="Create Stop" size="lg" radius="md" onPress={() => {
                        createStop()
                    }} />
                    {/* <Button title="Test Firebase to Post At Stop" size="lg" radius="md" raised="false" onPress={() => {

                        // FirebaseGetDataTest();
                        FirebaseWriteTimeDataTest("At Stop");

                        //works

                    }} /> */}

                    {/* https://reactnativeelements.com/docs/components/button */}
                </View>
            </View >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 6,
        backgroundColor: "#eee",
    },
    button: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 5
    },
});