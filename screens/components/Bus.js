import React from 'react'
import { Button, StyleSheet, Text, View, SafeAreaView, Pressable, Image } from "react-native";
import { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, app } from '../../firebase';
import { images } from '../../images'
import CountDown from 'react-native-countdown-component';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

var reset = "1";
var running = true;
var message = "";

const Bus = (props) => {

    const [style, setStyle] = React.useState({ opacity: 100 }); //setting visibility of the counter component.
    const [countdown, setTime] = useState(0);
    const [resetValue, setReset] = React.useState(reset); //resetting the counter component.
    const [runningValue, setRunning] = React.useState(running); //pausing the counter component.
    const [myText, setMyText] = React.useState(message); //creating a function to update text.
    const [countdownTime, setCountdownTime] = React.useState(); //creating a function to update text.


    const navigation = useNavigation();
    const [passenger, setPassenger] = useState();
    //   const [currentStop, setCurrentStop] = useState();
    //   const [capacity, setCapacity] = useState();
    const [route, setRoute] = useState();
    //   const [departure, setDeparture] = useState();
    const [isExpress, setIsExpress] = useState(false);

    const [capacity, setCapacity] = useState();
    const [busImage, setBusImage] = useState()

    onSnapshot(doc(db, "Bus", props.id), (doc) => {
        setPassenger(doc.data().passengers);
        // setCurrentStop(doc.data().currentStop);
        setCapacity(doc.data().capacity);
        setRoute(doc.data().route.id);
        setIsExpress(doc.data().isExpress);
        setTime(doc.data().timeToDestination);
    })
    useEffect(() => {
        checkBusImage() //continusly checking the bus image state .
        //continuously check if time to destination changes
    })
    function handlePress() {
        navigateToDetails();
        // alert(countdown);

    }
    function checkBusImage() {
        //if passengers = 0, show empty bus.
        if (passenger == 0) {
            setBusImage(0)
        }
        if ((passenger > 0) && (passenger <= 10)) {
            setBusImage(1)
        }
        else if ((passenger > 10) && (passenger < ((capacity) * 3 / 4))) {
            //if passengers between 10 and 3/4 show mid bus
            setBusImage(2)
        }
        else if (passenger > ((capacity) * 3 / 4)) {
            setBusImage(3)
        }
    }
    useEffect(() => {
        resetTimer() //resets the timer each time the countdown changes.
    }, [countdown])

    function resetTimer() {

        reset = reset + "1";
        setReset(reset);
    }

    function navigateToDetails() {

        navigation.navigate("Bus Details", { busID: props.id, busTime: countdownTime })
    }

    return (
        <Pressable style={styles.busbox} onPress={() => handlePress()}>
            <View style={styles.busInfo}>
                <View style={styles.busID}>
                    <Text>Bus ID: {props.id}</Text>
                </View>
                <View style={styles.busInfo}>
                    <Text>Route: {route}</Text>
                    <Text>Passengers: {passenger}</Text>
                    <Text>{isExpress ? "Express bus" : "Stop all stations"}</Text>
                </View>
            </View>
            <Image style={styles.bus} source={images[busImage]} />
            <View style={styles.rectangle}>
                {/* Component Description: https://www.npmjs.com/package/react-native-countdown-component */}
                <CountDown
                    until={countdown} //{60 * 1 + 30} - 1min, 30 secs; input time to destination data
                    // onFinish={} - define if necessary.
                    size={26}
                    timeToShow={['M']}
                    digitStyle={{ backgroundColor: '#dddddd' }}
                    digitTxtStyle={{ color: '#1CC625' }}
                    style={style}
                    id={resetValue}
                    running={runningValue}
                    onChange={(time) => {
                        setCountdownTime(`${time}`) //set the current countdown time.
                        // console.log(countdownTime) //print the current countdown time.
                    }}
                />
                <Text>{myText}</Text>

            </View>
        </Pressable>
    )
}
export default Bus
const styles = StyleSheet.create({
    header: {
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    headerfont: {
        fontSize: 20
    },
    alert: {
        height: 50,
        backgroundColor: '#fd9113',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginBottom: 10
    },
    logo: {
        width: 300,
        height: 100
    },
    bus: {
        width: 70,
        height: 70,
        opacity: 100,
    },
    busbox: {
        backgroundColor: '#dddddd',
        height: 100,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        margin: 10,
        flexDirection: "row",
        shadowRadius: 1,
        shadowOpacity: 0.5,
    },
    icon: {
        width: 30,
        height: 30
    },
    busID: {
        borderRadius: 5,
        borderWidth: 1,
        padding: 4,
        marginBottom: 5,
        alignItems: 'center'
    },
    busInfo: {
        alignItems: 'flex-start',
        flexDirection: 'column'
    },
    rectangle: {
        height: 75,
        width: 75,
        backgroundColor: '#dddddd',
        borderRadius: 10,
    },
}

);
