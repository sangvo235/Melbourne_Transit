import { View, Text, TextInput, StyleSheet, Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import s from "../styles/styles";
import { db } from "../firebase";
import axios from "axios";


import { query, collection, where, doc, getDocs, getDoc, updateDoc } from "firebase/firestore";
import { async } from "@firebase/util";

let returnedRouteData = "";
let thisReturnedStopData = "";
let nextReturnedStopData = "";
let ourReturnedStopData = "";
let thisReturnedStopName = ""
let nextReturnedStopName = ""
let ourReturnedStopName = "";
var queryString = "";
var thisReturnedStopLatitude = 0;
var thisReturnedStopLongitude = 0;
var ourReturnedStopLatitude = 0;
var ourReturnedStopLongitude = 0;


export default function BusUpdateForm({ route, navigation }) {
  const nav = useNavigation();

  //TODO: Set starting count from bus data
  const [passengerCount, setPassengerCount] = useState(0);
  const [comments, setComments] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(0);
  const [currentStop, setCurrentStop] = useState("");
  const [stopPointer, setStopPointer] = useState(0); //This points to the current stop from the database. Adjust initial value to start from different points.
  const [originLat, setOriginLat] = useState(0); //This points to the current stop from the database. Adjust initial value to start from different points.
  const [originLong, setOriginLong] = useState(0); //This points to the current stop from the database. Adjust initial value to start from different points.
  const [destinationLat, setDestinationLat] = useState(0); //This points to the current stop from the database. Adjust initial value to start from different points.
  const [destinationLong, setDestinationLong] = useState(0); //This points to the current stop from the database. Adjust initial value to start from different points.
  const [numberOfStops, setNumberOfStops] = useState(0); //This points to the current stop from the database. Adjust initial value to start from different points.

  const [busData, setBusData] = useState({});
  const [busId, setBusId] = useState("");
  const [countdown, setTime] = useState(0); //setting new time of the counter component.

  const isFirstRender = useRef(true);


  const fetchBusData = async function (bus) {

    const docRef = doc(db, "Bus", bus);

    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const foundBusData = docSnap.data()
      //Set States for everything we need for a given bus.

      setPassengerCount(foundBusData.passengers.toString()) //this is weird. Talk to Chris.
      setComments(foundBusData.comments)
      setMaxCapacity(foundBusData.capacity)
      setBusData(foundBusData)
      setStopPointer(foundBusData.stopPointer)

      returnedRouteData = foundBusData.route.id
      console.log(returnedRouteData);

    } else {
      console.log("Error bus not found")
    }
    //Get the Stop at position in database of the route
    if (returnedRouteData != "") {
      const routeNameRef = doc(db, "Route", returnedRouteData);
      const routeSnap = await getDoc(routeNameRef);

      var totalStops = parseInt(routeSnap.data().Stops.length);

      // console.log(totalStops);
      // // console.log(routeSnap.data());

      setNumberOfStops(totalStops);


      if ((stopPointer < totalStops) || (stopPointer == 0)) { //Checking to see we haven't passed our total number of stops.

        thisReturnedStopData = routeSnap.data().Stops[stopPointer].id //get the id of the route line Stop at position in database.
        setCurrentStop(thisReturnedStopData); //since counting is delayed till re-render, need to set the stop as one further than the counter.

        if (returnedRouteData.includes("Route")) {
          console.log("Not Express bus.");
          ourReturnedStopData = routeSnap.data().Stops[4].id //Setting static value of next to final stop at Hawthorn at the moment. Stop 4 in route is final.
        }
        if (returnedRouteData.includes("Express")) {
          console.log("Express bus.");
          ourReturnedStopData = routeSnap.data().Stops[2].id //Setting static value of next to final stop at Hawthorn at the moment. Stop 2 for express is final..
        }
      }
      else {
        console.log("You've come to the end of the line, friend.")

      }



    }
    else {
      console.log("Error Route not found")
    }
    //Get the name, and location of the current stop (originally position 0)
    if (thisReturnedStopData != "") {

      const thisStopNameRef = doc(db, "Stop", thisReturnedStopData);
      const thisStopSnap = await getDoc(thisStopNameRef);
      thisReturnedStopLatitude = thisStopSnap.data().geopoint["latitude"]
      setOriginLat(thisReturnedStopLatitude)
      thisReturnedStopLongitude = thisStopSnap.data().geopoint["longitude"]
      setOriginLong(thisReturnedStopLongitude);
    }
    else {
      console.log("Error first stop name not found")
    }

    if (ourReturnedStopData != "") {
      const ourStopNameRef = doc(db, "Stop", ourReturnedStopData);
      const ourStopSnap = await getDoc(ourStopNameRef);
      ourReturnedStopLatitude = ourStopSnap.data().geopoint["latitude"]
      setDestinationLat(ourReturnedStopLatitude)
      ourReturnedStopLongitude = ourStopSnap.data().geopoint["longitude"]
      setDestinationLong(ourReturnedStopLongitude)

      //Setting the destination to our stop.
    }
    else {
      console.log("Error our stop not found")
    }
    queryString = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + thisReturnedStopLatitude + '%2C' + thisReturnedStopLongitude + '&destinations=' + ourReturnedStopLatitude + '%2C' + ourReturnedStopLongitude + '&key=AIzaSyCLzguH1NtS7s2O1EwpeuxTmsSl4Im5I3c';
    CalculateTime();
  }


  useEffect(() => {

    // this bus id is form the bus detail page
    // const BUSID = route.params.busID;

    const busDetailsId = route.params.busID;
    setBusId(busDetailsId);
    // console.log(busId)


    fetchBusData(route.params.busID);


  }, [stopPointer, route])


  function CalculateTime() {

    //https://developers.google.com/maps/documentation/distance-matrix/distance-matrix#maps_http_distancematrix_bicycling-js
    // https://www.latlong.net/convert-address-to-lat-long.html

    console.log(queryString)
    // var queryString = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + originLat + '%2C' + originLong + '&destinations=' + destinationLat + '%2C' + destinationLong + '&key=AIzaSyCLzguH1NtS7s2O1EwpeuxTmsSl4Im5I3c';

    var config = {
      method: 'get',
      url: queryString,
      headers: {}
    };

    axios(config)
      .then(function (response) {

        var timeToDestination = JSON.stringify(response.data.rows[0].elements[0].duration.value) //code to pull the time in seconds.


        //Calculate total time estimate for time at stops.
        // var totalStopTime = 0;

        // if (numberOfStops > stopPointer) {
        //   totalStopTime = numberOfStops - stopPointer;
        // }
        // else {
        //   totalStopTime = 0;
        // }


        // timeToDestination = parseInt(timeToDestination) + (totalStopTime) * 120; //adding 2 mins per stop.
        timeToDestination = parseInt(timeToDestination); //adding 2 mins per stop.

        if (stopPointer != 0) {
          setTime(timeToDestination); //Do not set the timeToNext the first time, set all other times.
          //First time bus hasn't left the station yet so time to destination should be nothing.
        }

      })
      .catch(function (error) {
        alert(error);
      });
  }



  function handleChangeCount(text) {
    setPassengerCount(convertStringToNumber(text));
  }

  function handleChangeText(text) {
    setComments(text);
  }

  function convertStringToNumber(string) {
    let currentNumber = "";
    if (string.length > 0) {
      currentNumber = parseInt(string);
    }
    return currentNumber;
  }

  function increaseCount() {

    //Max capacity
    if (passengerCount < maxCapacity) {
      setPassengerCount((convertStringToNumber(passengerCount) + 1).toString());
    }
  }

  function decreaseCount() {
    setPassengerCount((convertStringToNumber(passengerCount) - 1).toString());
  }

  function handleShortcut_full() {
    setPassengerCount(maxCapacity.toString());
  }

  function handleShortcut_mid() {
    setPassengerCount((maxCapacity / 2).toString());
  }

  function handleShortcut_low() {
    setPassengerCount("10");
  }

  function handleShortcut_empty() {
    setPassengerCount("0");
  }

  async function handleSubmitUpdates() {
    console.log(passengerCount);
    console.log(comments);


    const docRef = doc(db, "Bus", busId)

    await updateDoc(docRef, {
      passengers: convertStringToNumber(passengerCount),
      comments: comments
    })

  }

  async function handleSubmitDepart() {


    const docRef = doc(db, "Bus", busId)

    const date = new Date();


    //Run Google Maps API, and get time from current stop to next stop. Write to DB as timeToNext.

    // Google Maps API turns an updated countdown hook value we also pass to the database.


    //This writes to the database.

    if (isFirstRender.current) {
      isFirstRender.current = false;
      setStopPointer(stopPointer + 1);
      nav.navigate("Home")
    }
    else {
      await updateDoc(docRef, {
        passengers: passengerCount,
        currentStop: currentStop, //this should set the stop to the next stop.
        comments: comments,
        departure: date,
        stopPointer: stopPointer + 1,
        timeToDestination: countdown //this field should be renamed to timeToArrival, but will leave for now to not break system.
      })

      setStopPointer(stopPointer + 1); //increment the stop pointer and trigger reread of database from useEffect. The stop pointer is always pointed towards next stop

      //Go back to Bus Details.
      nav.navigate("Home", { refreshList: true });
    }

  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <Text style={{ marginTop: 10 }}>Enter updated data for bus: </Text>
        <Text style={styles.title}>{busId}</Text>
        <Text></Text>

        {/* Count */}
        <View style={styles.container}>
          <Text style={styles.formLabel}>Passengers Boarding</Text>
          <View style={styles.row}>
            <Pressable
              onPress={decreaseCount}
              style={[styles.btn_circle, styles.decrease_btn]}
            >
              <Text style={styles.btn_circle_text}>-</Text>
            </Pressable>
            <TextInput
              name="count"
              style={styles.numberInput}
              value={passengerCount}
              onChangeText={handleChangeCount}
              maxLength={30} //setting limit of input
              keyboardType="number-pad"
            />
            <Pressable
              onPress={increaseCount}
              style={[styles.btn_circle, styles.increase_btn]}
            >
              <Text style={styles.btn_circle_text}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Shortcut */}
        <View style={styles.container}>
          <Text style={styles.formLabel}>Capacity Shortcut</Text>
          <View style={styles.row}>
            <Pressable
              onPress={handleShortcut_full}
              style={[styles.btn_shortcut, styles.fullButton]}
            >
              <Image style={styles.bus} source={require('./images/full.png')} />
              <Text style={{ textAlign: "center" }}>100%</Text>
            </Pressable>
            <Pressable
              onPress={handleShortcut_mid}
              style={[styles.btn_shortcut, styles.midButton]}
            >
              <Image style={styles.bus} source={require('./images/half-full.png')} />
              <Text style={{ textAlign: "center" }}>~50%</Text>
            </Pressable>
            <Pressable
              onPress={handleShortcut_low}
              style={[styles.btn_shortcut, styles.emptyButton]}
            >
              <Image style={styles.bus} source={require('./images/low.png')} />
              <Text style={{ textAlign: "center" }}>~20%</Text>
            </Pressable>
            <Pressable
              onPress={handleShortcut_empty}
              style={[styles.btn_shortcut, styles.emptyButton]}
            >
              <Image style={styles.bus} source={require('./images/empty.png')} />
              <Text style={{ textAlign: "center" }}>~0%</Text>
            </Pressable>
          </View>
          <Text></Text>
        </View>

        {/* Comment */}
        <View style={styles.container}>
          <Text style={styles.formLabel}>Optional Comments:</Text>
          <Text></Text>
          <TextInput
            value={comments}
            onChangeText={handleChangeText}
            multiline={true}
            style={s.commentBox}
          />
        </View>
        {/* Submit */}
        <View style={styles.buttonContainer}>
          <Pressable onPress={handleSubmitUpdates} style={s.submitButton}>
            <Text style={s.whiteBtnText}>Update Details</Text>
          </Pressable>
          <Pressable onPress={handleSubmitDepart} style={s.submitButton}>
            <Text style={s.whiteBtnText}>Depart Bus</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,

    alignItems: "center",
    justifyContent: "space-between"
  },

  container: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },

  row: {
    flexDirection: "row",
    marginTop: 20,
    width: "95%",
    justifyContent: "space-around",
  },

  title: {
    fontSize: 35,
    color: "steelblue",
  },

  formLabel: {
    textAlign: "center",
  },

  numberInput: {
    width: 100,
    padding: 10,
    backgroundColor: "white",
    borderColor: "black",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 10
  },

  btn_circle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderColor: "white",
    justifyContent: "center",
    marginHorizontal: 10,
  },

  btn_circle_text: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center"
  },

  increase_btn: {
    backgroundColor: "green",
  },

  decrease_btn: {
    backgroundColor: "red",
  },

  btn_shortcut: {
    width: "20%",
    height: 80,
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "90%",
    marginTop: 20
  },
  bus: {
    width: 70,
    height: 70,
  }
});
