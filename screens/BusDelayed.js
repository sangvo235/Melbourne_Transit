import { View, Text, StyleSheet, Modal, Pressable, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Card, Button } from "@rneui/themed"; //https://reactnativeelements.com/docs/installation - installing card from react native elements
import axios from "axios";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";



var stop = "";
var timeToStop = "";
var departedTime = "";
var delayed = false;
var delayedDepartedMessage = ""
var originalModalText = ""
var originaltext = ""


export default function BusDelayed(props) {
    const navigation = useNavigation();
    const [currentStop, setStop] = React.useState(stop);
    const [currentTimeToStop, setTimeToStop] = React.useState(timeToStop);
    const [lastDepartedTime, setDepartTime] = React.useState(departedTime);
    const [currentButton, setDelayButton] = React.useState("Delayed?");
    const [currentDelayedDepartedMessage, setDelayDepartedMessage] = React.useState(delayedDepartedMessage);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalTextMessage, setModalTextMessage] = React.useState(originalModalText)
    const [text, onChangeText] = React.useState(originaltext);


    async function FirebaseGetDataTest() {

        //https://firebase.google.com/docs/firestore/query-data/queries#node.js

        //https://softauthor.com/firebase-firestore-get-document-by-id/

        //create reference to a bus doc

        let returnedData1 = "";
        let returnedData2 = "";
        let returnedData3 = "";
        let output1 = ""
        let output2 = ""
        let output3 = ""

        const docRef = doc(db, "Bus", "Jayson Test");
        try {
            const docSnap = await getDoc(docRef);

            returnedData1 = docSnap.data().currentStop;

            output1 = returnedData1;


        }
        catch (error) { alert(error) }
        try {
            const docSnap = await getDoc(docRef);


            returnedData2 = docSnap.data().timeToNext;


            output2 = returnedData2;


        }
        catch (error) { alert(error) }
        try {
            const docSnap = await getDoc(docRef);

            returnedData3 = docSnap.data().departTime;
            output3 = returnedData3;
            output3 = output3.toDate().toLocaleTimeString() //have to convert timestamp to date String.

        }
        catch (error) { alert(error) }
        setStop(output1);
        setTimeToStop(output2);
        setDepartTime(output3);


    }


    function toggleDelay() {

        if (delayed == true) {
            setDelayButton("Delayed?")
            delayed = false
        }
        else {
            setDelayButton("Delay Ended?")
            delayed = true
        }

    }


    async function TestAPI() {

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

                var timeReturned = JSON.stringify(response.data.rows[0].elements[0].duration.value) //code to pull the time in seconds.
                var stringToInt = parseInt(timeReturned)
                var updateToTimeFormat = (stringToInt / 60).toString() + " minutes"

                return timeToStop = updateToTimeFormat

            }
            )
            .catch(function (error) {
                alert(error);
            });
    }

    async function FirebaseWriteDelayedTest() {


        if (delayed) {

            const docRef = doc(db, "Bus", "Jayson Test");
            try {
                const data = {
                    delayed: true,
                    timeToNext: "Delayed",
                    delayReason: modalTextMessage
                }
                updateDoc(docRef, data)
                setTimeToStop("Delayed")
                setDelayDepartedMessage("Delayed")
                setDepartTime("")
            }
            catch (error) { alert(error) }
        }
        else {
            //get time to next from API.


            // var updateTime = "";



            const docRef = doc(db, "Bus", "Jayson Test");

            // alert(updatedTimeToNext);
            try {
                const data = {
                    delayed: false,
                    timeToNext: timeToStop,
                    delayReason: ""
                }
                await updateDoc(docRef, data)
                FirebaseGetDataTest();
                setDelayDepartedMessage("")
            }
            catch (error) { alert(error) }
        }
    }

    async function revert() {

        toggleDelay();
        TestAPI()
        FirebaseWriteDelayedTest()

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
            <View style={{ flex: 2, backgroundColor: "#AA4A44" }}>
                {/* Card Component Properties: https://reactnativeelements.com/docs/components/card */}
                <Card  >
                    <View style={{ backgroundColor: "red", flexDirection: "row" }}>
                        <View style={{ flex: 4, backgroundColor: "green" }} >
                            <Text style={{ textAlign: "center", height: 50, textAlignVertical: "center" }} onLayout={() => FirebaseGetDataTest()}>Current Stop</Text>
                            {/* style={{ backgroundColor: "red", flexDirection: "column" }} */}
                        </View>
                        <View style={{ flex: 4, backgroundColor: "yellow", height: 50 }} >

                            <Text style={{ textAlign: "center", height: 50, textAlignVertical: "center" }}>{currentStop}</Text>
                        </View>
                    </View>
                </Card>
                <Card  >
                    <View style={{ backgroundColor: "red", flexDirection: "row" }}>
                        <View style={{ flex: 4, backgroundColor: "green" }} >
                            <Text style={{ textAlign: "center", height: 50, textAlignVertical: "center" }}>Time to Stop:</Text>
                            {/* style={{ backgroundColor: "red", flexDirection: "column" }} */}
                        </View>
                        <View style={{ flex: 4, backgroundColor: "yellow", height: 50 }} >

                            <Text style={{ textAlign: "center", height: 50, textAlignVertical: "center" }}>{currentTimeToStop}</Text>
                        </View>
                    </View>
                </Card>
                <Card  >
                    <View style={{ backgroundColor: "red", flexDirection: "row" }}>
                        <View style={{ flex: 4, backgroundColor: "green" }} >
                            <Text style={{ textAlign: "center", height: 50, textAlignVertical: "center" }}>Departed:</Text>
                            {/* style={{ backgroundColor: "red", flexDirection: "column" }} */}
                        </View>
                        <View style={{ flex: 4, backgroundColor: "yellow", height: 50 }} >

                            <Text style={{ textAlign: "center", height: 50, textAlignVertical: "center" }}>{lastDepartedTime}{currentDelayedDepartedMessage}</Text>
                        </View>
                    </View>
                </Card>
            </View>
            <View style={{ flex: 2, backgroundColor: "darkorange", }} >
                <View style={styles.buttonMain}>
                    <Button title={currentButton} size="lg" radius="md" raised="true" onPress={() => currentButton == "Delayed?" ? setModalVisible(true) : revert()} />
                    {/* https://reactnativeelements.com/docs/components/button */}

                </View>
                <View style={styles.centeredView}>
                    {/* Modal info from: https://www.positronx.io/react-native-modal-tutorial-with-examples/ */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            Alert.alert("Modal has been closed.");
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Bus Delay Details</Text>

                                {/* input form goes here. */}
                                <TextInput onChangeText={onChangeText} value={text} placeholder="State the reason for this delay." placeholderTextColor="lightgray" style={styles.input} onEndEditing={() => setModalTextMessage(text)}></TextInput>
                                <View style={styles.buttonMain}>
                                    <Button onPress={() => {

                                        //Write delayed to Time to Stop and Departed.
                                        //Read Delayed and set the fields to "Delayed."

                                        toggleDelay();
                                        TestAPI()
                                        FirebaseWriteDelayedTest()
                                        setModalVisible(!modalVisible)
                                    }}  >Submit Button</Button>
                                </View>

                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.textStyle}>Hide Modal</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.textStyle}>Show Modal</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 6,
        backgroundColor: "#eee",
    },

    buttonMain: {
        flex: 3,
        // alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 2
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        marginTop: 5
    },
    modalView: {
        flex: 1,
        marginTop: 340,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "stretch",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#2196F3",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"

    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#2196F3",
        fontSize: 25
    },
    input: {
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "gray",
        paddingHorizontal: 10,
        textAlign: "center",
        marginTop: 20
    }


});