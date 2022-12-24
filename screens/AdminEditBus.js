import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import SelectList from "react-native-dropdown-select-list";
import { stringify } from "@firebase/util";
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminEditBus({ route, navigation }) {
  const [busId, setBusId] = useState("");
  const [capacity, setCapacity] = React.useState("");
  const [selectedRoute, setSelectedRoute] = React.useState("");
  const [isExpress, setIsExpress] = React.useState(false);
  const [routeData, setRouteData] = React.useState([]);


  // routeData = [
  //   { key: "r01", value: "Route 1 - CBD to Hawthorne" },
  //   { key: "r02", value: "Route 2 - Richmond to CBD" },
  //   { key: "r03", value: "Route 3 - Boxhill to Springvale" },
  //   { key: "r04", value: "Route 4 - CBD to Albert Park" },
  // ];

  const expressOptions = [
    { key: true, value: "Express" },
    { key: false, value: "All Stations" },
  ];

  useEffect(() => {
    setBusId(route.params.busId) 
    console.log(busId)
    
  
    // setBusId(route.params.busId);

    const fetchRoutesData = async function(){
      let tempArray = []

      const querySnapshot = await getDocs(collection(db, "Route"));
      querySnapshot.forEach((doc) => {        
        tempArray.push({key: doc.id, value: doc.id})
      })

      setRouteData(tempArray)

      console.log(routeData)
      // getRouteOptions(tempArray)
    }

    async function fetchBusData(busId){

      const docRef = doc(db, "Bus", busId);
      
      const docSnap = await getDoc(docRef)

      if(docSnap.exists()){
        const foundBusData = docSnap.data()
        const foundBusId = docSnap.id;

        console.log(foundBusData)

        //Set States
        // setBusId(foundBusId) 
        setCapacity(foundBusData.capacity.toString())
        setSelectedRoute(foundBusData.route)
        setIsExpress(foundBusData.isExpress);

      } else {
        console.log("Error bus not found")
      }
    };
 


    fetchBusData(route.params.busId)
    fetchRoutesData();
  }, [route.params.busId]);

  function handleCapacityInput(value) {
    value = parseInt(value);
    setCapacity(value);
  }

  function getDefaultRoute() {
    var defaultRoute = routeData.find(x => x.value == selectedRoute)

    return defaultRoute
  }

  function getDefaultIsExpress(){

    if(isExpress){
      return expressOptions[0]
    } else {
      return expressOptions[1]
    }

  }

  async function handleEditBus() {
    const docRef = doc(db, "Bus", busId);
    await updateDoc(docRef, {
      capacity: parseInt(capacity),
      route: selectedRoute,
      isExpress: isExpress,
    });

    alert("Bus Successfully Edited.");
  }

  async function handleDeleteBus() {
    await deleteDoc(doc(db, "Bus", busId));

    alert("Bus " + busId + " successfully deleted.");
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.busId}>{busId}</Text>
      <View>
        <Text style={styles.label}>Bus Capacity:</Text>
        <TextInput
          style={styles.numberInput}
          value={capacity} 
          onChangeText={handleCapacityInput}
          keyboardType="number-pad"
        />
      </View>
      <Text style={styles.label}>Route:</Text>
      <SelectList setSelected={setSelectedRoute} data={routeData} defaultOption={getDefaultRoute}/>
      <Text style={styles.label}>Route Type:</Text>
      <SelectList setSelected={setIsExpress} data={expressOptions} defaultOption={getDefaultIsExpress}/>

    <Text></Text>
      <Pressable onPress={handleEditBus} style={styles.button}>
        <Text style={styles.buttonText}>Save Edits</Text>
      </Pressable>

      <Pressable onPress={handleDeleteBus}  style={styles.button}>
        <Text style={styles.buttonText}>Cancel Bus</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15
  },
  input: {
    width: "80%",
    padding: 10,
    backgroundColor: "white",
    borderColor: "black",
    fontSize: 16,
    alignItems: "center"
  },

  numberInput: {
    padding: 10,
    backgroundColor: "white",
    borderColor: "black",
    fontSize: 16,
    textAlign: "center"
  },

  button: {
    width: "40%",
    padding: 10,
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "steelblue",
    borderRadius: 10
  },

  buttonText: {
    color: "white"
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 16
  },

  busId: {
    color: "steelblue",
    fontSize: 30,
    marginTop: 15,
    marginBottom: 15
  }

});
