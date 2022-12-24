import { View, Text, StyleSheet, Button, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, getDoc, onSnapshot, setDoc, updateDoc, snap } from 'firebase/firestore';
import { db } from '../firebase';
import axios from "axios";
import CountDown from 'react-native-countdown-component';
import { useNavigation } from '@react-navigation/native';


var timeToStop = 10; //adjust for testing.
var reset = "1";
var running = true;
var message = "";
var busId = ""


//props can be ID to find a bus.
export default function BusDetail({ route, navigation }) {

  const nav = useNavigation();
  //Test Realtime Data
  const [rego, setRego] = useState();
  const [passenger, setPassenger] = useState();
  const [currentStop, setCurrentStop] = useState();
  const [capacity, setCapacity] = useState();
  const [busRoute, setRoute] = useState();
  const [departure, setDeparture] = useState();
  const [delayReason, setDelayReson] = useState();

  //setting useStates for components for Countdown.
  const [style, setStyle] = React.useState({ opacity: 100 }); //setting visibility of the counter component.
  const [countdown, setTime] = React.useState(0); //setting new time of the counter component.
  const [resetValue, setReset] = React.useState(reset); //resetting the counter component.
  const [runningValue, setRunning] = React.useState(running); //pausing the counter component.
  const [myText, setMyText] = React.useState(message); //creating a function to update text.

  useEffect(() => {

    const busId = route.params.busID;
    const busTime = route.params.busTime;

    onSnapshot(doc(db, "Bus", busId), (doc) => {
      setRego(doc.data().id);
      setPassenger(doc.data().passengers);
      setCurrentStop(doc.data().currentStop);
      setCapacity(doc.data().capacity);
      setRoute(doc.data().route.id);
      setDelayReson(doc.data().delayReason);

      // var updatedTime = parseInt(doc.data().timeToDestination); Old method gets time from database.
      var updatedTime = busTime; //New method gets time from

      setTime(updatedTime);

      if (updatedTime != countdown) {
        setReset(resetValue + 1);
        setMyText("");
        setStyle({ opacity: 100 }) //make counter visible again.
        setRunning(true); //unpause.
      }


      const date = doc.data().departure.seconds;
      const time = new Date(date * 1000);
      const hours = time.getHours();
      const mins = time.getMinutes();
      const sec = time.getSeconds();
      setDeparture(hours + ":" + mins + ":" + sec);
    })



  }, [route]);


  async function FirebaseWriteStopData(stop) {


    // https://softauthor.com/firebase-firestore-update-document-data-updatedoc/

    // create reference to a bus doc

    const docRef = doc(db, "Bus", busId);
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

  async function FirebaseWriteTimeData(time) {


    const docRef = doc(db, "Bus", busId);
    try {
      const data = {
        timeToDestination: updateTime
      }
      updateDoc(docRef, data)
    }
    catch (error) { alert(error) }

  }



  function countdownEnd() {


    if (message.localeCompare("") == 0) {

      message = "At Stop"
      FirebaseWriteStopData(message)
      FirebaseWriteTimeData(0)
    };
    reset = reset + "1";

    setTime(timeToStop);
    setReset(reset);
    setRunning(false); //pause until the bus departs.
    setMyText(message);
    setStyle({ opacity: 0 }) //make counter invisible until bus departs.
  }

  const navigateToUpdateBusDetail = () => {
    nav.navigate("Bus Update Form", { busID: rego })
  }
  return (

    <ScrollView className="bg-white">
      <View className="flex mt-2 h-full items-center justify-center bg-white ">
        <View className="flex-row border-2 border-[#4682b4] mt-3 w-40 h-20 justify-center items-center rounded-3xl">

          <Text className="text-[#4682b4] text-3xl font-bold">{rego}</Text>
        </View>
        <View className="flex-row items-center w-11/12 h-12 mt-6 mb-3 justify-between bg-[#d3d3d3]">
          <Text className="ml-3 text-xl">Route: </Text>
          <Text className="mr-3 font-bold text-l">{busRoute}</Text>
        </View>
        <View className="flex-row items-center w-11/12 h-12 mt-6 mb-3 justify-between bg-[#d3d3d3]">
          <Text className="ml-3 text-xl">Current Stop: </Text>
          <Text className="mr-3 font-bold text-l">{currentStop}</Text>
        </View>
        <View className="flex-row items-center w-11/12 h-12 mt-6 mb-3 justify-between bg-[#d3d3d3]">
          <Text className="ml-3 text-xl">Time to Arrival: </Text>
          <Text className="mr-3 font-bold text-l">
            {/* Jayson working on this. Ignore current gross formatting */}
            <View style={{ flex: 4, backgroundColor: "rgb(231, 229, 228)", height: 50 }} >
              <View style={{ flex: 1, justifyContent: 'center', opacity: 100 }}>
                {/* Component Description: https://www.npmjs.com/package/react-native-countdown-component */}
                <CountDown
                  until={countdown} //{60 * 1 + 30} - 1min, 30 secs
                  onFinish={() => countdownEnd()}
                  onPress={() => alert(countdown)}
                  size={15}
                  timeToShow={['M']}
                  digitStyle={{ backgroundColor: 'lightgrey' }}
                  digitTxtStyle={{ color: 'black' }}
                  style={style}
                  id={resetValue}
                  running={runningValue}
                />
                {/* <Text>{myText}</Text> */}
              </View>
            </View>
          </Text>
        </View>
        <View className="flex-row items-center w-11/12 h-12 mt-6 mb-3 justify-between bg-[#d3d3d3]">
          <Text className="ml-3 text-xl">Departed at: </Text>
          <Text className="mr-3 font-bold text-l">{departure}</Text>
        </View>
        <View className="flex-row items-center w-11/12 h-12 mt-6 mb-3 justify-between bg-[#d3d3d3]">
          <Text className="ml-3 text-xl">Current capacity: </Text>
          <Text className="mr-3 font-bold text-l">{passenger}/{capacity}</Text>
        </View>

        <View className="flex-row items-center w-11/12 h-12 mt-6 mb-3 justify-between bg-[#d3d3d3]">
          <Text className="ml-3 text-xl">Note/Delay reason: </Text>
          <Text className="mr-3 font-bold text-l">{delayReason}</Text>
        </View>

        <TouchableOpacity
          className="w-48 h-12 items-center justify-center rounded-lg mt-4 bg-[#4682b4]"
          onPress={navigateToUpdateBusDetail}
        >
          <Text className="text-white">EDIT BUS DATA</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
